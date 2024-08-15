import React, { PropsWithChildren, Ref } from 'react';

export const MessagesContainer = ({ children, scrollRef, messagesRef, visibilityRef }: PropsWithChildren<{
  scrollRef: Ref<HTMLDivElement>;
  messagesRef: Ref<HTMLDivElement>;
  visibilityRef: Ref<HTMLDivElement>;
}>) => <div ref={scrollRef} className="flex-1 overflow-auto">
  <div className="flex flex-col pt-6 px-2 pb-10" ref={messagesRef}>
    {children}
    <div className="h-px w-full" ref={visibilityRef} />
  </div>
</div>;
