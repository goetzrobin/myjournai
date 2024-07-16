import { ParsedLocation, redirect } from '@tanstack/react-router';
import { useAuthSessionFromHeaders } from './session';

export const authenticateRoute = async ({
  location,
}: {
  location: ParsedLocation;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!useAuthSessionFromHeaders()) {
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
};
