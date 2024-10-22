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
  UserInputForm,
  useStreamResponse
} from '~myjournai/chat-client';
import React, { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import {
  useLatestSessionLogBySlugQuery,
  useSessionEndMutation,
  useSessionLogMessagesQuery,
  useSessionStartMutation
} from '~myjournai/session-client';
import { SessionLogWithSession } from '~db/schema/session-logs';
import { useEngagementTracker } from './-track-engagement';

export const Drawers = ({
                          userId,
                          slug,
                          isEnded,
                          setIsEnded,
                          sessionLogId,
                          isSessionNotStarted,
                          children
                        }: PropsWithChildren<{
  isEnded: boolean;
  setIsEnded: Dispatch<SetStateAction<boolean>>;
  userId: string | undefined;
  slug: string | undefined;
  sessionLogId: string | undefined;
  isSessionNotStarted: boolean
}>) => {
  const nav = useNavigate();
  const startMutation = useSessionStartMutation({ userId, slug });
  const endMutation = useSessionEndMutation({ userId, sessionLogId });
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
    <PostQuestionsDrawer status={endMutation.status} open={isEnded} setOpen={setIsEnded}
                         onEndClicked={onEndClicked} />
    {children}
  </>;
};

export const OnlyTheChat = ({
                              url,
                              userId,
                              sessionLog,
                              error,
                              setIsEnded,
                              isSuccessSessionLog
                            }: {
  url: string;
  userId: string | undefined;
  sessionLog: SessionLogWithSession | undefined;
  isSuccessSessionLog: boolean;
  error: any;
  setIsEnded(isEnded: boolean): void;
}) => {
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
    url
  });
  useAutoStartMessage({
    isSessionLogExists: !!(sessionLog && sessionLog.status === 'IN_PROGRESS'),
    isIdle: mutation.isIdle,
    isMessageSuccess: isSuccess,
    isNoMessages: (messages ?? []).length === 0,
    startStream
  });
  const { endEngagement } = useEngagementTracker({ sessionLogId: sessionLog?.id });

  const isReadyForUserInput = isSuccessSessionLog && sessionLog?.status === 'IN_PROGRESS';
  const stepsRemaining = (sessionLog?.session?.stepCount ?? 99) - currentStepInfo.currentStep;
  const onEndConversationPressed = () => {
    endEngagement();
    setIsEnded(true);
  };


  return <ChatContainer withMenu sessionLogId={sessionLog?.id} userId={userId}>
    {(!isMessagesPending || sessionLog?.preFeelingScore !== undefined) ? null : <PreviousMessagesLoader />}
    {!(!isMessagesPending && isMessagesError) ? null :
      <LoadPreviousMessagesError error={error} refetchMessages={refetchMessages} />}
    <MessagesContainer>
      {mapNonStreamedDBMessagesToChatComponents(messageChunksByTimestamp, messages ?? [])}
      {mapChunksToChatComponents(messageChunksByTimestamp, startStream, removeChunksForTimestamp, pendingChunkStatus === 'error', () => mutation.mutate({ retry: true }))}
      {(mutation.isPending && !isStreaming) ? <ThinkingIndicator /> : null}
    </MessagesContainer>
    {
      !isReadyForUserInput ? null :
        <UserInputForm
          onEndConversationPressed={onEndConversationPressed}
          stepsRemaining={stepsRemaining}
          startStream={startStream}
          sessionLogId={sessionLog?.id}
        />}
  </ChatContainer>;

};
export const SessionRouteComponent = ({ slug }: { slug: string }) => {
  const userId = useAuthUserIdFromHeaders();
  const { data: sessionLog, isSuccess: isSuccessSessionLog, error } = useLatestSessionLogBySlugQuery({
    slug,
    userId
  });
  const isSessionNotStarted = isSuccessSessionLog && !sessionLog;
  const [isEnded, setIsEnded] = useState(false);
  return <Drawers slug={slug} isEnded={isEnded} isSessionNotStarted={isSessionNotStarted} sessionLogId={sessionLog?.id}
                  userId={userId} setIsEnded={setIsEnded}>
    {isSessionNotStarted ? null :
      <OnlyTheChat url={`/api/sessions/slug/${slug}`}
                   sessionLog={sessionLog}
                   isSuccessSessionLog={isSuccessSessionLog}
                   userId={userId}
                   setIsEnded={setIsEnded}
                   error={error}
      />}
  </Drawers>;
};
