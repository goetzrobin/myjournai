import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useUserQuery } from '@myjournai/user-client';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import { WithMobileNav } from '../-nav/with-mobile-nav';
import { PropsWithChildren } from 'react';
import { Button } from '~myjournai/components';

export const Route = createLazyFileRoute('/_app/')({
  component: Index
});

const MenuItem = ({ children, onPress }: PropsWithChildren<{onPress?: () => void}>) => <Button
  isDisabled={!onPress}
  onPress={onPress}
  variant="secondary"
  className="min-h-40 w-full rounded-xl p-4 shadow-xl border">{children}</Button>;

function Index() {
  const userQ = useUserQuery(useAuthUserIdFromHeaders());
  const nav = useNavigate()
  return <WithMobileNav>
    <div className="pt-8 space-y-8 flex flex-col h-full w-full">
      {!userQ.data?.onboardingCompletedAt ? null : <MenuItem>Onboarding Item</MenuItem>}
      <MenuItem onPress={() => nav({to: '/sessions/alignment'})}>Jeff's first session</MenuItem>
    </div>
  </WithMobileNav>
    ;
}
