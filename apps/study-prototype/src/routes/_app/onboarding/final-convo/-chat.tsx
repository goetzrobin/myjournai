import React, { FormEvent, PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  AIMessage,
  ChatContainer,
  MessagesContainer,
  ThinkingIndicator,
  UserInputForm,
  UserMessage
} from '~myjournai/chat-client';
import { useScrollAnchor } from '~myjournai/components';
import { useStreamResponse } from '~myjournai/http-client';
import { useEnterSubmit } from '~myjournai/form-utils';
import { z, ZodIssueCode } from 'zod';
import OnboardingWrapper from '../-components/-onboarding-wrapper';

const EndConvoOverlay = () => <div className="absolute inset-0 bg-background h-full w-full z-50">
  <OnboardingWrapper currentStep="meet-sam" link={{ to: '/', label: `Let's start our journey` }}>
    <div className="-mt-20 place-self-center">
      <h1 className="text-2xl text-center">We're so excited to get started.</h1>
      <p className="mt-4 text-muted-foreground text-center">Thanks for being so open and sharing so much about
        yourself.
        We're excited to help you find your path to a fulfilled life after athletics.</p>
    </div>
  </OnboardingWrapper>
</div>;


const Chat = ({ userId, children }: PropsWithChildren<
    {
      userId: string;
    }
  >) => {
    const conversationInitialized = useRef(false);
    const { data, mutation, startStream, isStreaming, abort } = useStreamResponse({
      url: `/api/onboarding/final-convos/${userId}`
    });
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
        setTimeout(() => startStream({ author: 'ai', message: 'The user has started the conversation' }), 100);
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

    return (
      <ChatContainer>
        <MessagesContainer messagesRef={messagesRef} scrollRef={scrollRef} visibilityRef={visibilityRef}>
          {children}
          {Object.entries(messagesById).map(([key, value]) => (value as any)?.[0].type === 'ai' ?
            <AIMessage key={key} content={(value as any).map(({ data }) => data.content).join('')} /> :
            <UserMessage key={key} content={(value as any).map(({ data }) => data.content).join('')} />
          )}
          {(mutation.isPending && !isStreaming) ? <ThinkingIndicator /> : null}
          {!isEnded ? null : <EndConvoOverlay />}
        </MessagesContainer>
        <UserInputForm formRef={formRef} input={input} setInput={setInput} onKeyDown={onKeyDown}
                       handleSubmit={handleSubmit} />
      </ChatContainer>

    )
      ;
  }
;

export default Chat;
