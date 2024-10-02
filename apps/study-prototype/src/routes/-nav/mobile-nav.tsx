import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUserSuspenseQuery } from '~myjournai/user-client';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import { useMobileNavShowing } from './mobile-nav.store';
import { Link } from '~myjournai/components';
import { LucideBookMarked, LucideMountainSnow, PersonStanding } from 'lucide-react';

const MobileNav = () => {
  const isShowingNav = useMobileNavShowing();
  const userQ = useUserSuspenseQuery(useAuthUserIdFromHeaders());
  const navigate = useNavigate();
  return (!userQ.data?.onboardingCompletedAt || !isShowingNav) ? null : <>
    <ul className="flex-none bg-background p-2 flex justify-around">
      <li>
        <Link
          variant="icon"
          to="/"
          className="flex flex-col data-[status='active']:text-foreground"
        >
          <LucideMountainSnow className="size-6"/>
          <span className="text-[.6rem] mt-0.5">Journey</span>
        </Link>
      </li>
      <li>
        <Link
          variant="icon"
          className="flex flex-col data-[status='active']:text-foreground"
          to="/resources"
        >
          <LucideBookMarked className="size-6" />
          <span className="text-[.6rem] mt-0.5">Resources</span>
        </Link>
      </li>
      <li>
        <Link
          variant="icon"
          className="flex flex-col data-[status='active']:text-foreground"
          to="/profile"
        >
          <PersonStanding className="size-6"/>
          <span className="text-[.6rem] mt-0.5">{userQ.data?.name}</span>
        </Link>
      </li>
    </ul>
    <hr />
  </>
};

export default MobileNav;
