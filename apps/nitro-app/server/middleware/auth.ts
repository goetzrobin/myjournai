import { defineEventHandler, getRequestURL } from 'h3';
import { authenticateUser } from '~myjournai/auth';

export default defineEventHandler(async (event) => {
  // Will execute everything but /auth routes
  console.log(getRequestURL(event).pathname)
  if (!getRequestURL(event).pathname.startsWith('/api/auth')) {
    event.context.user = await authenticateUser(event);
  }
});
