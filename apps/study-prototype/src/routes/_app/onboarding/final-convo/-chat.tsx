import React, { PropsWithChildren } from 'react';
import {
  ChatContainer,
  mapChunksToChatComponents,
  mapNonStreamedDBMessagesToChatComponents,
  MessagesContainer,
  ThinkingIndicator,
  useAutoStartMessage,
  useChatEnterSubmit,
  useEndConversationOnToolcallChunk,
  UserInputForm,
  useStreamResponse
} from '~myjournai/chat-client';
import { useScrollAnchor } from '~myjournai/components';
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

const Chat = ({ userId, messages, isMessageSuccess, isShowingUserInput, children }: PropsWithChildren<
    {
      messages: BaseMessage[];
      isMessageSuccess: boolean;
      userId: string;
      isShowingUserInput: boolean;
    }
  >) => {
    const { chunks, mutation, startStream, isStreaming, messageChunksByTimestamp } = useStreamResponse({
      userId,
      url: `/api/sessions/slug/onboarding-v0`
    });
    useAutoStartMessage({
      isSessionLogExists: true,
      isIdle: mutation.isIdle,
      isMessageSuccess,
      isNoMessages: messages.length === 0,
      startStream
    });
    const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor();
    const { onKeyDown, formRef, handleSubmit, input, setInput } = useChatEnterSubmit(startStream);
    const { isEnded } = useEndConversationOnToolcallChunk(chunks);

    return <ChatContainer>
      <MessagesContainer messagesRef={messagesRef} scrollRef={scrollRef} visibilityRef={visibilityRef}>
        {children}
        {mapNonStreamedDBMessagesToChatComponents(messageChunksByTimestamp, messages)}
        {mapChunksToChatComponents(messageChunksByTimestamp)}
        {(mutation.isPending && !isStreaming) ? <ThinkingIndicator /> : null}
        {!isEnded ? null : <EndConvoOverlay />}
      </MessagesContainer>
      {!isShowingUserInput ? null :
        <UserInputForm formRef={formRef} input={input} setInput={setInput} onKeyDown={onKeyDown}
                       handleSubmit={handleSubmit} />}
    </ChatContainer>;
  }
;

export default Chat;
