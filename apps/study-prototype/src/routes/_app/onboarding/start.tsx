import { createFileRoute } from '@tanstack/react-router';
import OnboardingWrapper from './-components/-onboarding-wrapper';
import { useState } from 'react';
import { Switch } from '~myjournai/components';

export const Route = createFileRoute('/_app/onboarding/start')({
  component: () => {
    const [isConsentGiven, setIsConsentGiven] = useState(false);
    return <OnboardingWrapper disabled={!isConsentGiven} currentStep="start" link={{to: '/onboarding/meet-sam', label: 'Let\'s get started'}}>
      <h1 className="-mt-20 place-self-center text-2xl text-center">One thing, before we begin your <span className="font-bold tracking-tight">journai</span><br/> to life after athletics.</h1>
      <p className="mt-4 text-muted-foreground text-center">We need your consent because we care about your well-being and want to make sure you're fully informed every step of the way.</p>
      <Switch className="absolute left-0 right-0 px-2 text-xs bottom-20 items-baseline" isSelected={isConsentGiven} onChange={setIsConsentGiven}>I consent to participate in this research study, understanding that my participation is voluntary, that I may withdraw at any time, and that my information will be kept confidential to the extent permitted by law.</Switch>
    </OnboardingWrapper>
  }
});
