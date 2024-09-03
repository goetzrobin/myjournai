import { createFileRoute } from '@tanstack/react-router';
import classes from './index.module.css';
import { useEffect, useRef } from 'react';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import Chat from './-chat';
import { useUserCompleteOnboardingMutation } from '@myjournai/user-client';
import { useOnboardingLetterQuery } from '~myjournai/onboarding-client';
import { useLatestSessionLogBySlugQuery, useSessionLogMessagesQuery } from '~myjournai/session-client';

export const Route = createFileRoute('/_app/onboarding/final-convo/')({
  component: FinalConvo
});


function FinalConvo() {
  const userId = useAuthUserIdFromHeaders();
  const conversationInitialized = useRef(false);
  const completeOnboardingMutation = useUserCompleteOnboardingMutation({ userId });
  const existingLetter = useOnboardingLetterQuery(userId).data?.content;
  const { data: sessionLog, isSuccess: isSuccessSessionLog, refetch } = useLatestSessionLogBySlugQuery({ slug: 'onboarding-v0', userId });
  const sessionLogMessagesQuery = useSessionLogMessagesQuery(sessionLog?.id);

  const sessionInProgress = sessionLog?.status === 'IN_PROGRESS';
  const isShowingUserInput = isSuccessSessionLog && sessionInProgress;
  const isShowingLetterReflection = (isSuccessSessionLog && !sessionInProgress) && (completeOnboardingMutation.isPending || completeOnboardingMutation.isIdle);
  const isShowingChat = userId && conversationInitialized && isSuccessSessionLog && !isShowingLetterReflection;
  const isMessageSuccess= sessionLogMessagesQuery.isSuccess;
  const messages = sessionLogMessagesQuery.data ?? [];

  useEffect(() => {
    if (completeOnboardingMutation.isIdle && !conversationInitialized.current && isSuccessSessionLog && !sessionInProgress) {
      conversationInitialized.current = true;
      setTimeout(() => completeOnboardingMutation.mutate(undefined,{onSuccess: () => refetch()}), 50);
    }
  }, [completeOnboardingMutation.isIdle, conversationInitialized, completeOnboardingMutation, userId, sessionInProgress, isSuccessSessionLog]);

    return <>
    {!isShowingLetterReflection ? null :
      <div className="overflow-hidden relative h-full w-full grid">
        <div className={classes.gradientAnimation} />
        <div className="-mt-20 place-self-center">
          <h1 className="text-2xl text-center">One second while Sam is reflecting on your letter</h1>
        </div>
      </div>}
    {!isShowingChat ? null :
      <Chat isSessionLogExists={sessionInProgress} isShowingUserInput={isShowingUserInput} isMessageSuccess={isMessageSuccess} messages={messages} userId={userId}>
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

