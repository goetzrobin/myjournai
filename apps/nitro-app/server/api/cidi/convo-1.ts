import { ChatOpenAI } from '@langchain/openai';
import { eventHandler } from 'h3';
import { useRuntimeConfig } from 'nitropack/runtime';
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from '@langchain/core/prompts';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { END, MemorySaver, MessageGraph, START } from '@langchain/langgraph';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// const reflectionPrompt = ChatPromptTemplate.fromMessages([
//   [
//     'system',
//     `You are a teacher grading an essay submission.
// Generate critique and recommendations for the user's submission.
// Provide detailed recommendations, including requests for length, depth, style, etc.`
//   ],
//   new MessagesPlaceholder('messages')
// ]);
// const reflect = reflectionPrompt.pipe(llm);
// const generationNode = async (messages: BaseMessage[]) => {
//   return [await conversationChain.invoke({ messages })];
// };
// const reflectionNode = async (messages: BaseMessage[]) => {
//   // Other messages we need to adjust
//   const clsMap: { [key: string]: new (content: string) => BaseMessage } = {
//     ai: HumanMessage,
//     human: AIMessage
//   };
//   // First message is the original user request. We hold it the same for all nodes
//   const translated = [
//     messages[0],
//     ...messages
//       .slice(1)
//       .map((msg) => new clsMap[msg._getType()](msg.content.toString()))
//   ];
//   const res = await reflect.invoke({ messages: translated });
//   // We treat the output of this as human feedback for the generator
//   return [new HumanMessage({ content: res.content })];
// };
// const shouldContinue = (messages: BaseMessage[]) => {
//   if (messages.length > 0) {
//     return 'stream-final';
//   }
//   return 'reflect';
// };

const memorySaver = new MemorySaver();
export default eventHandler(async (event) => {
  const threadId = `${event.context.user?.id ?? 'unknown'}-cidi-convo-1`;
  const checkpointConfig = { configurable: { thread_id: threadId } };

  const abortController = new AbortController();
  const body = await readBody(event);
  const eventStream = createEventStream(event);

  console.log(body);

  eventStream.onClosed(async () => {
    console.log('stream closed aborting all llm calls');
    abortController.abort();
    await eventStream.push('[DONE]');
    await eventStream.close();
  });

  const { openApiKey } = useRuntimeConfig(event);
  const llm = new ChatOpenAI({ temperature: 0, apiKey: openApiKey });
  llm.bind({ signal: abortController.signal });

  console.log('lets go');
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a friendly chatbot trying to ask the user about his career identity confusion.`
    ],
    new MessagesPlaceholder('messages')
  ]);
  /**
   * Note that the descriptions here are crucial, as they will be passed along
   * to the model along with the class name.
   */
  const endConvoSchema = z.object({
    operation: z.enum(['end-conversation'])
  });
  const endConvoTool = new DynamicStructuredTool({
    name: 'end-conversation',
    description: 'Can end the conversation for the user.',
    schema: endConvoSchema,
    func: async ({ operation }) => operation
  });
  const conversationChain = prompt.pipe(llm.bindTools([endConvoTool]));

  const streamFinalMessageNode = async (messages: BaseMessage[]) => {
    console.log('messages', messages.map(m => m.content));
    const finalStream = await conversationChain.stream({ messages });
    await eventStream.push('[START]');
    let content = '';
    try {
      for await (const chunk of finalStream) {
        if (abortController.signal.aborted) {
          console.log('ending stream');
          break;
        }
        content += chunk.content;
        // console.log('pushing to', chunk.content)
        await eventStream.push(JSON.stringify(chunk.toDict()));
      }
    } catch (err) {
      console.error(err);
      // Ignore error
    } finally {
      console.log('finally done');
      await eventStream.push('[DONE]');
      await eventStream.close();
    }
    return new AIMessage({ content: content });
  };

  // Define the graph
  const workflow = new MessageGraph()
    .addNode('stream-final', streamFinalMessageNode)
    .addEdge(START, 'stream-final')
    .addEdge('stream-final', END)
  ;

  const app = workflow.compile({ checkpointer: memorySaver });

  const id = crypto.randomUUID();
  const content = body.message;
  app.invoke(body.type === 'ai' ? new AIMessage({ id, content }) : new HumanMessage({ id, content }), checkpointConfig)
    .then(async () => console.log(await app.getState(checkpointConfig)));

  console.log('sending stream');
  return eventStream.send();
});
