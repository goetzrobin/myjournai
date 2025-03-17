import { createFileRoute, Outlet } from '@tanstack/react-router';
import { authenticateRoute } from '~myjournai/auth-client';
import { redirectToUnfinishedOnboarding, useIsAdmin } from '~myjournai/user-client';
import MobileNav from './-nav/mobile-nav';
import ReloadPrompt from './-reload/reload-prompt';
import { useDarkMode } from '~myjournai/components';
import { useMobileNavShowing } from './-nav/mobile-nav.store';

export const Route = createFileRoute('/_app')({
  beforeLoad: authenticateRoute,
  loader: async ({ context, location }) => await redirectToUnfinishedOnboarding(location, context?.queryClient),
  component: AppLayout
});

function AppLayout() {
  useDarkMode();
  const {isAdmin} = useIsAdmin();
  const isMobileNavShowing = useMobileNavShowing()
  return (
    <>
      <ReloadPrompt />
      <div className={"flex flex-col-reverse mx-auto h-full " + ((isAdmin && !isMobileNavShowing) ? '' : 'max-w-screen-sm')}>
        <MobileNav />
        <div className="p-2 flex-1 min-h-0 items-stretch">
          <Outlet />
        </div>
      </div>
    </>
  );
}
