import { useEffect, useState } from 'react';
import { BaseMessageChunk } from '~myjournai/chat-shared';

export const useEndConversationOnToolcallChunk = (chunks: BaseMessageChunk[]) => {
  const [isEnded, setEnded] = useState(false);
  useEffect(() => {
    if (chunks.some(c => c.type === 'tool-call' && c.toolName === 'endConversation')) {
      setTimeout(() => setEnded(true), 3000);
    }
  }, [chunks, setEnded]);
  return { isEnded };
};
