import { createClient } from '~myjournai/auth-server';
import { eventHandler } from 'h3';

export default eventHandler(async (event) => {
  const { auth } = createClient(event);
  await auth.signOut();
});
