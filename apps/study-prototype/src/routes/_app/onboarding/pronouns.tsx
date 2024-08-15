import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import OnboardingWrapper from './-components/-onboarding-wrapper';
import { Button, TextField } from '~myjournai/components';
import { FormEvent, useState } from 'react';
import { LucideChevronLeft } from 'lucide-react';
import { ensureUserQuery, useUserSuspenseQuery, useUserUpdateMutation } from '@myjournai/user-client';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';

export const Route = createFileRoute('/_app/onboarding/pronouns')({
  loader: async ({ context: { queryClient } }) => {
    const userId = useAuthUserIdFromHeaders();
    return await ensureUserQuery(queryClient, userId);
  },
  component: () => {
    const navigate = useNavigate();
    const userId = useAuthUserIdFromHeaders();
    const { data: user } = useUserSuspenseQuery(userId);
    const mutation = useUserUpdateMutation({ userId });
    const [pronouns, setPronouns] = useState(user?.pronouns ?? '');
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      mutation.mutate({ pronouns }, { onSuccess: () => setTimeout(() => navigate({ to: '/onboarding/bday' }), 500) });
    };
    return <OnboardingWrapper currentStep="pronouns" className="block">
      <div className="flex items-center justify-between">
        <Link className="hover:bg-muted rounded-lg p-2" to="/onboarding/name">
          <span className="sr-only">Back to previous step</span>
          <LucideChevronLeft className="size-5"/>
        </Link>
        <div/>
        <Link to="/onboarding/bday">Skip</Link>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mt-16 justify-between">
        <div className="w-full">
          <h1 className="text-2xl text-center">What's are your pronouns?</h1>
          <p className="mt-4 text-muted-foreground text-center">Specifying your pronouns helps Sam tu actually understand your identity.</p>
          <TextField inputClassName="text-xl text-center" value={pronouns} onChange={setPronouns} className="mt-8" aria-label="Name" />
        </div>
        <Button type="submit" className="absolute left-0 right-0 bottom-4">Continue</Button>
      </form>
    </OnboardingWrapper>
  }
});
