import { defineEventHandler, sendRedirect } from 'h3';
import { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '~myjournai/auth-server';

export default defineEventHandler(async (event) => {
  // Only process GET requests
  if (event.method !== 'GET') {
    return new Response(null, { status: 204 }); // No content for non-GET requests
  }

  const query = getQuery(event);
  const token_hash = query.token_hash as string;
  const type = query.type as EmailOtpType | null;
  let redirectTo = (query.next as string) ?? '/';

  // Validate required parameters
  if (!token_hash || !type) {
    return sendRedirect(event, '/reset-password-failed?reason=missing-params');
  }

  try {
    const authClient = createClient(event);
    const { data, error } = await authClient.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      // Log the error for debugging
      console.error('OTP verification failed:', error);
      return sendRedirect(event, `/reset-password-failed?reason=${error.code}`);
    }

    return sendRedirect(event, redirectTo);
  } catch (err) {
    console.error('Unexpected error during OTP verification:', err);
    return sendRedirect(event, '/reset-password-failed?reason=unexpected-error');
  }
});
