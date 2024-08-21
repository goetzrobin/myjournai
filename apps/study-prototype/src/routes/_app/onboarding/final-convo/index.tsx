import { createFileRoute } from '@tanstack/react-router';
import classes from './index.module.css';
import { useEffect, useRef } from 'react';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import Chat from './-chat';
import { useUserCompleteOnboardingMutation } from '@myjournai/user-client';
import { useOnboardingLetterQuery } from '~myjournai/onboarding-client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { BaseMessage } from '~myjournai/chat-shared';

export const Route = createFileRoute('/_app/onboarding/final-convo/')({
  component: FinalConvo
});


function FinalConvo() {
  const userId = useAuthUserIdFromHeaders();
  const conversationInitialized = useRef(false);
  const mutation = useUserCompleteOnboardingMutation({ userId });
  const existingLetter = useOnboardingLetterQuery(userId).data?.content

  useEffect(() => {
    if (mutation.isIdle && !conversationInitialized.current) {
      conversationInitialized.current = true;
      setTimeout(() => mutation.mutate(), 50);
    }
  }, [mutation.isIdle, conversationInitialized, mutation, userId]);

  const sessionLogId = '9a3e6592-2ad9-4153-ae98-a5e049a67f00';
  const axios = useAxios();
  const query = useInfiniteQuery({
    queryKey: ['sessionLogs', sessionLogId],
    queryFn: () => axios.get<BaseMessage[]>(`/api/session-logs/${sessionLogId}/messages`).then(({data}) => data),
    initialPageParam: undefined,
    getNextPageParam: lastPage => 1,
    getPreviousPageParam: firstPage => 0,
  })


  return <>
    {mutation.isSuccess ? null :
      <div className="overflow-hidden relative h-full w-full grid">
        <div className={classes.gradientAnimation} />
        <div className="-mt-20 place-self-center">
          <h1 className="text-2xl text-center">One second while Sam is reflecting on your letter</h1>
        </div>
      </div>}
    {(!userId || !conversationInitialized.current || !mutation.isSuccess) ? null : <Chat isMessageSuccess={query.isSuccess} messages={query.data?.pages?.flatMap(m => m) ?? []} userId={userId}>
      <div className="px-8 pb-12 flex items-center justify-end">
      <div
              className="overflow-hidden relative text-left animate-in zoom-in-50 fade-in-0 flex items-start p-4 h-80 rotate-6 w-56 text-sm pressed:bg-muted bg-background text-muted-foreground border rounded-xl">
        {existingLetter}
        <span className="absolute left-0 right-0 w-full bottom-0 h-8 bg-gradient-to-b to-background from-transparent" />
      </div>
      </div>
    </Chat>}
  </>;
}

