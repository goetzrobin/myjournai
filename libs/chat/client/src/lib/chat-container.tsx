import React, { PropsWithChildren } from 'react';

export const ChatContainer = ({ children }: PropsWithChildren) => <div
  className="flex flex-col w-full h-full relative pt-2">
  <div
    className="bg-gradient-to-b from-background -m-[1px] from-45% to-transparent absolute h-12 left-0 right-0 top-0" />
  {children}</div>;
