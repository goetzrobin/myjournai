import { createFileRoute } from '@tanstack/react-router';

import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import OnboardingSurveyWrapper from '../../../onboarding/-components/-onboarding-survey-wrapper';
import SavingCidiData from '../../../onboarding/-components/-saving-cidi-data';
import { LikertScaleSlider } from '../../../onboarding/-components/-likert-scale-slider';
import React from 'react';
import {
  buildCreateUserCidiResponseRequest,
  useCidiDataMutation,
  useCidiPostCareerExplorationBreadthSelfAnswers,
  useCidiPostCareerExplorationBreadthSelfCanMoveToNextQuestion,
  useCidiPostCareerExplorationBreadthSelfCurrentAnswer,
  useCidiPostCareerExplorationBreadthSelfCurrentProgress,
  useCidiPostCareerExplorationBreadthSelfCurrentQuestion,
  useCidiPostCareerExplorationBreadthSelfIsFinalQuestion,
  useCidiPostCareerExplorationBreadthSelfQuestionCount,
  useCidiPostCareerExplorationBreadthSelfSurveyActions
} from '~myjournai/cidi-client';

export const Route = createFileRoute('/_app/offboarding/study/career-exploration-breadth-self/survey')({
  component: CareerExplorationBreadthSelf
});

function CareerExplorationBreadthSelf() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useCidiPostCareerExplorationBreadthSelfSurveyActions();
  const questionCount = useCidiPostCareerExplorationBreadthSelfQuestionCount();
  const isFinalQuestion = useCidiPostCareerExplorationBreadthSelfIsFinalQuestion();
  const stepProgress = useCidiPostCareerExplorationBreadthSelfCurrentProgress();
  const currentQuestion = useCidiPostCareerExplorationBreadthSelfCurrentQuestion();
  const currentAnswer = useCidiPostCareerExplorationBreadthSelfCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useCidiPostCareerExplorationBreadthSelfCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useCidiPostCareerExplorationBreadthSelfAnswers();
  const cidiMutation = useCidiDataMutation({ userId, scope: 'post' });
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
      description="4 questions"
      to="/offboarding/study/career-exploration-depth-self/survey"
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
