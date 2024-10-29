import { createFileRoute } from '@tanstack/react-router';

import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import OnboardingSurveyWrapper from '../../-components/-onboarding-survey-wrapper';
import SavingCidiData from '../../-components/-saving-cidi-data';
import { LikertScaleSlider } from '../../-components/-likert-scale-slider';
import React from 'react';
import {
  buildCreateUserCidiResponseRequest,
  useCidiDataMutation,
  useCidiPreCareerExplorationBreadthSelfAnswers,
  useCidiPreCareerExplorationBreadthSelfCanMoveToNextQuestion,
  useCidiPreCareerExplorationBreadthSelfCurrentAnswer,
  useCidiPreCareerExplorationBreadthSelfCurrentProgress,
  useCidiPreCareerExplorationBreadthSelfCurrentQuestion,
  useCidiPreCareerExplorationBreadthSelfIsFinalQuestion,
  useCidiPreCareerExplorationBreadthSelfQuestionCount,
  useCidiPreCareerExplorationBreadthSelfSurveyActions
} from '~myjournai/cidi-client';

export const Route = createFileRoute('/_app/onboarding/study/career-exploration-breadth-self/survey')({
  component: CareerExplorationBreadthSelf
});

function CareerExplorationBreadthSelf() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useCidiPreCareerExplorationBreadthSelfSurveyActions();
  const questionCount = useCidiPreCareerExplorationBreadthSelfQuestionCount();
  const isFinalQuestion = useCidiPreCareerExplorationBreadthSelfIsFinalQuestion();
  const stepProgress = useCidiPreCareerExplorationBreadthSelfCurrentProgress();
  const currentQuestion = useCidiPreCareerExplorationBreadthSelfCurrentQuestion();
  const currentAnswer = useCidiPreCareerExplorationBreadthSelfCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useCidiPreCareerExplorationBreadthSelfCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useCidiPreCareerExplorationBreadthSelfAnswers();
  const cidiMutation = useCidiDataMutation({ userId });
  const updateCidiData = () => {
    if (!userId) return;
    cidiMutation.mutate(buildCreateUserCidiResponseRequest('question2', answers, userId));
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
      title="Career Exploration in Depth"
      frameUp="These next few questions ask you to reflect on yourself and your actions as it relates to your career exploration."
      description="4 questions"
      to="/onboarding/study/career-exploration-depth-self/survey"
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
