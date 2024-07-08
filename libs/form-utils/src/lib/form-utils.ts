import { FormEvent } from 'react';

export function parseFormData<T extends Record<string, any>>(e: FormEvent<HTMLFormElement>): T {
  e.preventDefault();
  // Get form data as an object.
  return Object.fromEntries(new FormData(e.currentTarget) as any) as any;
}
