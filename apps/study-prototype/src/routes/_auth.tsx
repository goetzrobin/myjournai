import { createFileRoute, Outlet } from '@tanstack/react-router';
import { JournaiJ } from '~myjournai/components';

export const Route = createFileRoute('/_auth')({
  component: () => <div className="p-2 mx-auto max-w-screen-sm h-full">
    <div>
      <div className="mx-auto mt-16 mb-10 flex justify-center items-center">
        <JournaiJ className="size-10" />
        <span className="ml-1 text-4xl tracking-tight font-bold">journai</span>
      </div>
      <p className="pt-10 pb-16 mx-auto max-w-[80%] text-3xl text-center">Find your path, start your post athletics
        journey.</p>
    </div>
    <Outlet />
  </div>
});
