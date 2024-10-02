import { signUpAction } from '~myjournai/auth-server';
import { AuthError } from '@supabase/auth-js';
import { createError, eventHandler, readBody } from 'h3';
import { SignUpRequestSchema } from '~myjournai/auth-shared';

export default eventHandler(async (event) => {
  console.log('signing up');
  const body = await readBody(event);
  const parsedRequest = SignUpRequestSchema.safeParse(body);
  if (parsedRequest.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: parsedRequest.error.message,
    });
  }
  const signUpResult = await signUpAction(event, parsedRequest.data);
  if (signUpResult instanceof AuthError) {
    throw createError({
      status: 401,
      statusMessage: 'Unauthorized',
      message: signUpResult.message,
    });
  }
  return signUpResult;
});
