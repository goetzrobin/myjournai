import { createFileRoute } from '@tanstack/react-router';
import OnboardingWrapper from './-components/-onboarding-wrapper';

export const Route = createFileRoute('/_app/onboarding/start')({
  component: () => <OnboardingWrapper currentStep="start" link={{to: '/onboarding/meet-sam', label: 'Let\'s get started'}}>
    <h1 className="-mt-20 place-self-center text-2xl text-center">Begin your <span className="font-bold tracking-tight">journai</span><br/> to life after athletics.</h1>
  </OnboardingWrapper>
});
