import { FormEvent, KeyboardEvent } from 'react';

export function parseFormData<T extends Record<string, any>>(e: FormEvent<HTMLFormElement>): T {
  e.preventDefault();
  // Get form data as an object.
  return Object.fromEntries(new FormData(e.currentTarget) as any) as any;
}

import { useRef, type RefObject } from 'react'

export function useEnterSubmit(): {
  formRef: RefObject<HTMLFormElement>
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
} {
  const formRef = useRef<HTMLFormElement>(null)

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit()
      event.preventDefault()
    }
  }

  return { formRef, onKeyDown: handleKeyDown }
}
