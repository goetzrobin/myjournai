import React, { Dispatch, FormEvent, KeyboardEventHandler, Ref, SetStateAction } from 'react';
import { Button, TextArea } from '~myjournai/components';
import { LucideArrowUp } from 'lucide-react';

export const UserInputForm = ({ formRef, handleSubmit, input, setInput, onKeyDown }: {
  formRef: Ref<HTMLFormElement>,
  input: string,
  setInput: Dispatch<SetStateAction<string>>
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
}) => <div className="flex-none isolate relative pb-3">
  <div
    className="bg-gradient-to-b from-transparent -m-[1px] to-55% to-background absolute h-8 left-0 right-0 -top-[1.3rem]" />
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
</div>;
