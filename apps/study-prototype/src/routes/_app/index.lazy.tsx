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

const MenuItem = ({ session, onPress }: PropsWithChildren<{ session: SessionWithLogs; onPress?: () => void }>) => {
  const hasInProgressLog = session.logs.some(l => l.status === 'IN_PROGRESS')
  const hasCompletedLog = session.logs.some(l => l.status === 'COMPLETED')
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
      {hasInProgressLog ? 'Continue' : hasCompletedLog ? 'Restart' : 'Start'}
    </Button>
  </div>;
}

function Index() {
  const userQ = useUserQuery(useAuthUserIdFromHeaders());
  const sessionsQ = useSessionsWithLogsQuery({ userId: userQ.data?.id });
  const sessions = sessionsQ.data ?? [];
  const nav = useNavigate();

  const createOnPress = (s: SessionWithLogs) => {
    if (s.slug === 'onboarding-v0') return () => nav({ to: '/onboarding/final-convo' })
    return () => nav({ to: `/sessions/${s.slug}` });
  };

  return <WithMobileNav>
    <div className="flex flex-col h-full w-full">
      <div className="overflow-auto pb-20 pt-8 space-y-8">
        {!sessionsQ.isPending ? null : <p>Loading sessions</p>}
        {sessions.map(s => <MenuItem
          session={s}
          onPress={createOnPress(s)}
          key={s.id}>{s.name}</MenuItem>)}
      </div>
    </div>
  </WithMobileNav>
    ;
}
