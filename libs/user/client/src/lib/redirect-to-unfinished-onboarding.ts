import { useAuthSessionFromHeaders } from '@myjournai/auth-client';
import { ensureUserQuery } from './queries/user.query';
import { ParsedLocation, redirect } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

export const redirectToUnfinishedOnboarding = async (location: ParsedLocation, queryClient: QueryClient) => {
  const session = useAuthSessionFromHeaders();
  const user = await ensureUserQuery(queryClient, session?.user?.id);
  if (!location.pathname.startsWith('/onboarding') && !user?.onboarding_completed_at) {
    console.log('root level redirecting to onboarding')
    throw redirect({
      to: '/onboarding'
    });
  }
  return user
}
