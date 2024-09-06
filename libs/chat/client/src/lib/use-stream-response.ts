import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { BaseMessageChunk, BaseMessageScope, BaseMessageType } from '~myjournai/chat-shared';

export type StreamRequest = {
  type?: BaseMessageType;
  scope?: BaseMessageScope;
  message: string;
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

  abortController.signal.addEventListener('abort', () => reader?.cancel());

  const mutation = useMutation({
    mutationFn: async ({ message, type, scope }: StreamRequest) => {
      if (!userId) return;
      const newId = crypto.randomUUID();
      setTemporaryId(newId);

      type = type ?? 'user-message';
      scope = scope ?? 'external';
      const body = { message, type, scope, userId };
      setChunks(p => [...p, {
        id: newId,
        runId: newId,
        type,
        scope,
        chunkType: 'full-message',
        textDelta: message,
        createdAt: new Date()
      }]);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: abortController.signal
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      setStreaming(true);

      const reader = response.body.getReader();
      setReader(reader);
      return reader;
    },
    onSuccess: async (reader) => readStream(reader!)
  });

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
      [0]

    const potentialChunks = potentialEntry?.[1] ?? [];
    // any chunk has current step info
    return {currentStep: potentialChunks[0]?.currentStep ?? 1, stepRepetitions: potentialChunks[0]?.stepRepetitions ?? 1}
    }, [messageChunksByTimestamp])

  return {
    chunks,
    mutation,
    startStream: mutation.mutate,
    isStreaming,
    abort: () => abortController.abort(),
    temporaryId,
    messageChunksByTimestamp,
    currentStepInfo
  };
}
