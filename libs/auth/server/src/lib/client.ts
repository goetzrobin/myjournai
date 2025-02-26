import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { deleteCookie, getCookie, getRequestHeader, H3Event, setCookie } from 'h3';
import { createClient as createTokenBasedClient, SupabaseClient } from '@supabase/supabase-js';

export async function createClient(
  event: H3Event
): Promise<SupabaseClient<never, 'public', never>> {
  const authHeader = getRequestHeader(event, 'authorization');
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';
  const publicKey = process.env['NITRO_SUPABASE_URL'];
  const anonKey = process.env['NITRO_SUPABASE_ANON_KEY'];
  if (!publicKey || !anonKey) {
    throw Error(
      'supabase public and anon key must be set as environment variables'
    );
  }

  if (bearerToken.length === 0) {
    return createServerClient(publicKey, anonKey, {
      cookies: {
        get(name: string) {
          return getCookie(event, name);
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            setCookie(event, name, value, options);
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string) {
          try {
            deleteCookie(event, name);
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    });
  } else {
    const tokenBasedClient = createTokenBasedClient(publicKey, anonKey)
    await tokenBasedClient.auth.setSession({ access_token: bearerToken, refresh_token: "refresh" })
    return tokenBasedClient;
  }
}
