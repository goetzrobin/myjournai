import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '~myjournai/components';
import OnboardingWrapper from '../-components/-onboarding-wrapper';

export const Route = createFileRoute('/_app/onboarding/study/complete')({
  component: Complete
});

function Complete() {
  return <OnboardingWrapper currentStep="one-more-thing">
    <div className="place-self-center w-full">
      <h1 className="text-2xl text-center">Survey Complete!</h1>
      <p className="mt-4 text-muted-foreground text-center">Thanks so much for answering all these questions! This data
        will help our researchers and Sam to provide an experience for you that's truly valuable! Talking about your experience... Are you ready to get started with your journai?</p>
    </div>
    <Link className="absolute left-0 right-0 bottom-4" to="/onboarding/one-more-thing">
      <Button className="w-full">Let's do it!</Button>
    </Link>
  </OnboardingWrapper>;
}
