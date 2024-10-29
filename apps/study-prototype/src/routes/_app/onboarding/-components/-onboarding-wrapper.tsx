import React, { PropsWithChildren, useEffect } from 'react';
import { Button } from '~myjournai/components';
import { Link } from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';
import { OnboardingStep, useOnboardingProgressActions } from '~myjournai/onboarding-client';

const OnboardingWrapper = ({ children, currentStep, className, link, disabled }: PropsWithChildren<{
  currentStep?: OnboardingStep,
  className?: string | null;
  link?: { to: string; label: string },
  disabled?: boolean | null;
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
      <Link disabled={!!disabled} to={link.to}><Button isDisabled={!!disabled} className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-0 right-0 w-full">{link.label}</Button></Link>}
  </div>;
};

export default OnboardingWrapper;
