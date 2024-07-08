import { SignUpRequest } from '../signup-request';
import { createClient } from '../../auth/server/client';
import { H3Event } from 'h3';
import { AuthError, User } from '@supabase/auth-js';

export const signUpAction = async (event: H3Event, {
  email,
  password
}: SignUpRequest): Promise<AuthError | User | null> => {
  const authClient = createClient(event);
  const signUpResult = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: email
      }
    }
  });
  if (signUpResult.error) {
    return signUpResult.error;
  }
  return signUpResult.data.user;
};
