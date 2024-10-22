import React, { PropsWithChildren } from 'react';
import { useScrollAnchor } from '~myjournai/components';

export const MessagesContainer = ({ children }: PropsWithChildren) => {
  const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor();
  return <div ref={scrollRef} className="flex-1 overflow-auto">
    <div className="flex flex-col pt-6 px-2 pb-10" ref={messagesRef}>
      {children}
      <div className="h-px w-full" ref={visibilityRef} />
    </div>
  </div>;
};
