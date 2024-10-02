import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useUserQuery } from '~myjournai/user-client';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import { WithMobileNav } from '../-nav/with-mobile-nav';
import { PropsWithChildren } from 'react';
import { Button } from '~myjournai/components';
import { useSessionsWithLogsQuery } from '~myjournai/session-client';
import { SessionWithLogs } from '~myjournai/session-shared';

export const Route = createFileRoute('/_app/')({
  component: Index
});

const MenuItem = ({ session }: PropsWithChildren<{ session: Pick<SessionWithLogs, 'logs' | 'slug' | 'imageUrl' | 'name' | 'description'> }>) => {
  const hasInProgressLog = session.logs.some(l => l.status === 'IN_PROGRESS');
  const hasCompletedLog = session.logs.some(l => l.status === 'COMPLETED');

  const nav = useNavigate();

  const onPress = (session.slug === 'onboarding-v0') ?
    () => nav({ to: '/onboarding/final-convo' }) :
    (session.slug === 'offboarding-v0') ? () => nav({ to: `/offboarding` }):
    () => nav({ to: `/sessions/${session.slug}` });

  return <div className="drop-shadow-xl overflow-hidden relative rounded-xl border">
    <div className="bg-gradient-to-b px-8 py-8 -mt-8 to-40% from-transparent to-background/80">
      <h4 className="text-3xl font-serif text-center mt-4 mb-4">{session?.name}</h4>
      <p className="text-muted-foreground text-lg text-center">{session?.description}</p>
      <Button isDisabled={!onPress} onPress={onPress} className="w-full mt-8" variant="secondary">
        {hasInProgressLog ? 'Continue' : hasCompletedLog ? 'View' : 'Start'}
      </Button>
    </div>
  </div>;
};

function Index() {
  const userQ = useUserQuery(useAuthUserIdFromHeaders());
  const sessionsQ = useSessionsWithLogsQuery({ userId: userQ.data?.id });
  const sessions = sessionsQ.data ?? [];

  const endSession = {
    id: 'end-session',
    logs: [],
    slug: 'offboarding-v0',
    imageUrl: 'the-journey-continues.jpg',
    name: 'The journey continues',
    description: 'Your final session with Sam, for now!'
  }

  return <WithMobileNav>
    <div className="flex flex-col h-full w-full">
      <div className="overflow-auto pb-20 pt-8 px-8 -mx-8 space-y-10">
        {!sessionsQ.isPending ? null : <p className="py-20 text-center">Loading sessions</p>}
        {sessions.map(s => <MenuItem session={s} key={s.id}>{s.name}</MenuItem>)}
        <MenuItem key={endSession.id} session={endSession} />
      </div>
    </div>
  </WithMobileNav>
    ;
}
