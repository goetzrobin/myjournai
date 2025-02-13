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
  const headers = event.node.req.headers;

  console.log('Request details:', {
    method: event.method,
    path: event.path,
    userAgent: headers['user-agent'],
    referer: headers.referer,
    secFetch: {
      dest: headers['sec-fetch-dest'],
      mode: headers['sec-fetch-mode'],
      site: headers['sec-fetch-site'],
      user: headers['sec-fetch-user']
    }
  });

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
  console.log('Checking lock:', { lockKey });
  const isProcessing = await kv.get(lockKey);
  console.log('Lock state:', { isProcessing });

  if (isProcessing) {
    console.log('Duplicate request detected for token:', token_hash?.substring(0, 10));
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
    console.log('Setting lock');
    await kv.set(lockKey, true, { ex: 5 });
    console.log('Lock set');

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
    console.log('Cleaning up lock');
    try {
      await kv.del(lockKey);
      console.log('Lock cleaned up');
    } catch (kvDelError) {
      console.error('Failed to clean up lock:', kvDelError);
    }
  }
});
