import { User } from '@supabase/auth-js';
import { createError, defineEventHandler, getRequestURL } from 'h3';
import { authenticateUser, isAdmin } from '~myjournai/auth-server';


// Type extension for H3 context
declare module "h3" {
  interface H3EventContext {
    user: User
    isAdmin: boolean
  }
}

export default defineEventHandler(async (event) => {
  // Will execute everything but /auth routes
  const pathName = getRequestURL(event).pathname;
  console.log(`[auth-middleware] Request to: ${pathName}`);

  if (pathName.startsWith('/api') && !pathName.startsWith('/api/auth')) {
    try {
      // Authenticate user
       const authenticatedUser= await authenticateUser(event);

      event.context.user = authenticatedUser;
      event.context.isAdmin = isAdmin(authenticatedUser)

      console.log(`[auth-middleware] User authenticated: ${event.context.user.email} (Admin: ${event.context.isAdmin})`);

      // Check for admin routes
      if (!event.context.isAdmin) {
        if ( pathName.startsWith('/api/contexts') ||
          pathName.startsWith('/api/cohorts')
        )
        console.log(`[auth-middleware] Access denied: ${event.context.user.email} tried to access admin route`);
        throw new Error('Unauthorized');
      }
    } catch (e) {
      console.log(`[auth-middleware] Authentication error: ${e.message || JSON.stringify(e)}`);
      throw createError({
        status: 401,
        statusMessage: 'Authentication failed.'
      })
    }
  }
});
