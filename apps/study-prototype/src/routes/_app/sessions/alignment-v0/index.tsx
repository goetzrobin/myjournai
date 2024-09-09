import { createFileRoute } from '@tanstack/react-router';
import {
  ChatContainer,
  ChatError,
  mapChunksToChatComponents,
  mapNonStreamedDBMessagesToChatComponents,
  MessagesContainer,
  ThinkingIndicator,
  useAutoStartMessage,
  useChatEnterSubmit,
  useEndConversationOnToolcallChunk,
  UserInputForm,
  useStreamResponse
} from '~myjournai/chat-client';
import React from 'react';
import { useScrollAnchor } from '~myjournai/components';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import {
  useLatestSessionLogBySlugQuery,
  useSessionEndMutation,
  useSessionLogMessagesQuery,
  useSessionStartMutation
} from '~myjournai/session-client';


export const Route = createFileRoute('/_app/sessions/alignment-v0/')({
  component: Alignment,
  errorComponent: ChatError,
});


function Alignment() {
  const userId = useAuthUserIdFromHeaders();
  const slug = 'alignment-v0';
  const startMutation = useSessionStartMutation({ userId, slug });
  const { data: sessionLog, isSuccess: isSuccessSessionLog } = useLatestSessionLogBySlugQuery({ slug, userId });
  const { data: messages, isSuccess } = useSessionLogMessagesQuery(sessionLog?.id);
  const { chunks, mutation, startStream, isStreaming, messageChunksByTimestamp } = useStreamResponse({
    userId,
    url: `/api/sessions/slug/alignment-v0`
  });
  useAutoStartMessage({
    isSessionLogExists: !!(sessionLog && sessionLog.status === 'IN_PROGRESS'),
    isIdle: mutation.isIdle,
    isMessageSuccess: isSuccess,
    isNoMessages: (messages ?? []).length === 0,
    startStream
  });
  const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor();
  const { onKeyDown, formRef, handleSubmit, input, setInput } = useChatEnterSubmit(startStream);
  const endMutation = useSessionEndMutation({ userId, sessionLogId: sessionLog?.id });
  const { isEnded } = useEndConversationOnToolcallChunk(chunks);
  const isSessionNotStarted = isSuccessSessionLog && !sessionLog;
  const isReadyForUserInput = isSuccessSessionLog && sessionLog?.status === 'IN_PROGRESS';

  const onStartClicked = (scores: {
    preAnxietyScore: number,
    preFeelingScore: number,
    preMotivationScore: number
  }) => startMutation.mutate(scores);

  const onEndClicked = (scores: {
    preAnxietyScore: number,
    preFeelingScore: number,
    preMotivationScore: number
  }) => endMutation.mutate({
    postAnxietyScore: scores.preAnxietyScore,
    postFeelingScore: scores.preFeelingScore,
    postMotivationScore: scores.preMotivationScore
  });

  return <>
    {!isEnded ? null : <FamilyDrawer onStart={onEndClicked} />}
    {!isSessionNotStarted ? null : <FamilyDrawer onStart={onStartClicked} />}
    {isSessionNotStarted ? null :
      <ChatContainer>
        <MessagesContainer messagesRef={messagesRef} scrollRef={scrollRef} visibilityRef={visibilityRef}>
          {mapNonStreamedDBMessagesToChatComponents(messageChunksByTimestamp, messages ?? [])}
          {mapChunksToChatComponents(messageChunksByTimestamp)}
          {(mutation.isPending && !isStreaming) ? <ThinkingIndicator /> : null}
        </MessagesContainer>
        {!isReadyForUserInput ? null :
          <UserInputForm formRef={formRef} input={input} setInput={setInput} onKeyDown={onKeyDown}
                         handleSubmit={handleSubmit} />}

      </ChatContainer>}
  </>;
}
