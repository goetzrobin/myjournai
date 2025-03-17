import { SignInRequest } from '~myjournai/auth-shared';
import { createClient } from './client';
import { H3Event } from 'h3';
import { AuthError, User } from '@supabase/auth-js';
import { isAdmin } from '../index';

export const signInAction = async (
  event: H3Event,
  { email, password }: SignInRequest
): Promise<AuthError | User & {isAdmin: boolean}> => {
  const authClient = await createClient(event);
  const signInResult = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  if (signInResult.error) {
    return signInResult.error;
  }
  return {...signInResult.data.user, isAdmin: isAdmin(signInResult.data.user)};
};
