import { defineEventHandler } from 'h3';
import { createClient } from '~myjournai/auth-server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const authClient = createClient(event);
  const { data, error } = await authClient.auth.resetPasswordForEmail(body.email);
  console.log('reset password for email inited', data, error)
  if (error) {
    return createError(error);
  }
});
