import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
import React, { useState } from 'react';
import { Button, useScrollAnchor } from '~myjournai/components';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import {
  useLatestSessionLogBySlugQuery,
  useSessionEndMutation,
  useSessionLogMessagesQuery,
  useSessionStartMutation
} from '~myjournai/session-client';
import useMeasure from 'react-use-measure';
import { Drawer } from 'vaul';
import { AnimatePresence, motion } from 'framer-motion';
import { LucideX } from 'lucide-react';
import { Survey } from './-components/survey';


export default function FamilyDrawer({ onStart }: {
  onStart: (scores: {
    preAnxietyScore: number,
    preFeelingScore: number,
    preMotivationScore: number
  }) => void
}) {
  const [preAnxietyScore, setPreAnxietyScore] = useState<number | undefined>(undefined);
  const [preFeelingScore, setPreFeelingScore] = useState<number | undefined>(undefined);
  const [preMotivationScore, setPreMotivationScore] = useState<number | undefined>(undefined);
  const [view, setView] = useState('feeling');
  const [elementRef, bounds] = useMeasure();
  const navigate = useNavigate();

  return (
    <Drawer.Root open={true}>
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-10 bg-black/30"
        />
        <Drawer.Content
          asChild
          className="fixed inset-x-4 bottom-4 z-10 mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-background outline-none md:mx-auto md:w-full"
        >
          <motion.div
            animate={{
              height: bounds.height,
              transition: {
                duration: 0.27,
                ease: [0.25, 1, 0.5, 1]
              }
            }}
          >
            <Drawer.Close asChild>
              <Button
                variant="icon"
                onPress={() => navigate({ to: '/' })}
                data-vaul-no-drag=""
                className="absolute right-8 top-7 z-10 flex h-8 w-8 items-center justify-center rounded-full"
              >
                <LucideX />
              </Button>
            </Drawer.Close>
            <div ref={elementRef} className="px-6 pb-6 pt-2.5 antialiased">
              <AnimatePresence initial={false} mode="popLayout" custom={view}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  key={view}
                  transition={{
                    duration: 0.27,
                    ease: [0.26, 0.08, 0.25, 1]
                  }}
                >
                  <Survey
                    onStart={onStart}
                    view={view}
                    setView={setView}
                    preAnxietyScore={preAnxietyScore}
                    setPreAnxietyScore={setPreAnxietyScore}
                    preFeelingScore={preFeelingScore}
                    setPreFeelingScore={setPreFeelingScore}
                    preMotivationScore={preMotivationScore}
                    setPreMotivationScore={setPreMotivationScore}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
export const Route = createFileRoute('/_app/sessions/alignment-v0/')({
  component: Alignment
});


function Alignment() {
  const userId = useAuthUserIdFromHeaders();
  const slug = 'alignment-v0';
  const startMutation = useSessionStartMutation({ userId, slug });
  const { data: sessionLog, isSuccess: isSuccessSessionLog } = useLatestSessionLogBySlugQuery({ slug, userId });
  const { data: messages, isSuccess } = useSessionLogMessagesQuery(sessionLog?.id);
  const { chunks, mutation, startStream, isStreaming, messageChunksByTimestamp } = useStreamResponse({
    userId,
    url: `/api/sessions/slug/alignment-v0`
  });
  useAutoStartMessage({
    isSessionLogExists: !!(sessionLog && sessionLog.status === 'IN_PROGRESS'),
    isIdle: mutation.isIdle,
    isMessageSuccess: isSuccess,
    isNoMessages: (messages ?? []).length === 0,
    startStream
  });
  const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor();
  const { onKeyDown, formRef, handleSubmit, input, setInput } = useChatEnterSubmit(startStream);
  const endMutation = useSessionEndMutation({ userId, sessionLogId: sessionLog?.id });
  const { isEnded } = useEndConversationOnToolcallChunk(chunks);
  const isSessionNotStarted = isSuccessSessionLog && !sessionLog;
  const isReadyForUserInput = isSuccessSessionLog && sessionLog?.status === 'IN_PROGRESS';

  const onStartClicked = (scores: {
    preAnxietyScore: number,
    preFeelingScore: number,
    preMotivationScore: number
  }) => startMutation.mutate(scores);

  const onEndClicked = (scores: {
    preAnxietyScore: number,
    preFeelingScore: number,
    preMotivationScore: number
  }) => endMutation.mutate({
    postAnxietyScore: scores.preAnxietyScore,
    postFeelingScore: scores.preFeelingScore,
    postMotivationScore: scores.preMotivationScore
  });

  return <>
    {!isEnded ? null : <FamilyDrawer onStart={onEndClicked} />}
    {!isSessionNotStarted ? null : <FamilyDrawer onStart={onStartClicked} />}
    {isSessionNotStarted ? null :
      <ChatContainer>
        <MessagesContainer messagesRef={messagesRef} scrollRef={scrollRef} visibilityRef={visibilityRef}>
          {mapNonStreamedDBMessagesToChatComponents(messageChunksByTimestamp, messages ?? [])}
          {mapChunksToChatComponents(messageChunksByTimestamp)}
          {(mutation.isPending && !isStreaming) ? <ThinkingIndicator /> : null}
        </MessagesContainer>
        {!isReadyForUserInput ? null :
          <UserInputForm formRef={formRef} input={input} setInput={setInput} onKeyDown={onKeyDown}
                         handleSubmit={handleSubmit} />}

      </ChatContainer>}
  </>;
}
