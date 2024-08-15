import { defineEventHandler, getRequestURL } from 'h3';
import { authenticateUser } from '@myjournai/auth-server';

export default defineEventHandler(async (event) => {
  // Will execute everything but /auth routes
  if (!getRequestURL(event).pathname.startsWith('/api/auth')) {
    event.context.user = await authenticateUser(event);
  }
});
