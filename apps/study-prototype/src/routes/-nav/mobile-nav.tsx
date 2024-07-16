import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useUserSuspenseQuery } from '@myjournai/user-client';
import { useAuthUserIdFromHeaders, useSignOutMutation } from '@myjournai/auth-client';

const MobileNav = () => {
  const userQ = useUserSuspenseQuery(useAuthUserIdFromHeaders());
  const navigate = useNavigate();
  const signOutMut = useSignOutMutation(() =>
    navigate({
      to: '/sign-in'
    })
  );
  return !userQ.data?.onboarding_completed_at ? null : <>
    <ul className="mx-auto flex-none p-2 pb-8 flex gap-2">
      <li>
        <Link
          to="/"
          className="hover:underline data-[status='active']:font-semibold"
        >
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/about"
          className="hover:underline data-[status='active']:font-semibold"
        >
          Invoices
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
