import {
  createFileRoute,
  Outlet,
} from '@tanstack/react-router';
import {
  authenticateRoute,
} from '@myjournai/auth-client';
import { redirectToUnfinishedOnboarding } from '@myjournai/user-client';
import MobileNav from './-nav/mobile-nav';

export const Route = createFileRoute('/_app')({
  beforeLoad: authenticateRoute,
  loader: async ({ context, location }) => await redirectToUnfinishedOnboarding(location, context.queryClient),
  component: AppLayout
});

function AppLayout() {

  return (
    <div className="flex flex-col-reverse mx-auto max-w-screen-sm h-full">
      <MobileNav />
      <div className="p-2 flex-1 min-h-0 items-stretch">
        <Outlet />
      </div>
    </div>
  );
}
