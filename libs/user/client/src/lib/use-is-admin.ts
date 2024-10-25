import { useUserQuery } from './queries/user.query';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';

export const useIsAdmin = () => {
  const userId = useAuthUserIdFromHeaders();
  const userQ = useUserQuery(userId);
  const isAdmin =
    ['tug29225@temple.edu', 'robin@neurotrainer.com', 'jnyquist@neurotrainer.com', 'jeff@neurotrainer.com']
      .includes(userQ.data?.username ?? '');
  return { isAdmin };
};
