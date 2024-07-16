import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthSessionFromHeaders } from '@myjournai/auth-client';
import { ensureUserQuery } from '@myjournai/user-client';

export const Route = createFileRoute('/_app/onboarding')({
  loader: async ({
                   location,
                   context
                 }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const session = useAuthSessionFromHeaders();
    const user = await ensureUserQuery(context.queryClient, session?.user?.id);
    const userDataComplete = !!(user && user.gender_identity && user.ethnicity && user.ncaa_division && user.graduation_year);
    console.log(userDataComplete,localStorage.getItem('journai-cidi-complete') )
    if (!location.pathname.startsWith('/onboarding/user') && !userDataComplete) {
      throw redirect({
        to: '/onboarding/user'
      });
    }
    const cidiSurveyComplete = localStorage.getItem('journai-cidi-complete') !== null;
    if (!location.pathname.startsWith('/onboarding/career-identity-confusion/survey') && userDataComplete
      && !cidiSurveyComplete) {
      throw redirect({
        to: '/onboarding/career-identity-confusion/survey'
      });
    }
  }
});
