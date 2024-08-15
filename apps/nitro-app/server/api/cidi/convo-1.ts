import { ChatOpenAI } from '@langchain/openai';
import { eventHandler } from 'h3';
import { useRuntimeConfig } from 'nitropack/runtime';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { END, MemorySaver, MessageGraph, START } from '@langchain/langgraph';
import { createConversationChain } from '~myjournai/onboarding-server';
import { pushChunksToStream } from '~myjournai/utils-server';

const memorySaver = new MemorySaver();

export default eventHandler(async (event) => {
  const { openApiKey } = useRuntimeConfig(event);
  const threadId = `${event.context.user?.id ?? 'unknown'}-cidi-convo-1`;
  const checkpointConfig = { configurable: { thread_id: threadId } };

  const abortController = new AbortController();
  //TODO: parse body
  const body = await readBody(event);
  const eventStream = createEventStream(event);

  console.log(body);

  eventStream.onClosed(async () => {
    console.log('stream closed aborting all llm calls');
    abortController.abort();
    await eventStream.push('[DONE]');
    await eventStream.close();
  });

  const llm = new ChatOpenAI({ temperature: 0, apiKey: openApiKey });
  llm.bind({ signal: abortController.signal });
  const conversationChain = await createConversationChain(event.context.user?.id, llm);

  console.log('lets go');
  const streamFinalMessageNode = async (messages: BaseMessage[]) => {
    const finalStream = await conversationChain.stream({ messages });
    const generatedMessage = await pushChunksToStream(eventStream, finalStream, abortController);
    console.log(generatedMessage);
    return new AIMessage({ content: generatedMessage });
  };

  // Define the graph
  const workflow = new MessageGraph()
    .addNode('stream-final', streamFinalMessageNode)
    .addEdge(START, 'stream-final')
    .addEdge('stream-final', END)
  ;

  const app = workflow.compile({ checkpointer: memorySaver });

  const messageFields = { id: crypto.randomUUID(), content: body.message };
  const graphInput = body.type === 'ai' ? new AIMessage(messageFields) : new HumanMessage(messageFields);
  app.invoke(graphInput, checkpointConfig)
    // TODO: checkpointer should persist to postgres
    .then(async () => console.log(await app.getState(checkpointConfig)));

  console.log('sending stream');
  return eventStream.send();
});
