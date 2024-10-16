import { useNavigate } from '@tanstack/react-router';
import {
  ChatContainer,
  LoadPreviousMessagesError,
  mapChunksToChatComponents,
  mapNonStreamedDBMessagesToChatComponents,
  MessagesContainer,
  PostQuestionsDrawer,
  PreQuestionsDrawer,
  PreviousMessagesLoader,
  QuestionDrawerScores,
  ThinkingIndicator,
  useAutoStartMessage,
  useChatEnterSubmit,
  UserInputForm,
  useStreamResponse
} from '~myjournai/chat-client';
import React, { useState } from 'react';
import { useScrollAnchor } from '~myjournai/components';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import {
  useLatestSessionLogBySlugQuery,
  useSessionEndMutation,
  useSessionLogMessagesQuery,
  useSessionStartMutation
} from '~myjournai/session-client';

export const SessionRouteComponent = ({ slug }: { slug: string }) => {
  const nav = useNavigate();
  const userId = useAuthUserIdFromHeaders();
  const startMutation = useSessionStartMutation({ userId, slug });
  const { data: sessionLog, isSuccess: isSuccessSessionLog, error } = useLatestSessionLogBySlugQuery({
    slug,
    userId
  });
  const {
    data: messages,
    isSuccess,
    isError: isMessagesError,
    isPending: isMessagesPending,
    refetch: refetchMessages
  } = useSessionLogMessagesQuery(sessionLog?.id);
  const {
    mutation,
    startStream,
    isStreaming,
    messageChunksByTimestamp,
    currentStepInfo,
    removeChunksForTimestamp,
    pendingChunkStatus
  } = useStreamResponse({
    userId,
    url: `/api/sessions/slug/${slug}`
  });
  useAutoStartMessage({
    isSessionLogExists: !!(sessionLog && sessionLog.status === 'IN_PROGRESS'),
    isIdle: mutation.isIdle,
    isMessageSuccess: isSuccess,
    isNoMessages: (messages ?? []).length === 0,
    startStream
  });
  const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor();
  const { onKeyDown, formRef, handleSubmit, input, setInput } = useChatEnterSubmit({ startStream, sessionLogId: sessionLog?.id });
  const endMutation = useSessionEndMutation({ userId, sessionLogId: sessionLog?.id });
  const [isEnded, setIsEnded] = useState(false);
  const isSessionNotStarted = isSuccessSessionLog && !sessionLog;
  const isReadyForUserInput = isSuccessSessionLog && sessionLog?.status === 'IN_PROGRESS';
  const stepsRemaining = (sessionLog?.session?.stepCount ?? 99) - currentStepInfo.currentStep;

  const onStartClicked = (scores: QuestionDrawerScores) => startMutation.mutate({
    preAnxietyScore: scores.anxietyScore,
    preFeelingScore: scores.feelingScore,
    preMotivationScore: scores.motivationScore
  });

  const onEndClicked = (scores: QuestionDrawerScores) => endMutation.mutate({
    postAnxietyScore: scores.anxietyScore,
    postFeelingScore: scores.feelingScore,
    postMotivationScore: scores.motivationScore
  }, {
    onSuccess: () => setTimeout(() => nav({ to: '/' }), 500)
  });

  return <>
    <PreQuestionsDrawer status={startMutation.status} open={isSessionNotStarted} onStartClicked={onStartClicked} />
    <PostQuestionsDrawer status={endMutation.status} open={isEnded} setOpen={setIsEnded} onEndClicked={onEndClicked} />
    {isSessionNotStarted ? null :
      <ChatContainer withMenu sessionLogId={sessionLog?.id} userId={userId}>
        {(!isMessagesPending || sessionLog?.preFeelingScore !== undefined) ? null : <PreviousMessagesLoader />}
        {!(!isMessagesPending && isMessagesError) ? null : <LoadPreviousMessagesError error={error} refetchMessages={refetchMessages} />}
        <MessagesContainer messagesRef={messagesRef} scrollRef={scrollRef} visibilityRef={visibilityRef}>
          {mapNonStreamedDBMessagesToChatComponents(messageChunksByTimestamp, messages ?? [])}
          {mapChunksToChatComponents(messageChunksByTimestamp, startStream, removeChunksForTimestamp, pendingChunkStatus === 'error', () => mutation.mutate({retry: true}))}
          {(mutation.isPending && !isStreaming) ? <ThinkingIndicator /> : null}
        </MessagesContainer>
        {
          !isReadyForUserInput ? null :
            <UserInputForm
              onEndConversationPressed={() => setIsEnded(true)}
              stepsRemaining={stepsRemaining}
              formRef={formRef} input={input} setInput={setInput} onKeyDown={onKeyDown}
              handleSubmit={handleSubmit} />}

      </ChatContainer>}
  </>;
};
