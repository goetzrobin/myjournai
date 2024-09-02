import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUserSuspenseQuery } from '@myjournai/user-client';
import { useAuthUserIdFromHeaders, useSignOutMutation } from '@myjournai/auth-client';
import { useMobileNavShowing } from './mobile-nav.store';
import { Button, Link } from '~myjournai/components';
import { LucideBookMarked, LucideLogOut, LucideMountainSnow } from 'lucide-react';

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
    <ul className="mx-auto flex-none p-2 pb-8 flex gap-8">
      <li>
        <Link
          variant="icon"
          to="/"
          className="flex flex-col data-[status='active']:text-foreground"
        >
          <LucideMountainSnow/>
          <span className="text-[.6rem] mt-1">Journey</span>
        </Link>
      </li>
      <li>
        <Link
          variant="icon"
          className="flex flex-col data-[status='active']:text-foreground"
          to="/resources"
        >
          <LucideBookMarked />
          <span className="text-[.6rem] mt-1">Resources</span>
        </Link>
      </li>
      <li>
        <Button
          variant="icon"
          type="button"
          className="flex flex-col data-[status='active']:text-foreground"
          onPress={() => signOutMut.mutate()}
        >
          <LucideLogOut />
          <span className="text-[.6rem] mt-1">Sign out</span>
        </Button>
      </li>
    </ul>
    <hr />
  </>
};

export default MobileNav;
