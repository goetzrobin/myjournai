import { ChatOpenAI } from '@langchain/openai';
import { eventHandler } from 'h3';
import { useRuntimeConfig } from 'nitropack/runtime';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { END, MemorySaver, MessageGraph, START } from '@langchain/langgraph';
import { createConversationChain } from '~myjournai/onboarding-server';
import { pushChunksToStream } from '~myjournai/utils-server';
import { db } from '~db/client';
import { users } from '~db/schema/users';
import { eq } from 'drizzle-orm';

const memorySaver = new MemorySaver();

export default eventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const { openApiKey } = useRuntimeConfig(event);
  const threadId = `${event.context.user?.id ?? crypto.randomUUID()}-onboarding-final-convo`;
  const checkpointConfig = { configurable: { thread_id: threadId } };

  const abortController = new AbortController();
  //TODO: parse body
  const body = await readBody(event);
  const eventStream = createEventStream(event);

  console.log(body, userId);

  eventStream.onClosed(async () => {
    console.log('stream closed aborting all llm calls');
    abortController.abort();
    await eventStream.push('[DONE]');
    await eventStream.close();
  });

  const llm = new ChatOpenAI({ temperature: 0.6, apiKey: openApiKey });
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
    .then(async () => {
      console.log(await app.getState(checkpointConfig))
      await db.update(users).set({ onboardingCompletedAt: new Date(), updatedAt: new Date() }).where(eq(users.id, userId));
    });

  console.log('sending stream');
  return eventStream.send();
});
