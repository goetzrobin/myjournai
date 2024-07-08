import { AuthSession } from '@supabase/supabase-js';

export const getAuthSessionFromHeaders = (): AuthSession | null => {
  const cookie = decodeURIComponent(decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)sb-sxtpdrbqkflduazyzuga-auth-token\s*=\s*([^;]*).*$)|^.*$/, '$1')));
  console.log(cookie)
  if (cookie && cookie.length > 0) {
    return JSON.parse(cookie);
  }

  const cookie0 = decodeURIComponent(decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)sb-sxtpdrbqkflduazyzuga-auth-token.0\s*=\s*([^;]*).*$)|^.*$/, '$1')));
  const cookie1 = decodeURIComponent(decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)sb-sxtpdrbqkflduazyzuga-auth-token.1\s*=\s*([^;]*).*$)|^.*$/, '$1')));
  if (cookie0 && cookie1 && cookie0.length > 0 && cookie1.length > 0) {
    return JSON.parse(cookie0 + cookie1);
  }

  return null;
};
