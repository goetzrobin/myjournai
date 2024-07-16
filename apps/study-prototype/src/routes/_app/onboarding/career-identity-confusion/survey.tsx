import { createFileRoute, useNavigate } from '@tanstack/react-router';
import OnboardingWrapper from '../-components/-onboarding-wrapper';
import { LikertScaleSlider } from '../-components/-likert-scale-slider';
import {
  useOnbCidiAnswers,
  useOnbCidiCanMoveToNextQuestion, useOnbCidiCurrentAnswer, useOnbCidiCurrentProgress,
  useOnbCidiCurrentQuestion,
  useOnbCidiIsFinalQuestion, useOnbCidiQuestionCount,
  useOnbCidiSurveyActions
} from '~myjournai/onboarding-client';
import SavingCidiData from '../-components/-saving-cidi-data';
import React from 'react';
import {
  useOnboardingCidiDataMutation
} from '../../../../../../../libs/onboarding/client/src/lib/onboarding-cidi.mutation';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import { CreateUserCidiResponseRequest } from '~myjournai/onboarding-server';

export const Route = createFileRoute('/_app/onboarding/career-identity-confusion/survey')({
  component: CareerIdentityConfusion
});

// Strongly disagree, disagree, neither disagree nor agree, agree, strongly agree
function CareerIdentityConfusion() {
  const { moveToNextQuestion, moveToPreviousQuestion, answerCurrentQuestion } = useOnbCidiSurveyActions();
  const questionCount = useOnbCidiQuestionCount();
  const isFinalQuestion = useOnbCidiIsFinalQuestion();
  const stepProgress = useOnbCidiCurrentProgress();
  const currentQuestion = useOnbCidiCurrentQuestion();
  const currentAnswer = useOnbCidiCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useOnbCidiCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useOnbCidiAnswers();
  const cidiMutation = useOnboardingCidiDataMutation();
  const updateCidiData = () => {
    let answersReq = {};
    answers.forEach((a, i) => answersReq = ({ ...answersReq, ['question_1_' + i]: a.value }));
    if (!userId) return;
    const request: CreateUserCidiResponseRequest = {
      user_id: userId,
      ...answersReq
    };
    console.log(request)
    cidiMutation.mutate(request);
  };

  const onMoveToNextQuestionPressed = () => isFinalQuestion ? updateCidiData() : moveToNextQuestion();

  return <OnboardingWrapper
    onMoveToNextQuestionPressed={onMoveToNextQuestionPressed}
    moveToPreviousQuestion={moveToPreviousQuestion}
    isFirstQuestion={firstQuestion}
    canMoveToNextQuestion={canMoveToNextQuestion}
    stepProgress={stepProgress}
    progressDescription={<p
      className="font-medium text-muted-foreground">Question {currentQuestion.index + 1} of {questionCount}</p>}
  >
    <SavingCidiData isIdle={cidiMutation.isIdle} />
    <p className="flex-none text-xl">{currentQuestion.question}</p>
    <div className="flex-1" />
    <div className="flex-none px-4">
      <LikertScaleSlider value={currentAnswer?.value as number ?? 3}
                         onChange={v => answerCurrentQuestion(currentQuestion.possibleAnswers[v - 1])} />
    </div>
  </OnboardingWrapper>
    ;
}
