import React, { PropsWithChildren } from 'react';
import { Button, Menu, MenuItem, Popover } from '~myjournai/components';
import { LucideChevronLeft, LucideMoreVertical } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { MenuTrigger } from 'react-aria-components';
import { useSessionAbortMutation } from '~myjournai/session-client';

export const ChatContainer = ({ children, userId, sessionLogId, withMenu }: PropsWithChildren<{
  userId?: string;
  sessionLogId?: string;
  withMenu?: boolean
}>) => {
  const nav = useNavigate();
  const abortMut = useSessionAbortMutation({ userId, sessionLogId });
  const onAbort = () => {
    console.log('abortinggggg')
    abortMut.mutate(undefined, { onSuccess: () => nav({ to: '/' }) });
  }
  return <div
    className="flex flex-col w-full h-full relative pt-4">
    <div
      className="px-2 z-10 bg-gradient-to-b from-background -m-[1px] from-30% to-transparent absolute h-16 left-0 right-0 top-2">
      <div className="flex justify-between items-center">
        <Link to="/"><Button variant="icon"><span
          className="sr-only">Back to main</span><LucideChevronLeft /></Button></Link>
        {!withMenu ? null : <MenuTrigger>
          <Button variant="icon" aria-label="Menu"><LucideMoreVertical className="size-5" /></Button>
          <Popover>
            <Menu>
              <MenuItem
                onAction={onAbort}>
                {abortMut.isPending ? 'Aborting' : 'Abort Session'}</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>}
      </div>
    </div>
    {children}</div>;
};
