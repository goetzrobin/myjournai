import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useUserQuery } from '@myjournai/user-client';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import { WithMobileNav } from '../-nav/with-mobile-nav';
import { PropsWithChildren } from 'react';
import { Button } from '~myjournai/components';
import { useSessionsWithLogsQuery } from '~myjournai/session-client';
import { SessionWithLogs } from '~myjournai/session-shared';

export const Route = createLazyFileRoute('/_app/')({
  component: Index
});

const MenuItem = ({ children, onPress }: PropsWithChildren<{ onPress?: () => void }>) => <Button
  isDisabled={!onPress}
  onPress={onPress}
  variant="secondary"
  className="min-h-40 w-full rounded-xl p-4 shadow-xl border">{children}</Button>;

function Index() {
  const userQ = useUserQuery(useAuthUserIdFromHeaders());
  const sessionsQ = useSessionsWithLogsQuery({ userId: userQ.data?.id });
  const sessions = sessionsQ.data ?? [];
  const nav = useNavigate();

  const createOnPress = (s: SessionWithLogs) => {
    if (s.slug === 'onboarding-v0') return () => nav({to: '/onboarding/final-convo'})
    return () => nav({ to: `/sessions/${s.slug}` });
  };

  return <WithMobileNav>
    <div className="pt-8 space-y-8 flex flex-col h-full w-full">
      {sessions.map(s => <MenuItem
        onPress={s.logs.length > 0 && s.logs.every(l => l.status !== 'IN_PROGRESS') ? undefined : createOnPress(s)}
        key={s.id}>{s.name}</MenuItem>)}
    </div>
  </WithMobileNav>
    ;
}
