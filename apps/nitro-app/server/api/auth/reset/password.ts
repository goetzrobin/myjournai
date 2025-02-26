import { defineEventHandler } from 'h3';
import { createClient } from '~myjournai/auth-server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newPassword = body.newPassword;
  const authClient = await createClient(event);
  const { data, error } = await authClient.auth.updateUser({ password: newPassword })
  console.log(data, error)
  if (error) {
    return createError(error);
  }
});
