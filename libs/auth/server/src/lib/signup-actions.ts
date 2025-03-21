import { SignUpRequest } from '~myjournai/auth-shared';
import { createClient } from './client';
import { H3Event } from 'h3';
import { AuthError, User } from '@supabase/auth-js';

export const signUpAction = async (
  event: H3Event,
  { email, password }: SignUpRequest
): Promise<AuthError | User | null> => {
  const authClient = await createClient(event);
  const signUpResult = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: email,
      },
    },
  });
  if (signUpResult.error) {
    return signUpResult.error;
  }
  const signInResult = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  return signInResult.data.user;
};
