import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthSessionFromHeaders } from '@myjournai/auth-client';
import { ensureUserQuery } from '@myjournai/user-client';
import { parseLastStepFromLocalStorage } from '~myjournai/onboarding-client';


export const Route = createFileRoute('/_app/onboarding')({
  loader: async ({
                   location,
                   context,
                   cause
                 }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const session = useAuthSessionFromHeaders();
    const user = await ensureUserQuery(context.queryClient, session?.user?.id);
    const userNameKnown = user && user.name;
    const userDataComplete = !!(user && user.genderIdentity && user.ethnicity && user.ncaaDivision && user.graduationYear);
    const lastStep = parseLastStepFromLocalStorage();
    const lastPathName = '/onboarding/' + lastStep;
    if (
      !location.pathname.startsWith('/onboarding/start') &&
      !location.pathname.startsWith('/onboarding/meet-sam') &&
      !location.pathname.startsWith('/onboarding/name') &&
      !userNameKnown) {
      throw redirect({
        to: '/onboarding/start'
      });
    }
    // if (!location.pathname.startsWith('/onboarding/study')) {
      //   if (!location.pathname.startsWith(lastPathName)) {
      //     throw redirect({
      //       to: lastPathName
      //     });
      //   } else {
      // throw redirect({
      //   to: userDataComplete ? '/onboarding/study/convo-1/survey' : '/onboarding/study/user'
      // });
    // }
    // }

  }
});
