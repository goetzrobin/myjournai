import { createFileRoute, redirect } from '@tanstack/react-router';
import OnboardingWrapper from './-components/-onboarding-wrapper';
import { parseLastStepFromLocalStorage } from '~myjournai/onboarding-client';

export const Route = createFileRoute('/_app/onboarding/')({
  loader: () => {
    const lastStep = parseLastStepFromLocalStorage();
    if (!location.pathname.startsWith('/onboarding/start') && lastStep === 'start') {
      throw redirect({
        to: '/onboarding/start'
      });
    }
  },
  component: () => {
    const lastStep = parseLastStepFromLocalStorage();
    return <OnboardingWrapper link={{ to: lastStep, label: 'Continue where you left off' }}>
      <div className="-mt-20 place-self-center">
        <h1 className="text-2xl text-center">Let's finish your onboarding!</h1>
        <p className="mt-4 text-muted-foreground text-center">Seems like we didn't have enough time to get through
          everything last time! But worry not, you can pick up right where you left off!</p>
      </div>
    </OnboardingWrapper>;
  }
});
