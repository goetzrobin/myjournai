import { createFileRoute } from '@tanstack/react-router';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import OnboardingSurveyWrapper from '../../-components/-onboarding-survey-wrapper';
import SavingCidiData from '../../-components/-saving-cidi-data';
import { LikertScaleSlider } from '../../-components/-likert-scale-slider';
import React from 'react';
import {
  buildCreateUserCidiResponseRequest, useCidiDataMutation,
  useCidiPrePastCareerExplorationBreadthSelfAnswers,
  useCidiPrePastCareerExplorationBreadthSelfCanMoveToNextQuestion,
  useCidiPrePastCareerExplorationBreadthSelfCurrentAnswer,
  useCidiPrePastCareerExplorationBreadthSelfCurrentProgress,
  useCidiPrePastCareerExplorationBreadthSelfCurrentQuestion,
  useCidiPrePastCareerExplorationBreadthSelfIsFinalQuestion,
  useCidiPrePastCareerExplorationBreadthSelfQuestionCount,
  useCidiPrePastCareerExplorationBreadthSelfSurveyActions
} from '~myjournai/cidi-client';

export const Route = createFileRoute('/_app/onboarding/study/past-career-exploration-breadth-self/survey')({
  component: PastCareerCommitmentQuality
});

function PastCareerCommitmentQuality() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useCidiPrePastCareerExplorationBreadthSelfSurveyActions();
  const questionCount = useCidiPrePastCareerExplorationBreadthSelfQuestionCount();
  const isFinalQuestion = useCidiPrePastCareerExplorationBreadthSelfIsFinalQuestion();
  const stepProgress = useCidiPrePastCareerExplorationBreadthSelfCurrentProgress();
  const currentQuestion = useCidiPrePastCareerExplorationBreadthSelfCurrentQuestion();
  const currentAnswer = useCidiPrePastCareerExplorationBreadthSelfCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useCidiPrePastCareerExplorationBreadthSelfCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useCidiPrePastCareerExplorationBreadthSelfAnswers();
  const cidiMutation = useCidiDataMutation({ userId });
  const updateCidiData = () => {
    if (!userId) return;
    cidiMutation.mutate(buildCreateUserCidiResponseRequest('question4', answers, userId));
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
      title="Career Commitment Quality"
      description="4 questions"
      to="/onboarding/study/career-commitment-quality/survey"
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
