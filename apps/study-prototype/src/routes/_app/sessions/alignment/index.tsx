import { createFileRoute } from '@tanstack/react-router';
import {
  AIMessage,
  ChatContainer,
  MessagesContainer,
  ThinkingIndicator,
  UserInputForm,
  UserMessage
} from '~myjournai/chat-client';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useStreamResponse } from '~myjournai/http-client';
import { useEnterSubmit } from '~myjournai/form-utils';
import { useScrollAnchor } from '~myjournai/components';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';

export const Route = createFileRoute('/_app/sessions/alignment/')({
  component: Alignment
})

function Alignment() {
  const userId = useAuthUserIdFromHeaders();
  const conversationInitialized = useRef(false);
  const { data, mutation, startStream, isStreaming, abort } = useStreamResponse({
    url: `/api/sessions/alignment/${userId}`
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

  // const toolName = data.map(({ data }) => data.tool_call_chunks?.[0]?.name).join('');
  // const toolCall = data.map(({ data }) => data.tool_call_chunks?.[0]?.args).join('');
  // const parseJsonPreprocessor = (value: any, ctx: z.RefinementCtx) => {
  //   if (typeof value === 'string') {
  //     try {
  //       return JSON.parse(value);
  //     } catch (e) {
  //       ctx.addIssue({
  //         code: ZodIssueCode.custom,
  //         message: (e as Error).message
  //       });
  //     }
  //   }
  //
  //   return value;
  // };
  const [isEnded, setEnded] = useState(false);
  // const parsedCall = z.preprocess(parseJsonPreprocessor, z.object({ operation: z.enum(['end-conversation']) })).safeParse(toolCall);
  // useEffect(() => {
  //   if (!isEnded && (toolName === 'end-conversation' || parsedCall.data)) {
  //     setEnded(true);
  //   }
  // }, [isEnded, parsedCall.data, toolName]);

  const messagesById = data.reduce((p, c) => ({ ...p, [c.id]: [...(p[c.id] ?? []), c] }), {});


  console.log(messagesById)

  return  <ChatContainer>
    <MessagesContainer messagesRef={messagesRef} scrollRef={scrollRef} visibilityRef={visibilityRef}>
      {Object.entries(messagesById).map(([key, value]) => (value as any)?.[0].author === 'ai' ?
        <AIMessage key={key} content={(value as any).map((data) => data?.textDelta).join('')} /> :
        <UserMessage key={key} content={(value as any).map((data) => data?.textDelta).join('')} />
      )}
      {(mutation.isPending && !isStreaming) ? <ThinkingIndicator /> : null}
      {!isEnded ? null : <p>Naving back to index</p>}
    </MessagesContainer>
    <UserInputForm formRef={formRef} input={input} setInput={setInput} onKeyDown={onKeyDown}
                   handleSubmit={handleSubmit} />
  </ChatContainer>
}
