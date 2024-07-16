import { signInAction } from '@myjournai/auth-server';
import { AuthError } from '@supabase/auth-js';
import { createError, eventHandler, readBody } from 'h3';
import { SignInRequestSchema } from '~myjournai/auth-shared';

export default eventHandler(async (event) => {
  const parsedRequest = SignInRequestSchema.safeParse(await readBody(event));
  if (parsedRequest.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: parsedRequest.error.message,
    });
  }
  const signInResult = await signInAction(event, parsedRequest.data);
  if (signInResult instanceof AuthError) {
    throw createError({
      status: 401,
      statusMessage: 'Unauthorized',
      message: signInResult.message,
    });
  }
  return signInResult;
});
