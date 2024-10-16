import React, { PropsWithChildren } from 'react';
import {
  ChatContainer,
  mapChunksToChatComponents,
  mapNonStreamedDBMessagesToChatComponents,
  MessagesContainer,
  ThinkingIndicator,
  useAutoStartMessage,
  useChatEnterSubmit,
  UserInputForm,
  useStreamResponse
} from '~myjournai/chat-client';
import { SmoothButton, useScrollAnchor } from '~myjournai/components';
import OnboardingWrapper from '../-components/-onboarding-wrapper';
import { BaseMessage } from '~myjournai/chat-shared';
import { LucideLoader } from 'lucide-react';

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

const Chat = ({
                userId,
                messages,
                isMessageSuccess,
                isShowingUserInput,
                isSessionLogExists,
                sessionStepCount,
                onEndConversation,
                endMutationStatus,
                children
              }: PropsWithChildren<
    {
      messages: BaseMessage[];
      isMessageSuccess: boolean;
      userId: string;
      isShowingUserInput: boolean;
      isSessionLogExists: boolean;
      sessionStepCount: number;
      onEndConversation: () => void;
      endMutationStatus: 'idle' | 'pending' | 'success' | 'error';
    }
  >) => {
    const { mutation, startStream, isStreaming, messageChunksByTimestamp, currentStepInfo, removeChunksForTimestamp } = useStreamResponse({
      userId,
      url: `/api/sessions/slug/onboarding-v0`
    });
    useAutoStartMessage({
      isSessionLogExists,
      isIdle: mutation.isIdle,
      isMessageSuccess,
      isNoMessages: messages.length === 0,
      startStream
    });
    const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor();
    const { onKeyDown, formRef, handleSubmit, input, setInput } = useChatEnterSubmit({ startStream });

    return <ChatContainer withMenu>
      <MessagesContainer messagesRef={messagesRef} scrollRef={scrollRef} visibilityRef={visibilityRef}>
        {children}
        {mapNonStreamedDBMessagesToChatComponents(messageChunksByTimestamp, messages)}
        {mapChunksToChatComponents(messageChunksByTimestamp, startStream, removeChunksForTimestamp)}
        {(mutation.isPending && !isStreaming) ? <ThinkingIndicator /> : null}
      </MessagesContainer>
      {!isShowingUserInput ? null :
        <UserInputForm onEndConversationPressed={onEndConversation}
                       stepsRemaining={sessionStepCount - currentStepInfo.currentStep} formRef={formRef} input={input}
                       setInput={setInput} onKeyDown={onKeyDown}
                       handleSubmit={handleSubmit}
                       customEndConvoButton={<SmoothButton variant="ghost" onPress={onEndConversation}
                                                           className="mt-4 w-full"
                                                           buttonState={endMutationStatus}>
                         {endMutationStatus !== 'idle' ? null : 'End Session'}
                         {endMutationStatus !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
                         {endMutationStatus !== 'success' ? null : 'Answers stored!!'}
                         {endMutationStatus !== 'error' ? null : 'Something went wrong... Try again!'}
                       </SmoothButton>}
        />}
    </ChatContainer>;
  }
;

export default Chat;
