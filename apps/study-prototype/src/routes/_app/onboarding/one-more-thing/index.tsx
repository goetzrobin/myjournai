import { createFileRoute, useNavigate } from '@tanstack/react-router';
import OnboardingWrapper from '../-components/-onboarding-wrapper';
import { useUserQuery } from '@myjournai/user-client';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import { Button } from '~myjournai/components';
import React, { useState } from 'react';
import { Letter } from './-components/-letter';
import { useOnboardingLetterMutation, useOnboardingLetterQuery } from '~myjournai/onboarding-client';


export const Route = createFileRoute('/_app/onboarding/one-more-thing/')({
  component: OneMoreThing,
});

function OneMoreThing() {
  const navigate = useNavigate();
  const userId = useAuthUserIdFromHeaders();

  const userName = useUserQuery(userId).data?.name;

  const [writingLetter, setWritingLetter] = useState(false);
  const [letterContent, setLetterContent] = useState('');
  const letterLength = letterContent.trim().length;

  const existingLetter = useOnboardingLetterQuery(userId).data?.content;
  const hasExistingLetterContent = (existingLetter?.length ?? 0) > 0;
  const onboardingLetterMut = useOnboardingLetterMutation(userId);
  const navAway = () => navigate({ to: '/onboarding/final-convo' });
  const onStartJournaiPress = () => {
    if (!userId) return;
    onboardingLetterMut.mutate({
      userId: userId,
      content: letterContent
    }, {
      onSuccess: navAway
    });
  };
  const onContinuePress = () => {
    if (!userId || !hasExistingLetterContent) return;
    onboardingLetterMut.mutate({
      userId: userId,
      content: existingLetter
    }, {
      onSuccess: navAway
    });
  };
  return <OnboardingWrapper currentStep="one-more-thing">
    <div className="-mt-60 h-fit place-self-center w-full">
      {!writingLetter ? null :
        <Button onPress={() => setWritingLetter(false)} variant="secondary"
                className="animate-in fade-in absolute top-4 right-4">Done</Button>}
      <h1 className="text-2xl text-center">One more thing</h1>
      <p className="mt-4 mb-20 text-muted-foreground text-center">We want to learn about you! Help Sam get to know you
        by writing a short letter.</p>

      <div
        className={(writingLetter ? '!scale-100 max-w-none !rotate-0 !translate-y-10' : '') + ' top-10 translate-y-40 absolute flex items-center justify-center left-0 right-0 h-full origin-center transition-transform scale-50 rotate-[-10deg]'}>
        {writingLetter ? <Letter letterContent={letterContent} setLetterContent={setLetterContent} name={userName} /> :
          <Button isDisabled={writingLetter || hasExistingLetterContent} onPress={() => setWritingLetter(p => !p)}
                  variant="secondary"
                  className="isolate overflow-hidden relative text-left animate-in zoom-in-50 fade-in-0 flex items-start p-8 w-full text-xl h-[70vh] pressed:!bg-muted !bg-background text-muted-foreground border border-border/80 rounded-xl">
            <div className="inset-0 bg-muted/10 h-full w-full absolute -z-10" />
            {letterLength > 0 ? letterContent : (hasExistingLetterContent ? existingLetter : `${userName}, introduce yourself...`)}
            <span
              className="absolute left-0 right-0 w-full bottom-0 h-8 bg-gradient-to-b to-background from-transparent" />
          </Button>}
      </div>
    </div>
    {writingLetter || hasExistingLetterContent ? null :
      <Button onPress={onStartJournaiPress} isDisabled={writingLetter || letterLength === 0}
              className="animate-in fade-in absolute bottom-4 left-0 right-0">Start your journai</Button>}
    {!hasExistingLetterContent ? null :
      <Button onPress={onContinuePress}
              className="animate-in fade-in absolute bottom-4 left-0 right-0">Continue</Button>}
  </OnboardingWrapper>;
}
