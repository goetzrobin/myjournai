import { defineEventHandler, getQuery, H3Event, sendRedirect } from 'h3';
import { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '~myjournai/auth-server';

const logRequest = (event: H3Event, params?: Record<string, any>) => {
  console.log(`Incoming ${event.method} request to ${event.path}`);
  if (params) {
    console.log('Parameters:', params);
  }
};

export default defineEventHandler(async (event) => {
  logRequest(event);

  // Handle non-GET requests immediately
  if (event.method !== 'GET') {
    logRequest(event, { message: 'Non-GET request received, returning 204' });
    return new Response(null, { status: 204 });
  }

  const query = getQuery(event);
  const token_hash = query.token_hash as string;
  const type = query.type as EmailOtpType | null;
  const redirectTo = (query.next as string) ?? '/';

  logRequest(event, {
    type,
    redirectTo,
    token_hash: token_hash ? `${token_hash.substring(0, 10)}...` : 'missing'
  });

  // Early return if missing parameters
  if (!token_hash || !type) {
    return sendRedirect(event, '/reset-password-failed?reason=missing-params', 303);
  }

  try {
    const authClient = createClient(event);

    console.log(`Processing recovery for token_hash: ${token_hash.substring(0, 10)}...`);

    const { data, error } = await authClient.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error('Recovery verification failed:', error.code);

      return sendRedirect(event, `/reset-password-failed?reason=${error.code}`, 303);
    }

    console.log('Successful verification, redirecting to:', redirectTo);

    return sendRedirect(event, redirectTo, 303);
  } catch (err) {
    console.error('Unexpected error:', err);
    return sendRedirect(event, '/reset-password-failed?reason=unexpected-error', 303);
  }
});
