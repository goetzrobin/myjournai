import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { AxiosInterceptor } from '~myjournai/http-client';

// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => (
    <AxiosInterceptor>
      <Outlet />
      <Suspense>
        {/*<ReactQueryDevtools buttonPosition="top-right" initialIsOpen={false} />*/}
        {/*<TanStackRouterDevtools position="top-left" initialIsOpen={false} />*/}
      </Suspense>
    </AxiosInterceptor>
  )
});
