import { StreamRequest } from './use-stream-response';
import { useEnterSubmit } from '~myjournai/form-utils';
import { FormEvent, useState } from 'react';

export const useChatEnterSubmit = (startStream: (request: StreamRequest) => void) => {
  const { formRef, onKeyDown } = useEnterSubmit();
  const [input, setInput] = useState('');
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
