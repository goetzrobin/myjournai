import { defineEventHandler, readBody } from 'h3';
import { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '~myjournai/auth-server';

type ConfirmBody = {
  token_hash: string;
  type: EmailOtpType;
  next: string;
}

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return new Response(null, { status: 405 }); // Method Not Allowed
  }

  try {
    const body = await readBody<ConfirmBody>(event);
    const authClient = await createClient(event);

    const { data, error } = await authClient.auth.verifyOtp({
      type: body.type,
      token_hash: body.token_hash,
    });

    if (error) {
      console.error('Recovery verification failed:', error.code);
      return new Response(
        JSON.stringify({
          error: error.code,
          message: error.message
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({
        error: 'unexpected-error',
        message: 'An unexpected error occurred'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});
