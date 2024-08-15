import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export type StreamRequest = {
  author?: 'ai' | 'human';
  message: string;
}

export function useStreamResponse({
                                    url,
                                    streamCallback
                                  }: {
  url: string;
  streamCallback?: (value: any) => void
}) {
  const [abortController] = useState(new AbortController());
  const [isStreaming, setStreaming] = useState(false);
  const [reader, setReader] = useState<ReadableStreamDefaultReader | undefined>();
  const [data, setData] = useState<any[]>([]);

  abortController.signal.addEventListener('abort', () => reader?.cancel());

  const mutation = useMutation({
    mutationFn: async ({ message, author }: StreamRequest) => {
      author = author ?? 'human';
      const body = { message, author };
      if (author === 'human') {
        setData(p => [...p, { type: 'text-delta', id: crypto.randomUUID(), textDelta: message }]);
      }
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
        setData(prev => [...prev, JSON.parse(chunk)]);
      }
      await read();
    }

    await read();
  }

  return { data, mutation, startStream: mutation.mutate, isStreaming, abort: () => abortController.abort() };
}

export default useStreamResponse;
