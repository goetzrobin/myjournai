import { StreamRequest } from './use-stream-response';
import { useEnterSubmit } from '~myjournai/form-utils';
import { FormEvent, useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDebounce } from 'use-debounce';

export const useChatStoreFactory = (sessionLogId?: string) => create(
  persist<{ input: string; actions: { setInput: (content: string) => void } }>(
    (set, get) => ({
      input: '',
      actions: {
        setInput: (content: string) => set(state => ({ ...state, input: content }))
      }
    }), {
      name: `journai-session-log-${sessionLogId}-input-store`,
      partialize: ({ actions, ...rest }: any) => rest
    }
  ));

export const useChatEnterSubmit = ({ startStream, sessionLogId }: {startStream: (request: StreamRequest) => void; sessionLogId: string | undefined}) => {
  const useChatStore = useChatStoreFactory(sessionLogId);
  const store = useChatStore?.()
  const { formRef, onKeyDown } = useEnterSubmit();
  const [input, setInput] = useState(store.input);
  const [debouncedInput] = useDebounce(input, 0)

  useEffect(() => {
    store?.actions?.setInput(debouncedInput)
  }, [debouncedInput]);

  useEffect(() => {
    setInput(store.input)
  }, [sessionLogId]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return;
    }
    startStream({ message: trimmed });
    setInput('');
  };

  return { formRef, onKeyDown, handleSubmit, input, setInput };
};
