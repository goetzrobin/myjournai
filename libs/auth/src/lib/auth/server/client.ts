import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { deleteCookie, getCookie, H3Event, setCookie } from 'h3';
import { SupabaseClient } from '@supabase/supabase-js';

export function createClient(event: H3Event): SupabaseClient<never, 'public', never> {
  const publicKey = process.env['NITRO_PUBLIC_SUPABASE_URL'];
  const anonKey = process.env['NITRO_PUBLIC_SUPABASE_ANON_KEY'];
  if (!publicKey || !anonKey) {
    throw Error('supabase public and anon key must be set as environment variables');
  }
  return createServerClient(
    publicKey, anonKey,
    {
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
        }
      }
    }
  );
}
