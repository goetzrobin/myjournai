import { createFileRoute, Link } from '@tanstack/react-router';
import OnboardingWrapper from './-components/-onboarding-wrapper';
import { Button } from '~myjournai/components';

export const Route = createFileRoute('/_app/onboarding/survey-intro')({
  component: () => {
    return <OnboardingWrapper currentStep="survey-intro">
      <div className="place-self-center w-full">
        <h1 className="text-2xl text-center">Let's start with a quick survey</h1>
        <p className="mt-4 text-muted-foreground text-center">As part of our research with Temple we are collecting
          anonymized demographic and career readiness data. The following survey will be shared with our research
          partners Drs.
          Elizabeth Taylor and Jessica Brougham.</p>
      </div>
      <Link className="absolute left-0 right-0 bottom-4" to="/onboarding/study/user">
        <Button className="w-full">Continue to Survey</Button>
      </Link>
    </OnboardingWrapper>
  }
});
