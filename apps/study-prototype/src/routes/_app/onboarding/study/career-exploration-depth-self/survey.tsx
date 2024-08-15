import { createFileRoute } from '@tanstack/react-router';
import {
  buildCreateUserCidiResponseRequest,
  useOnbCidiCareerExplorationDepthSelfAnswers,
  useOnbCidiCareerExplorationDepthSelfCanMoveToNextQuestion,
  useOnbCidiCareerExplorationDepthSelfCurrentAnswer,
  useOnbCidiCareerExplorationDepthSelfCurrentProgress,
  useOnbCidiCareerExplorationDepthSelfCurrentQuestion,
  useOnbCidiCareerExplorationDepthSelfIsFinalQuestion,
  useOnbCidiCareerExplorationDepthSelfQuestionCount,
  useOnbCidiCareerExplorationDepthSelfSurveyActions,
  useOnboardingCidiDataMutation
} from '~myjournai/onboarding-client';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import OnboardingSurveyWrapper from '../../-components/-onboarding-survey-wrapper';
import SavingCidiData from '../../-components/-saving-cidi-data';
import { LikertScaleSlider } from '../../-components/-likert-scale-slider';
import React from 'react';

export const Route = createFileRoute('/_app/onboarding/study/career-exploration-depth-self/survey')({
  component: CareerExplorationDepthSelf
});

function CareerExplorationDepthSelf() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useOnbCidiCareerExplorationDepthSelfSurveyActions();
  const questionCount = useOnbCidiCareerExplorationDepthSelfQuestionCount();
  const isFinalQuestion = useOnbCidiCareerExplorationDepthSelfIsFinalQuestion();
  const stepProgress = useOnbCidiCareerExplorationDepthSelfCurrentProgress();
  const currentQuestion = useOnbCidiCareerExplorationDepthSelfCurrentQuestion();
  const currentAnswer = useOnbCidiCareerExplorationDepthSelfCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useOnbCidiCareerExplorationDepthSelfCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useOnbCidiCareerExplorationDepthSelfAnswers();
  const cidiMutation = useOnboardingCidiDataMutation(userId);
  const updateCidiData = () => {
    if (!userId) return;
    cidiMutation.mutate(buildCreateUserCidiResponseRequest('question3', answers, userId));
  };

  const onMoveToNextQuestionPressed = () => isFinalQuestion ? updateCidiData() : moveToNextQuestion();

  return <OnboardingSurveyWrapper
    onMoveToNextQuestionPressed={onMoveToNextQuestionPressed}
    moveToPreviousQuestion={moveToPreviousQuestion}
    isFirstQuestion={firstQuestion}
    canMoveToNextQuestion={canMoveToNextQuestion}
    stepProgress={stepProgress}
    progressDescription={<p
      className="font-medium text-muted-foreground">Question {currentQuestion.index + 1} of {questionCount}</p>}
  >
    <SavingCidiData
      title="Past Career Exploration in Breadth"
      description="2 questions"
      to="/onboarding/study/past-career-exploration-breadth-self/survey"
      label="Continue"
      isIdle={cidiMutation.isIdle}
    />
    <p className="flex-none text-xl">{currentQuestion.question}</p>
    <div className="flex-1" />
    <div className="flex-none px-4">
      <LikertScaleSlider value={currentAnswer?.value as number ?? 3}
                         onChange={v => answerCurrentQuestion(currentQuestion.possibleAnswers[v - 1])} />
    </div>
  </OnboardingSurveyWrapper>;
}
