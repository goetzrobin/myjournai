import { StreamRequest } from './use-stream-response';
import { useEffect, useRef } from 'react';

export const useAutoStartMessage = ({
                                      isIdle,
                                      isMessageSuccess,
                                      isSessionLogExists,
                                      isNoMessages,
                                      startStream,
                                      startStreamDelay,
                                      initialMessage
                                    }: {
  isIdle: boolean;
  isMessageSuccess: boolean;
  isSessionLogExists: boolean;
  isNoMessages: boolean;
  startStream: (message: StreamRequest) => void;
  startStreamDelay?: number;
  initialMessage?: string;
}) => {
  const conversationInitialized = useRef(false);
  useEffect(() => {
    if (isIdle && !conversationInitialized.current && isMessageSuccess && isNoMessages && isSessionLogExists) {
      conversationInitialized.current = true;
      setTimeout(() => startStream({
        type: 'ai-message',
        scope: 'internal',
        message: initialMessage ?? 'The user has started the conversation'
      }), startStreamDelay ?? 100);
    }
  }, [isIdle, conversationInitialized, startStream, isMessageSuccess, isSessionLogExists, isNoMessages, startStreamDelay, initialMessage]);
};
