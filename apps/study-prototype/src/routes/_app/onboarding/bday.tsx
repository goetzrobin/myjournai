import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { DateField, SmoothButton } from '~myjournai/components';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import { ensureUserQuery, useUserSuspenseQuery, useUserUpdateMutation } from '~myjournai/user-client';
import React, { FormEvent } from 'react';
import OnboardingWrapper from './-components/-onboarding-wrapper';
import { LucideChevronLeft, LucideLoader } from 'lucide-react';
import { parseDate } from '@internationalized/date';
import { parseFormData } from '~myjournai/form-utils';

export const Route = createFileRoute('/_app/onboarding/bday')({
  loader: async ({ context: { queryClient } }) => {
    const userId = useAuthUserIdFromHeaders();
    return await ensureUserQuery(queryClient, userId);
  },
  component: Bday
});

function Bday() {
  const navigate = useNavigate();
  const userId = useAuthUserIdFromHeaders();
  const { data: user } = useUserSuspenseQuery(userId);
  const existingBday = user?.birthday ? parseDate(user?.birthday) : undefined;
  const mutation = useUserUpdateMutation({ userId });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const birthday = parseFormData(e)['date'];
    if (!birthday || birthday.length === 0) {
      await navigate({ to: '/onboarding/one-more-thing' });
      return;
    }
    mutation.mutate({ birthday }, { onSuccess: () => setTimeout(() => navigate({ to: '/onboarding/one-more-thing' }), 500) });
  };
  return <OnboardingWrapper currentStep="bday" className="block">
    <div className="flex items-center justify-between">
      <Link className="hover:bg-muted rounded-lg p-2" to="/onboarding/pronouns">
        <span className="sr-only">Back to previous step</span>
        <LucideChevronLeft className="size-5" />
      </Link>
      <div />
      <Link to="/onboarding/one-more-thing">Skip</Link>
    </div>
    <form onSubmit={handleSubmit} className="flex flex-col items-center mt-16 justify-between">
      <div className="w-full">
        <h1 className="text-2xl text-center">When were you born?</h1>
        <p className="mt-4 text-muted-foreground text-center">We want to mark it as a special day in our
          calendars.</p>
        <DateField defaultValue={existingBday} name="date" className="border p-2 rounded-lg mt-8 text-xl"
                   aria-label="Birthday" />
      </div>
      <SmoothButton type="submit" className="absolute left-0 right-0 bottom-4"
                    buttonState={mutation.status}>
        {mutation.status !== 'idle' ? null : 'Continue'}
        {mutation.status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
        {mutation.status !== 'success' ? null : `I'll make sure to remember!`}
        {mutation.status !== 'error' ? null : 'Something went wrong... Try again!'}
      </SmoothButton>    </form>
  </OnboardingWrapper>;
}
