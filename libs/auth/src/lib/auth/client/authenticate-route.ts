import { ParsedLocation, redirect } from '@tanstack/react-router';
import { getAuthSessionFromHeaders } from './session';

export const authenticateRoute = async ({ location }: { location: ParsedLocation }) => {
  if (!getAuthSessionFromHeaders()) {
    throw redirect({
      to: '/',
      search: {
        // Use the current location to power a redirect after login
        // (Do not use `router.state.resolvedLocation` as it can
        // potentially lag behind the actual current location)
        redirect: location.href
      }
    });
  }
};
