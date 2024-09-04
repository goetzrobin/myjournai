import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '~myjournai/components';
import { useAuthUserIdFromHeaders, useSignOutMutation } from '@myjournai/auth-client';
import { useUserQuery } from '@myjournai/user-client';
import { WithMobileNav } from '../../-nav/with-mobile-nav';

export const Route = createLazyFileRoute('/_app/profile/')({
  component: () => {
    const userQ = useUserQuery(useAuthUserIdFromHeaders());
    const signOutMut = useSignOutMutation();
    const nav = useNavigate();
    return <WithMobileNav>
      <div className="p-4">
        <h1 className="text-xl">{userQ.data?.name}</h1>
        <div className="pt-4">
          <Button className="w-full"
                  onPress={() => signOutMut.mutate(undefined, { onSuccess: () => nav({ to: '/sign-in' }) })}>Sign
            out</Button>
        </div>
      </div>
    </WithMobileNav>;
  }
});
