import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useUserQuery } from '@myjournai/user-client';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import { WithMobileNav } from '../-nav/with-mobile-nav';
import { PropsWithChildren } from 'react';
import { Button } from '~myjournai/components';
import { useSessionsWithLogsQuery } from '~myjournai/session-client';
import { SessionWithLogs } from '~myjournai/session-shared';

export const Route = createFileRoute('/_app/')({
  component: Index
});

const MenuItem = ({ session }: PropsWithChildren<{ session: SessionWithLogs }>) => {
  const hasInProgressLog = session.logs.some(l => l.status === 'IN_PROGRESS');
  const hasCompletedLog = session.logs.some(l => l.status === 'COMPLETED');

  const nav = useNavigate();

  const onPress = (session.slug === 'onboarding-v0') ?
    () => nav({ to: '/onboarding/final-convo' }) :
    () => nav({ to: `/sessions/${session.slug}` });

  return <div className="bg-background shadow-xl overflow-hidden relative px-8 pb-8 pt-44 rounded-xl border">
    <img
      className="absolute left-0 top-0 h-40 object-cover"
      src={`/sessions/${session.imageUrl}`}
      width={800}
      height={500}
      alt="Picture of the author"
    />
    <h4 className="text-2xl font-serif text-center mb-4">{session?.name}</h4>
    <p className="text-muted-foreground text-lg text-center">{session?.description}</p>
    <Button isDisabled={!onPress} onPress={onPress} className="w-full mt-8" variant="secondary">
      {hasInProgressLog ? 'Continue' : hasCompletedLog ? 'View' : 'Start'}
    </Button>
  </div>;
};

function Index() {
  const userQ = useUserQuery(useAuthUserIdFromHeaders());
  const sessionsQ = useSessionsWithLogsQuery({ userId: userQ.data?.id });
  const sessions = sessionsQ.data ?? [];

  return <WithMobileNav>
    <div className="flex flex-col h-full w-full">
      <div className="overflow-auto pb-20 pt-8 space-y-8">
        {!sessionsQ.isPending ? null : <p className="py-20 text-center">Loading sessions</p>}
        {sessions.map(s => <MenuItem
          session={s}
          key={s.id}>{s.name}</MenuItem>)}
      </div>
    </div>
  </WithMobileNav>
    ;
}
