import { useNavigate } from '@tanstack/react-router';
import {
  ChatContainer,
  mapChunksToChatComponents,
  mapNonStreamedDBMessagesToChatComponents,
  MessagesContainer,
  PostQuestionsDrawer,
  PreQuestionsDrawer,
  QuestionDrawerScores,
  ThinkingIndicator,
  useAutoStartMessage,
  useChatEnterSubmit,
  UserInputForm,
  useStreamResponse
} from '~myjournai/chat-client';
import React, { useState } from 'react';
import { Button, useScrollAnchor } from '~myjournai/components';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import {
  useLatestSessionLogBySlugQuery,
  useSessionEndMutation,
  useSessionLogMessagesQuery,
  useSessionStartMutation
} from '~myjournai/session-client';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

const MessagesLoader = () => <div className="h-full w-full flex items-center justify-center space-x-2 text-primary">
  <Loader2 className="h-5 w-5 animate-spin" />
  <span className="text-sm font-medium">Loading previous messages...</span>
</div>;
const MessagesError = ({ error, refetchMessages }: {
  error: { message: string } | null;
  refetchMessages: () => void
}) => {
  return <div className="h-full w-full flex flex-col items-center justify-center">
    <AlertCircle className="mb-2 w-8 h-8 text-destructive mx-auto" />
    <h1 className="mb-4 font-bold">Oops! Something went wrong</h1>
    <p className="mb-6 px-4 max-w-sm text-xs text-muted-foreground">
      {error?.message ?? 'We\'re sorry, but it seems there was an error loading your messages. Please try again or reach out to us if the issue persists.'}
    </p>
    <Button onPress={() => refetchMessages()} className="w-full flex items-center max-w-xs mx-auto">
      <RefreshCw className="mr-2 h-4 w-4" />
      Reload Page
    </Button>
  </div>;
};

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
    removeChunksForTimestamp
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
  const { onKeyDown, formRef, handleSubmit, input, setInput } = useChatEnterSubmit(startStream);
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
        {(!isMessagesPending || sessionLog?.preFeelingScore !== undefined) ? null : <MessagesLoader />}
        {!(!isMessagesPending && isMessagesError) ? null :
          <MessagesError error={error} refetchMessages={refetchMessages} />}
        <MessagesContainer messagesRef={messagesRef} scrollRef={scrollRef} visibilityRef={visibilityRef}>
          {mapNonStreamedDBMessagesToChatComponents(messageChunksByTimestamp, messages ?? [])}
          {mapChunksToChatComponents(messageChunksByTimestamp, startStream, removeChunksForTimestamp)}
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
