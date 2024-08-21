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
import { BaseMessageChunk, useStreamResponse } from '~myjournai/http-client';
import { useEnterSubmit } from '~myjournai/form-utils';
import OnboardingWrapper from '../-components/-onboarding-wrapper';
import { BaseMessage } from '~myjournai/chat-shared';

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


const Chat = ({ userId, messages, isMessageSuccess, children }: PropsWithChildren<
    {
      messages: BaseMessage[];
      isMessageSuccess: boolean;
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
      if (mutation.isIdle && !conversationInitialized.current && isMessageSuccess && messages.length === 0) {
        conversationInitialized.current = true;
        setTimeout(() => startStream({
          type: 'ai-message',
          scope: 'internal',
          message: 'The user has started the conversation'
        }), 100);
      }
    }, [mutation.isIdle, conversationInitialized, startStream, isMessageSuccess, messages.length]);

    const [isEnded, setEnded] = useState(false);
    const messagesByDate = data.reduce((p, c) => ({
      ...p,
      [c.createdAt.toISOString()]: [...(p[c.createdAt.toISOString()] ?? []), c]
    }), {} as Record<string, BaseMessageChunk[]>);

    return (
      <ChatContainer>
        <MessagesContainer messagesRef={messagesRef} scrollRef={scrollRef} visibilityRef={visibilityRef}>
          {children}
          {messages.filter(m => !messagesByDate[m.createdAt as any])
            .map(chunks => chunks.scope === 'internal' ? null :
              chunks?.type === 'ai-message' ?
                <AIMessage key={chunks.id + chunks.content.length} content={chunks.content} /> :
                <UserMessage key={chunks.id + chunks.content.length} content={chunks.content} />)}
          {Object.entries(messagesByDate)
            // keys are iso dates
            .sort(([key1], [key2]) => key1.localeCompare(key2))
            .map(([key, chunks]) => chunks[0].scope === 'internal' ? null :
              chunks[0]?.type === 'ai-message' ?
                <AIMessage key={key + chunks.length}
                           content={chunks.map((chunk) => chunk.textDelta).join('')} /> :
                <UserMessage key={key + chunks.length}
                             content={chunks.map((chunk) => chunk.textDelta).join('')} />
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
