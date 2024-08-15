import React, { PropsWithChildren, ReactNode } from 'react';
import { Button, ProgressBar } from '~myjournai/components';
import { LucideArrowRight, LucideChevronLeft } from 'lucide-react';

const OnboardingSurveyWrapper = ({
                             children,
                             stepProgress,
                             isFirstQuestion,
                             moveToPreviousQuestion,
                             canMoveToNextQuestion,
                             onMoveToNextQuestionPressed,
                             progressDescription
                           }: PropsWithChildren<{
  moveToPreviousQuestion: () => void;
  onMoveToNextQuestionPressed: () => void;
  stepProgress: number;
  isFirstQuestion: boolean;
  canMoveToNextQuestion: boolean;
  progressDescription?: ReactNode
}>) => {
  return (
    <div className="isolate relative flex flex-col h-full pt-4">
      <ProgressBar aria-label={`Progress through onboarding: ${stepProgress}%`} className="w-full"
                   value={stepProgress} />
      <div className="mt-4 flex justify-between items-center">
        <Button isDisabled={isFirstQuestion} onPress={moveToPreviousQuestion}
                className={isFirstQuestion ? 'invisible' : ''}
                variant="icon">
          <LucideChevronLeft className="text-muted-foreground/60 size-7" />
          <span className="sr-only">Back to previous question</span>
        </Button>
        {progressDescription ? progressDescription : <div />}
        <div className="w-10" />
      </div>
      <div className="flex-1 flex flex-col pt-10 pb-[50%] px-2">
        {children}
      </div>
      <Button isDisabled={!canMoveToNextQuestion}
              onPress={onMoveToNextQuestionPressed} variant="primary"
              className="animate-in ease fade-in slide-in-from-bottom-2 absolute bottom-8 right-4 rounded-full size-12 p-0 grid">
        <LucideArrowRight className="self-center justify-self-center size-7" />
        <span className="sr-only">Move to next question</span>
      </Button>
    </div>
  );
};

export default OnboardingSurveyWrapper;
