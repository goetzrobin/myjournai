import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { BaseMessageChunk, BaseMessageScope, BaseMessageType } from '~myjournai/chat-shared';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { parseISO } from 'date-fns';

const reviver = (key: string, value: unknown) => {
  return key === 'createdAt' ? parseISO(value as string) : value;
};

type PendingChunkStatus = 'pending' | 'error' | 'success';

export const usePendingChunkStoreFactory = (url?: string) => create(
  persist<{
    chunk: BaseMessageChunk | undefined; status: PendingChunkStatus, actions: {
      setStatus: (status: PendingChunkStatus) => void;
      setPendingChunk: (chunk: BaseMessageChunk | undefined) => void
    }
  }>(
    (set, get) => ({
      chunk: undefined,
      status: 'pending',
      actions: {
        setStatus: (status: PendingChunkStatus) => set(state => ({ ...state, status })),
        setPendingChunk: (chunk: BaseMessageChunk | undefined) => set(state => ({ ...state, chunk }))
      }
    }), {
      name: `journai-${url}-pending-chunk-store`,
      partialize: ({ actions, ...rest }: any) => rest,
      storage: createJSONStorage(() => localStorage, { reviver })
    }
  ));

export type StreamRequest = {
  type?: BaseMessageType;
  scope?: BaseMessageScope;
  message?: string;
  retry?: boolean
}

export function useStreamResponse({
                                    url,
                                    userId,
                                    streamCallback
                                  }: {
  url: string;
  userId?: string;
  streamCallback?: (value: any) => void
}) {
  const [temporaryId, setTemporaryId] = useState(crypto.randomUUID());
  const [abortController] = useState(new AbortController());
  const [isStreaming, setStreaming] = useState(false);
  const [reader, setReader] = useState<ReadableStreamDefaultReader | undefined>();
  const [chunks, setChunks] = useState<BaseMessageChunk[]>([]);
  const usePendingChunkStore = usePendingChunkStoreFactory(url);
  const pendingChunkStore = usePendingChunkStore();

  abortController.signal.addEventListener('abort', () => reader?.cancel());

  useEffect(() => {
    setChunks(previousChunks => {
      if (pendingChunkStore.chunk && previousChunks.findIndex(c => c.id === pendingChunkStore.chunk?.id) === -1) {
        return [...previousChunks, pendingChunkStore.chunk!];
      }
      return previousChunks;
    });
    // using id here since the object changes every time the
    // hook is called since we need to use a pending chunk store factory and read from localstorage
  }, [pendingChunkStore.chunk?.id, chunks]);

  async function readStream(reader: ReadableStreamDefaultReader) {
    async function read() {
      const { done, value } = await reader.read();
      if (done) {
        setStreaming(false);
        return;
      }
      const text = new TextDecoder().decode(value);
      const chunks = text
        .split('\n')
        .filter(s => s.length > 0)
        .map(s => s.replace(/^data: /, ''));
      for (const chunk of chunks) {
        if (chunk === '[START]') {
          console.log('starting');
          continue;
        }
        if (chunk === '[DONE]') {
          console.log('done!');
          continue;
        }
        setChunks(prev => {
          const parsedChunk = JSON.parse(chunk) as BaseMessageChunk;
          const chunkWithTempIdShouldBeUserMessageIndex = prev.findIndex(c => c.id === temporaryId);
          if (chunkWithTempIdShouldBeUserMessageIndex >= 0) {
            prev[chunkWithTempIdShouldBeUserMessageIndex] = {
              ...prev[chunkWithTempIdShouldBeUserMessageIndex],
              id: parsedChunk.runId,
              runId: parsedChunk.runId
            };
          }
          return [...prev, { ...parsedChunk, createdAt: new Date(parsedChunk.createdAt) }];
        });
      }
      await read();
    }

    await read();
  }

  const mutation = useMutation({
    mutationFn: async ({ message, type, scope, retry }: StreamRequest) => {
      if (!userId) return;
      let body = {};
      if (!retry || pendingChunkStore.chunk === undefined) {
        const newId = crypto.randomUUID();
        setTemporaryId(newId);

        type = type ?? 'user-message';
        scope = scope ?? 'external';
        body = { message, type, scope, userId };
        // TODO: the dates are off here because we use the createdAt and a new date, we need the date from the BE and update the chunk
        const newChunk = {
          id: newId,
          runId: newId,
          type,
          scope,
          chunkType: 'full-message',
          textDelta: message ?? '',
          createdAt: new Date()
        };
        setChunks(p => {
          const finalChunk = p[p.length - 1];
          if (finalChunk?.type === 'user-message' && pendingChunkStore.status === 'error') {
            const chunksWithoutFinal = [...p];
            p.pop();
            return [...chunksWithoutFinal, newChunk];
          }
          return [...p, newChunk];
        });
        pendingChunkStore.actions.setPendingChunk(newChunk);
      } else {
        body = {
          message: pendingChunkStore.chunk.textDelta,
          type: pendingChunkStore.chunk.type,
          scope: pendingChunkStore.chunk.scope,
          userId
        };
      }
      pendingChunkStore.actions.setStatus('pending');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error('Error during fetch of api stream');
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      setStreaming(true);

      const reader = response.body.getReader();
      setReader(reader);
      return reader;
    },
    onSuccess: async (reader) => {
      pendingChunkStore.actions.setPendingChunk(undefined);
      pendingChunkStore.actions.setStatus('success');
      await readStream(reader!);
    },
    onError: async (error) => {
      pendingChunkStore.actions.setStatus('error');
      console.log(error);
    }
  });

  const messageChunksByTimestamp = useMemo(() => chunks.reduce((p, c) => ({
    ...p,
    [c.createdAt.toISOString()]: [...(p[c.createdAt.toISOString()] ?? []), c]
  }), {} as Record<string, BaseMessageChunk[]>), [chunks]);

  const currentStepInfo = useMemo(() => {
    const potentialEntry = ((Object.entries(messageChunksByTimestamp) ?? [])
      // from ai responses
      .filter(([_, chunks]) => chunks[0]?.type === 'ai-message')
      // take the most recent one
      .sort(([key1], [key2]) => key2.localeCompare(key1)))
      // and use it to get the chunks
      [0];

    const potentialChunks = potentialEntry?.[1] ?? [];
    // any chunk has current step info
    return {
      currentStep: potentialChunks[0]?.currentStep ?? 1,
      stepRepetitions: potentialChunks[0]?.stepRepetitions ?? 1
    };
  }, [messageChunksByTimestamp]);

  const removeChunksForTimestamp = (isoTimeStamp: string) => setChunks(chunks.filter(c => c.createdAt.toISOString() !== isoTimeStamp));

  return {
    pendingChunk: pendingChunkStore.chunk,
    pendingChunkStatus: pendingChunkStore.status,
    chunks,
    mutation,
    startStream: mutation.mutate,
    isStreaming,
    abort: () => abortController.abort(),
    temporaryId,
    messageChunksByTimestamp,
    currentStepInfo,
    removeChunksForTimestamp
  };
}
