import { createFileRoute, useNavigate } from '@tanstack/react-router';
import classes from './index.module.css';
import { useEffect, useRef } from 'react';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import Chat from './-chat';
import { useUserCompleteOnboardingMutation } from '~myjournai/user-client';
import { useOnboardingLetterQuery } from '~myjournai/onboarding-client';
import {
  useLatestSessionLogBySlugQuery,
  useSessionEndMutation,
  useSessionLogMessagesQuery
} from '~myjournai/session-client';
import { ChatError } from '~myjournai/chat-client';

export const Route = createFileRoute('/_app/onboarding/final-convo/')({
  component: FinalConvo,
  errorComponent: ChatError
});

function FinalConvo() {
  const nav = useNavigate();

  const userId = useAuthUserIdFromHeaders();
  const conversationInitialized = useRef(false);
  const completeOnboardingMutation = useUserCompleteOnboardingMutation({ userId });
  const existingLetter = useOnboardingLetterQuery(userId).data?.content;
  const {
    data: sessionLog,
    isSuccess: isSuccessSessionLog,
    refetch
  } = useLatestSessionLogBySlugQuery({ slug: 'onboarding-v0', userId });
  const sessionLogMessagesQuery = useSessionLogMessagesQuery(sessionLog?.id);
  const endMutation = useSessionEndMutation({ userId, sessionLogId: sessionLog?.id });

  const isConversationMutatedToFinish = endMutation.isSuccess;
  const sessionInProgress = sessionLog?.status === 'IN_PROGRESS';
  const isShowingUserInput = isSuccessSessionLog && sessionInProgress;
  const isShowingLetterReflection = (isSuccessSessionLog && !sessionInProgress)
    && (completeOnboardingMutation.isPending || completeOnboardingMutation.isIdle) && !endMutation.isSuccess;
  const isShowingChat = userId && conversationInitialized && isSuccessSessionLog && !isShowingLetterReflection;
  const isMessageSuccess = sessionLogMessagesQuery.isSuccess;
  const messages = sessionLogMessagesQuery.data ?? [];


  const onEndConversation = () => {
    console.log(`ending conversation ${sessionLog?.id} ${userId}`);
    endMutation.mutate({
      postAnxietyScore: null,
      postFeelingScore: null,
      postMotivationScore: null
    }, {
      onSuccess: () => {
        setTimeout(() => nav({ to: '/' }), 500)
      }
    });
  };

  useEffect(() => {
    if (!isConversationMutatedToFinish && completeOnboardingMutation.isIdle && !conversationInitialized.current && isSuccessSessionLog && !sessionInProgress) {
      conversationInitialized.current = true;
      console.log('initializing onboarding')
      setTimeout(() => completeOnboardingMutation.mutate(undefined, { onSuccess: () => refetch() }), 50);
    }
  }, [completeOnboardingMutation.isIdle, conversationInitialized, completeOnboardingMutation, userId, sessionInProgress, isSuccessSessionLog, isConversationMutatedToFinish]);

  return <>
    {!isShowingLetterReflection ? null :
      <div className="overflow-hidden relative h-full w-full grid">
        <div className={classes.gradientAnimation} />
        <div className="-mt-20 place-self-center">
          <h1 className="text-2xl text-center">One second while Sam is reflecting on your letter</h1>
        </div>
      </div>}
    {!isShowingChat ? null :
      <Chat endMutationStatus={endMutation.status}
            onEndConversation={onEndConversation}
            isSessionLogExists={sessionInProgress}
            isShowingUserInput={isShowingUserInput}
            sessionStepCount={sessionLog?.session?.stepCount ?? 99}
            isMessageSuccess={isMessageSuccess}
            messages={messages}
            userId={userId}
            sessionLogId={sessionLog?.id}
      >
        {!existingLetter || !isMessageSuccess ? null : <div className="px-8 pb-12 flex items-center justify-end">
          <div
            className="overflow-hidden relative text-left animate-in zoom-in-50 fade-in-0 flex items-start p-4 h-80 rotate-6 w-56 text-sm pressed:bg-muted bg-background text-muted-foreground border rounded-xl">
            {existingLetter}
            <span
              className="absolute left-0 right-0 w-full bottom-0 h-8 bg-gradient-to-b to-background from-transparent" />
          </div>
        </div>}
      </Chat>}
  </>;
}

