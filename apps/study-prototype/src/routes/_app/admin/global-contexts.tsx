import { createFileRoute } from '@tanstack/react-router';
import { GlobalContextModal } from './-components/GlobalContextModal';
import { GlobalContextsTable } from './-components/GlobalContextsTable';
import { useMobileNavActions } from '../../-nav/mobile-nav.store';
import { useEffect } from 'react';

export const Route = createFileRoute('/_app/admin/global-contexts')({
  component: RouteComponent
})
function RouteComponent() {
  const { setShowingMobileNav } = useMobileNavActions();

  useEffect(() => {
    setShowingMobileNav(false);
  }, []);

  // Handle refresh of the table after adding a new context
  const handleContextAdded = () => {
    // The invalidation is already handled by the mutation hook
    // This is just a placeholder in case you need additional logic
  };
  return  <div className="p-4 max-w-6xl mx-auto">
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Global Contexts</h1>
        <GlobalContextModal
          onSuccess={handleContextAdded}
          buttonLabel="Add Global Context"
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
        Manage weekly global contexts that will be shown to all users
      </p>
    </div>

    <GlobalContextsTable />
  </div>
}
