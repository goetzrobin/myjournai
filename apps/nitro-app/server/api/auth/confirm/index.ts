import { defineEventHandler, sendRedirect } from 'h3';
import { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '~myjournai/auth-server';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token_hash = query.token_hash as string;
  const type = query.type as EmailOtpType | null;
  let redirectTo = (query.next as string) ?? '/';

  if (token_hash && type) {
    const authClient = createClient(event);
    const { data, error } = await authClient.auth.verifyOtp({
      type,
      token_hash,
    });
    console.log(data, error)


    if (!error) {
      return sendRedirect(event, redirectTo);
    }
  }

  // Redirect to an error page with instructions
  redirectTo = '/reset-password-failed';
  return sendRedirect(event, redirectTo);
});
