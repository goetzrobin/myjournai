import { createFileRoute } from '@tanstack/react-router';
import OnboardingWrapper from './-components/-onboarding-wrapper';

export const Route = createFileRoute('/_app/onboarding/meet-sam')({
  component: () => <OnboardingWrapper currentStep="meet-sam" link={{ to: '/onboarding/name', label: 'Continue' }}>
    <div className="-mt-20 place-self-center">
      <h1 className="text-2xl text-center">Meet Sam, your AI mentor that helps you find your
        path.</h1>
      <p className="mt-4 text-muted-foreground text-center">Sam learns from every conversation and is backed by a team of former
        athletes, psychologists, and researchers to help you live a fulfilled life after college.</p>
    </div>
  </OnboardingWrapper>
});
