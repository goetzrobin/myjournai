import { ensureUserQuery, useUserQuery } from './queries/user.query';
import { ADMIN_EMAILS, useAuthSessionFromHeaders, useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import { ParsedLocation, redirect } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';


export const useIsAdmin = () => {
  const userId = useAuthUserIdFromHeaders();
  const userQ = useUserQuery(userId);
  const isAdmin = ADMIN_EMAILS.includes(userQ.data?.username ?? '');
  return { isAdmin };
};

export const redirectWhenNotAdmin = async (location: ParsedLocation, queryClient: QueryClient) => {
  const session = useAuthSessionFromHeaders();
  const user = await ensureUserQuery(queryClient, session?.user?.id);
  if (!(user && user.username && ADMIN_EMAILS.includes(user.username))) {
    throw redirect({
      to: '/sign-in',
      search: {
        // Use the current location to power a redirect after login
        // (Do not use `router.state.resolvedLocation` as it can
        // potentially lag behind the actual current location)
        redirect: location.href,
      },
    });
  }
}
