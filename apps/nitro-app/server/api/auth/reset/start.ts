import { defineEventHandler } from 'h3';
import { createClient } from '~myjournai/auth-server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const authClient = createClient(event);
  const { data, error } = await authClient.auth.resetPasswordForEmail(body.email);
  console.log(data)
  if (error) {
    return createError(error);
  }
});
