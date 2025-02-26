import { createClient } from './client';
import { createError, H3Event } from 'h3';
import { User } from '@supabase/auth-js';

export const authenticateUser = async (event: H3Event): Promise<User> => {
  const supabase = await createClient(event);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    await supabase.auth.signOut();
    throw createError({
      status: error?.status,
      message: error?.message,
    });
  }
  return data.user;
};
