import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import OnboardingWrapper from './-components/-onboarding-wrapper';
import { Button, TextField } from '~myjournai/components';
import { FormEvent, useState } from 'react';
import { LucideChevronLeft } from 'lucide-react';
import { ensureUserQuery, useUserSuspenseQuery, useUserUpdateMutation } from '@myjournai/user-client';
import { useAuthUserIdFromHeaders, useSignInMutation } from '@myjournai/auth-client';

export const Route = createFileRoute('/_app/onboarding/name')({
  loader: async ({ context: { queryClient } }) => {
    const userId = useAuthUserIdFromHeaders();
    return await ensureUserQuery(queryClient, userId);
  },
  component: () => {
    const navigate = useNavigate();
    const userId = useAuthUserIdFromHeaders();
    const { data: user } = useUserSuspenseQuery(userId);
    const mutation = useUserUpdateMutation({ userId });
    const [name, setName] = useState(user?.name ?? '');
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      mutation.mutate({ name }, { onSuccess: () => setTimeout(() => navigate({ to: '/onboarding/pronouns' }), 500) });
    };
    return <OnboardingWrapper currentStep="name" className="block">
      <form onSubmit={handleSubmit} className="flex flex-col items-center mt-16 justify-between">
        <div className="w-full">
          <h1 className="text-2xl text-center">What's your name?</h1>
          <p className="mt-4 text-muted-foreground text-center">Sam will use this name to refer to you.</p>
          <TextField inputClassName="text-xl text-center" placeholder="e.g. Caitie" value={name} onChange={setName}
                     className="mt-8" aria-label="Name" />
        </div>
        <Button type="submit" isDisabled={name.length === 0}
                className="absolute left-0 right-0 bottom-4">Continue</Button>
      </form>
    </OnboardingWrapper>;
  }
});
