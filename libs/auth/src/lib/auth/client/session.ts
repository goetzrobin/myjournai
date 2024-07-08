import { AuthSession } from '@supabase/supabase-js';

export const getAuthSessionFromHeaders = (): AuthSession | null => {
  const cookie = decodeURIComponent(decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)sb-jmshkhnxlzrufcokmgrx-auth-token.0\s*=\s*([^;]*).*$)|^.*$/, '$1')));
  const cookie2 = decodeURIComponent(decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)sb-jmshkhnxlzrufcokmgrx-auth-token.1\s*=\s*([^;]*).*$)|^.*$/, '$1')));
  if (!cookie || !cookie2) {
    return null;
  }
  return JSON.parse(cookie + cookie2);
};
