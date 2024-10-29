import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useIsAdmin, useUserQuery } from '~myjournai/user-client';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import { WithMobileNav } from '../-nav/with-mobile-nav';
import { PropsWithChildren } from 'react';
import { Button } from '~myjournai/components';
import { useSessionsWithLogsQuery } from '~myjournai/session-client';
import { SessionWithLogs } from '~myjournai/session-shared';
import { twMerge } from 'tailwind-merge';
import { LucideChevronRight } from 'lucide-react';

export const Route = createFileRoute('/_app/')({
  component: Index
});

const ToOffboarding = () => {
  return <Link className="block relative rounded-xl" to="/offboarding">
    <img
      className="-z-10 object-cover h-32 border rounded-xl"
      src="/sessions/the-journey-continues.jpg"
      width={800}
      height={500}
      alt="Mountain range with unique motive fitting the session"
    />
    <div className="bg-zinc-600/80 mix-blend-multiply rounded-xl absolute top-0 left-0 right-0 bottom-0"></div>
    <div className="rounded-xl p-4 absolute top-0 left-0 right-0 bottom-0">
      <h4 className="text-lg text-white font-serif mb-2">The Journey Continues</h4>
      <p className="text-zinc-300 text-sm">Take the final research survey and read Sam's final note to send you
        on your next journey!</p>

      <LucideChevronRight className="absolute text-white bottom-4 right-4 size-6" />
    </div>
  </Link>;
};

const MenuItem = ({ isAlwaysStartable, previousSession, session }: PropsWithChildren<{
  isAlwaysStartable: boolean;
  previousSession?: Pick<SessionWithLogs, 'logs' | 'slug' | 'imageUrl' | 'name' | 'description'>
  session: Pick<SessionWithLogs, 'logs' | 'slug' | 'imageUrl' | 'name' | 'description'>
}>) => {
  const isSessionReadyToStart = !previousSession || previousSession.logs.some(l => l.status === 'COMPLETED');
  const hasInProgressLog = session.logs.some(l => l.status === 'IN_PROGRESS');
  const hasCompletedLog = session.logs.some(l => l.status === 'COMPLETED');

  const nav = useNavigate();

  const onPress = (session.slug === 'onboarding-v0') ?
    () => nav({ to: '/onboarding/final-convo' }) :
    (session.slug === 'offboarding-v0') ? () => nav({ to: `/offboarding` }) :
      () => nav({ to: `/sessions/${session.slug}` });

  return <div className="relative">
    <img
      className={twMerge('drop-shadow-xl border filter rounded-xl h-96 object-cover', !hasCompletedLog ? 'grayscale' : '')}
      src={`/sessions/${session.imageUrl}`}
      width={800}
      height={500}
      alt="Mountain range with unique motive fitting the session"
    />
    <div
      className="absolute rounded-b-xl bottom-0 left-0 right-0 bg-gradient-to-b px-4 py-8 -mt-8 to-40% from-transparent to-zinc-800/80">
      <h4 className="text-3xl font-serif text-center text-white mb-4">{session?.name}</h4>
      <p className="text-zinc-300 text-lg text-center">{session?.description}</p>
      {!isSessionReadyToStart && !isAlwaysStartable ? null : <Button isDisabled={!onPress} onPress={onPress} className="w-full mt-8" variant="secondary">
        {hasInProgressLog ? 'Continue' : hasCompletedLog ? 'View' : 'Start'}
      </Button>}
    </div>
  </div>;
};


const PendingSessionsIndicator = () => <div className="opacity-50 space-y-10">
  <div
    className="h-96 bg-gradient-to-b to-40% from-muted/10 to-muted/80 animate-pulse rounded-xl"
  />
  <div
    className="h-96 bg-gradient-to-b to-40% from-muted/10 to-muted/80 animate-pulse rounded-xl"
  />
  <div
    className="h-96 bg-gradient-to-b to-40% from-muted/10 to-muted/80 animate-pulse rounded-xl"
  />
  <div
    className="h-96 bg-gradient-to-b to-40% from-muted/10 to-muted/80 animate-pulse rounded-xl"
  />
  <div
    className="h-96 bg-gradient-to-b to-40% from-muted/10 to-muted/80 animate-pulse rounded-xl"
  />
</div>
function Index() {
  const userQ = useUserQuery(useAuthUserIdFromHeaders());
  const sessionsQ = useSessionsWithLogsQuery({ userId: userQ.data?.id });
  const sessions = sessionsQ.data ?? [];
  const {isAdmin} = useIsAdmin();
  const allSessionsCompleted = sessions.every(session => session.logs.some(l => l.status === 'COMPLETED'));

  return <WithMobileNav>
    <div className="flex flex-col h-full w-full">
      <div className="overflow-auto pb-20 pt-8 px-2 space-y-10">
        {!(userQ.data?.offboardingInitiated || allSessionsCompleted) ? null : <ToOffboarding />}
        {!sessionsQ.isPending ? null : <PendingSessionsIndicator/>}
        {sessions.map((s,i) => <MenuItem
          isAlwaysStartable={isAdmin}
          previousSession={sessions[i-1]}
          session={s} key={s.id}>{s.name}</MenuItem>)}
      </div>
    </div>
  </WithMobileNav>
    ;
}
