import { createFileRoute } from '@tanstack/react-router';
import { Button, TextArea, useScrollAnchor } from '~myjournai/components';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { LucideArrowUp } from 'lucide-react';
import useStreamResponse from './-convo.mutation';
import { ThinkingIndicator, AIMessage, UserMessage } from '~myjournai/chat-client';
import { useEnterSubmit } from '~myjournai/form-utils';
import { z, ZodIssueCode } from 'zod';

export const Route = createFileRoute('/_app/onboarding/career-identity-confusion/convo')({
  component: Convo
});

function Convo() {
  const conversationInitialized = useRef(false);
  const { data, mutation, startStream, isStreaming, abort } = useStreamResponse({});
  const { formRef, onKeyDown } = useEnterSubmit();
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor();
  const [input, setInput] = useState('');
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return;
    }
    startStream({ message: input });
    setInput('');
  };

  useEffect(() => {
    if (mutation.isIdle && !conversationInitialized.current) {
      conversationInitialized.current = true;
      setTimeout(() => startStream({ type: 'ai', message: 'The user has started the conversation' }), 100);
    }
  }, [mutation.isIdle, conversationInitialized, startStream]);

  const toolName = data.map(({ data }) => data.tool_call_chunks?.[0]?.name).join('');
  const toolCall = data.map(({ data }) => data.tool_call_chunks?.[0]?.args).join('');
  const parseJsonPreprocessor = (value: any, ctx: z.RefinementCtx) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: (e as Error).message
        });
      }
    }

    return value;
  };
  const [isEnded, setEnded] = useState(false);
  const parsedCall = z.preprocess(parseJsonPreprocessor, z.object({ operation: z.enum(['end-conversation']) })).safeParse(toolCall);
  useEffect(() => {
    if (!isEnded && (toolName === 'end-conversation' || parsedCall.data)) {
      setEnded(true);
    }
  }, [isEnded, parsedCall.data, toolName]);

  const messagesById = data.reduce((p, c) => ({ ...p, [c.data.id]: [...(p[c.data.id] ?? []), c] }), {});

  return <div className="flex flex-col w-full h-full relative pt-2">
    <div
      className="bg-gradient-to-b from-background -m-[1px] from-45% to-transparent absolute h-12 left-0 right-0 top-0" />
    <div ref={scrollRef} className="flex-1 overflow-auto">
      <div className="pt-6 px-2 pb-10" ref={messagesRef}>
        {Object.entries(messagesById).map(([key, value]) => (value as any)?.[0].type === 'ai' ?
          <AIMessage key={key} content={(value as any).map(({ data }) => data.content).join('')} /> :
          <UserMessage key={key} content={(value as any).map(({ data }) => data.content).join('')} />
        )}

        {(mutation.isPending && !isStreaming) ? <ThinkingIndicator /> : null}
        {!isEnded ? null : <p>Ending Conversation</p>}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
    </div>
    <div className="flex-none isolate relative pb-3">
      <div
        className="bg-gradient-to-b from-transparent -m-[1px] to-55% to-background absolute h-8 left-0 right-0 -top-[1.3rem]" />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex [&_textarea::placeholder]:text-muted-foreground [&_textarea:active::placeholder]:text-muted-foreground relative z-10 animate-in slide-in-from-bottom-1/2 [animation-duration:300ms] fade-in bg-background shadow-lg px-4 py-2.5 border rounded-xl">
        <TextArea onChange={e => setInput(e.target.value)} value={input}
                  name="message"
                  className="resize-none outline-0 w-[calc(100%-1.7rem)]"
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
    </div>
  </div>;
}
