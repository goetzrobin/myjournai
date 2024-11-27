import { createFileRoute } from '@tanstack/react-router';
import OnboardingWrapper from './-components/-onboarding-wrapper';
import { Link } from '~myjournai/components';

export const Route = createFileRoute('/_app/onboarding/start')({
  component: () => {
    return <OnboardingWrapper currentStep="start" link={{to: '/onboarding/meet-sam', label: 'Let\'s get started'}}>
      <h1 className="-mt-20 place-self-center text-2xl text-center">One thing, before we begin your <span className="font-bold tracking-tight">journai</span><br/> to life after athletics.</h1>
      <p className="mt-4 text-muted-foreground text-center">We care about your well-being and want to make sure you're fully informed every step of the way.
        Your data is stored securely, according to our <Link to="/privacy-policy" className="text-base">privacy policy,</Link> and kept to ensure the best possible experience for you.</p>
    </OnboardingWrapper>
  }
});
