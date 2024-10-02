import { createFileRoute, useNavigate } from '@tanstack/react-router';
import OnboardingWrapper from './-components/-onboarding-wrapper';
import { SmoothButton, TextField } from '~myjournai/components';
import React, { FormEvent, useState } from 'react';
import { LucideLoader } from 'lucide-react';
import { ensureUserQuery, useUserSuspenseQuery, useUserUpdateMutation } from '~myjournai/user-client';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';

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
      mutation.mutate({ name }, { onSuccess: () => setTimeout(() => navigate({ to: '/onboarding/pronouns' }), 800) });
    };
    return <OnboardingWrapper currentStep="name" className="block">
      <form onSubmit={handleSubmit} className="flex flex-col items-center mt-16 justify-between">
        <div className="w-full">
          <h1 className="text-2xl text-center">What's your name?</h1>
          <p className="mt-4 text-muted-foreground text-center">Sam will use this name to refer to you.</p>
          <TextField inputClassName="text-xl text-center" placeholder="e.g. Caitie" value={name} onChange={setName}
                     className="mt-8" aria-label="Name" />
        </div>
        <SmoothButton type="submit" className="absolute left-0 right-0 bottom-4" isDisabled={name.length === 0}
                      buttonState={mutation.status}>
          {mutation.status !== 'idle' ? null : 'Continue'}
          {mutation.status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
          {mutation.status !== 'success' ? null : `Got it, ${name}!`}
          {mutation.status !== 'error' ? null : 'Something went wrong... Try again!'}
        </SmoothButton>
      </form>
    </OnboardingWrapper>;
  }
});
