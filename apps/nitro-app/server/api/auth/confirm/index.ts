import { defineEventHandler, getQuery, H3Event, sendRedirect } from 'h3';
import { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '~myjournai/auth-server';

// Simple in-memory request lock
const processingTokens = new Set<string>();

const logRequest = (event: H3Event, params?: Record<string, any>) => {
  console.log(`Incoming ${event.method} request to ${event.path}`);
  if (params) {
    console.log('Parameters:', params);
  }
};

export default defineEventHandler(async (event) => {
  const userAgent = event.node.req.headers['user-agent'];
  console.log('User Agent:', userAgent);

  logRequest(event);

  if (event.method !== 'GET') {
    logRequest(event, { message: 'Non-GET request received, returning 204' });
    return new Response(null, { status: 204 });
  }

  const query = getQuery(event);
  const token_hash = query.token_hash as string;
  const type = query.type as EmailOtpType | null;
  const redirectTo = (query.next as string) ?? '/';

  // Check if we're already processing this token
  if (token_hash && processingTokens.has(token_hash)) {
    console.log('Duplicate request detected for token:', token_hash.substring(0, 10));
    return new Response(null, { status: 425 }); // 425 Too Early
  }

  logRequest(event, {
    type,
    redirectTo,
    token_hash: token_hash ? `${token_hash.substring(0, 10)}...` : 'missing'
  });

  if (!token_hash || !type) {
    return sendRedirect(event, '/reset-password-failed?reason=missing-params', 303);
  }

  try {
    // Add token to processing set
    processingTokens.add(token_hash);

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
  } finally {
    // Always remove token from processing set
    processingTokens.delete(token_hash);
  }
});
