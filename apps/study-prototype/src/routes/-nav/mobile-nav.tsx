import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useUserSuspenseQuery } from '@myjournai/user-client';
import { useAuthUserIdFromHeaders, useSignOutMutation } from '@myjournai/auth-client';
import { useMobileNavShowing } from './mobile-nav.store';

const MobileNav = () => {
  const isShowingNav = useMobileNavShowing();
  const userQ = useUserSuspenseQuery(useAuthUserIdFromHeaders());
  const navigate = useNavigate();
  const signOutMut = useSignOutMutation(() =>
    navigate({
      to: '/sign-in'
    })
  );
  return (!userQ.data?.onboardingCompletedAt || !isShowingNav) ? null : <>
    <ul className="mx-auto flex-none p-2 pb-8 flex gap-2">
      <li>
        <Link
          to="/"
          className="hover:underline data-[status='active']:font-semibold"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/resources"
          className="hover:underline data-[status='active']:font-semibold"
        >
          Resources
        </Link>
      </li>
      <li>
        <button
          type="button"
          className="hover:underline"
          onClick={() => signOutMut.mutate()}
        >
          Logout
        </button>
      </li>
    </ul>
    <hr />
  </>
};

export default MobileNav;
