import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { BaseMessageScope, BaseMessageType } from '~myjournai/chat-shared';

export type StreamRequest = {
  type?: BaseMessageType;
  scope?: BaseMessageScope;
  message: string;
}

export type BaseMessageChunk = {
  id: string;
  runId: string;
  type?: BaseMessageType;
  scope?: BaseMessageScope;
  chunkType: string;
  textDelta: string;
  createdAt: Date;
}

export function useStreamResponse({
                                    url,
                                    streamCallback
                                  }: {
  url: string;
  streamCallback?: (value: any) => void
}) {
  const [temporaryId, setTemporaryId] = useState(crypto.randomUUID());
  const [abortController] = useState(new AbortController());
  const [isStreaming, setStreaming] = useState(false);
  const [reader, setReader] = useState<ReadableStreamDefaultReader | undefined>();
  const [data, setData] = useState<BaseMessageChunk[]>([]);

  abortController.signal.addEventListener('abort', () => reader?.cancel());

  const mutation = useMutation({
    mutationFn: async ({ message, type, scope }: StreamRequest) => {
      const newId = crypto.randomUUID();
      setTemporaryId(newId);

      type = type ?? 'user-message';
      scope = scope ?? 'external';
      const body = { message, type, scope };
      setData(p => [...p, { id: newId, runId: newId, type, scope, chunkType: 'full-message', textDelta: message, createdAt: new Date() }]);
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
    onSuccess: async (reader) => readStream(reader)
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
        setData(prev => {
          const parsedChunk = JSON.parse(chunk) as BaseMessageChunk;
          const chunkWithTempIdShouldBeUserMessageIndex = prev.findIndex(c => c.id === temporaryId);
          if (chunkWithTempIdShouldBeUserMessageIndex >= 0) {
            prev[chunkWithTempIdShouldBeUserMessageIndex] = {
              ...prev[chunkWithTempIdShouldBeUserMessageIndex],
              id: parsedChunk.runId,
              runId: parsedChunk.runId
            };
          }
          return [...prev, {...parsedChunk, createdAt: new Date(parsedChunk.createdAt) }];
        });
      }
      await read();
    }

    await read();
  }

  return {
    data,
    mutation,
    startStream: mutation.mutate,
    isStreaming,
    abort: () => abortController.abort(),
    temporaryId
  };
}

export default useStreamResponse;
