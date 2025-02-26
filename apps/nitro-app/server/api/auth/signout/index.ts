import { createClient } from '~myjournai/auth-server';
import { eventHandler } from 'h3';

export default eventHandler(async (event) => {
  const { auth } = await createClient(event);
  await auth.signOut();
});
