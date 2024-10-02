import { createFileRoute } from '@tanstack/react-router';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import OnboardingSurveyWrapper from '../../../onboarding/-components/-onboarding-survey-wrapper';
import SavingCidiData from '../../../onboarding/-components/-saving-cidi-data';
import { LikertScaleSlider } from '../../../onboarding/-components/-likert-scale-slider';
import React from 'react';
import {
  buildCreateUserCidiResponseRequest,
  useCidiDataMutation,
  useCidiPostCareerExplorationDepthSelfAnswers,
  useCidiPostCareerExplorationDepthSelfCanMoveToNextQuestion,
  useCidiPostCareerExplorationDepthSelfCurrentAnswer,
  useCidiPostCareerExplorationDepthSelfCurrentProgress,
  useCidiPostCareerExplorationDepthSelfCurrentQuestion,
  useCidiPostCareerExplorationDepthSelfIsFinalQuestion,
  useCidiPostCareerExplorationDepthSelfQuestionCount,
  useCidiPostCareerExplorationDepthSelfSurveyActions
} from '~myjournai/cidi-client';

export const Route = createFileRoute('/_app/offboarding/study/career-exploration-depth-self/survey')({
  component: CareerExplorationDepthSelf
});

function CareerExplorationDepthSelf() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useCidiPostCareerExplorationDepthSelfSurveyActions();
  const questionCount = useCidiPostCareerExplorationDepthSelfQuestionCount();
  const isFinalQuestion = useCidiPostCareerExplorationDepthSelfIsFinalQuestion();
  const stepProgress = useCidiPostCareerExplorationDepthSelfCurrentProgress();
  const currentQuestion = useCidiPostCareerExplorationDepthSelfCurrentQuestion();
  const currentAnswer = useCidiPostCareerExplorationDepthSelfCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useCidiPostCareerExplorationDepthSelfCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useCidiPostCareerExplorationDepthSelfAnswers();
  const cidiMutation = useCidiDataMutation({ userId, scope: 'post' });
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
      to="/offboarding/study/past-career-exploration-breadth-self/survey"
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
