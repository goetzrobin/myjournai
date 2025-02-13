import { defineEventHandler, getQuery, H3Event, sendRedirect } from 'h3';
import { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '~myjournai/auth-server';
import { kv } from '@vercel/kv';

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

  // Check if token is being processed using Vercel KV
  const lockKey = `auth:token:${token_hash}:lock`;
  const isProcessing = await kv.get(lockKey);

  if (isProcessing) {
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
    // Set lock with 30 second expiry
    await kv.set(lockKey, true, { ex: 30 });

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
    // Clean up the lock
    await kv.del(lockKey);
  }
});
