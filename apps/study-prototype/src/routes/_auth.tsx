import { createFileRoute, Outlet } from '@tanstack/react-router';
import { JournaiJ } from '~myjournai/components';

export const Route = createFileRoute('/_auth')({
  component: () => <div className="flex flex-col p-2 mx-auto max-w-screen-sm h-full">
    <div className="flex-none mx-auto mt-16 mb-10 flex justify-center items-center">
      <JournaiJ className="text-foreground size-10" />
      <span className="ml-1 text-4xl tracking-tight text-foreground font-bold">journai</span>
    </div>
    <Outlet />
  </div>
});
