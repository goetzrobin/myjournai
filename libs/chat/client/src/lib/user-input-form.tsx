import React, { ReactNode } from 'react';
import { Button, TextArea } from '~myjournai/components';
import { LucideArrowUp } from 'lucide-react';
import { useChatEnterSubmit } from './use-chat-enter-submit';
import { StreamRequest } from './use-stream-response';

export const UserInputForm = ({
                                startStream,
                                sessionLogId,
                                stepsRemaining,
                                onEndConversationPressed,
                                customEndConvoButton
                              }: {
  startStream: (request: StreamRequest) => void;
  sessionLogId: string | undefined
  stepsRemaining: number;
  onEndConversationPressed: () => void;
  customEndConvoButton?: ReactNode
}) => {
  const { onKeyDown, formRef, handleSubmit, input, setInput } = useChatEnterSubmit({
    startStream,
    sessionLogId
  });
  return <div className="flex-none isolate relative pb-3">
    <div
      className="-z-10 bg-gradient-to-b from-transparent -m-[1px] to-55% to-background absolute h-8 left-0 right-0 -top-[1.3rem]" />
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex [&_textarea::placeholder]:text-muted-foreground [&_textarea:active::placeholder]:text-muted-foreground relative z-10 animate-in slide-in-from-bottom-1/2 [animation-duration:300ms] fade-in bg-background shadow-lg px-4 py-2.5 border rounded-xl">
      <TextArea onChange={e => setInput(e.target.value)} value={input}
                name="message"
                className="bg-transparent resize-none outline-0 w-[calc(100%-1.7rem)]"
                placeholder="Share with Sam..."
                onKeyDown={onKeyDown}
                aria-label="Send chat to Sam" />
      {input.length === 0 ? null : <Button
        type="submit"
        className="animate-in fade-in [animation-duration:300ms] rounded-xl bg-background absolute right-[6px] bottom-[5px]"
        variant="icon">
        <LucideArrowUp />
      </Button>}
    </form>
    {(stepsRemaining > 0 || customEndConvoButton) ? null : <Button onPress={onEndConversationPressed} variant="ghost"
                                                                   className="mt-2 w-full animate-in fade-in [animation-duration:300ms]">End
      Conversation</Button>}
    {stepsRemaining > 0 || !customEndConvoButton ? null : customEndConvoButton}
  </div>;
};
