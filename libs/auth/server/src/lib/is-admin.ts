import { ADMIN_EMAILS } from '~myjournai/auth-shared';
import { User } from '@supabase/auth-js';

export const isAdmin = (user?: User) => !!(user && user.email && ADMIN_EMAILS.includes(user.email))
