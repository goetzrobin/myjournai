import React, { PropsWithChildren } from 'react';
import { Button, Link } from '~myjournai/components';
import { LucideChevronLeft, LucideUndoDot } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useSessionAbortMutation } from '~myjournai/session-client';
import { useUserQuery } from '~myjournai/user-client';

export const ChatContainer = ({ children, userId, sessionLogId, withMenu }: PropsWithChildren<{
  userId?: string;
  sessionLogId?: string;
  withMenu?: boolean
}>) => {
  const userQ = useUserQuery(userId);
  const isJeffOrRobin = ['tug29225@temple.edu', 'robin@neurotrainer.com', 'jnyquist@neurotrainer.com', 'jeff@neurotrainer.com'].includes(userQ.data?.username ?? '')

  const nav = useNavigate();
  const abortMut = useSessionAbortMutation({ userId, sessionLogId });
  const onAbort = () => abortMut.mutate(undefined, { onSuccess: () => nav({ to: '/' }) });

  return <div
    className="flex flex-col w-full h-full relative pt-4">
    <div
      className="px-2 z-10 bg-gradient-to-b from-background -m-[1px] from-30% to-transparent absolute h-16 left-0 right-0 top-2">
      <div className="flex justify-between items-center">
        <Link to="/"><span
          className="sr-only">Back to main</span><LucideChevronLeft /></Link>
        {!withMenu || !isJeffOrRobin ? null :
          <Button onPress={onAbort} className="bg-destructive/30" variant="icon">
            {abortMut.isPending ? 'Aborting' : <LucideUndoDot className="text-destructive-foreground size-5" />}
            </Button>
         }
      </div>
    </div>
    {children}</div>;
};
