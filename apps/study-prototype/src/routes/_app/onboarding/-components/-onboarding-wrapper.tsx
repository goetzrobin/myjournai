import React, { PropsWithChildren, useEffect } from 'react';
import { Button } from '~myjournai/components';
import { Link } from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';
import { OnboardingStep, useOnboardingProgressActions } from '~myjournai/onboarding-client';

const OnboardingWrapper = ({ children, currentStep, className, link }: PropsWithChildren<{
  currentStep?: OnboardingStep,
  className?: string | null;
  link?: { to: string; label: string }
}>) => {
  const { setLastStep } = useOnboardingProgressActions();
  useEffect(() => {
    if (!currentStep) return;
    return setLastStep(currentStep);
  }, [currentStep, setLastStep]);
  return <div className="h-full w-full relative">
    <div className={twMerge('grid h-full w-full p-8', className)}>
      {children}
    </div>
    {!link ? null :
      <Link to={link.to}><Button className="absolute bottom-4 left-0 right-0 w-full">{link.label}</Button></Link>}
  </div>;
};

export default OnboardingWrapper;
