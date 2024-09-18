import { createFileRoute } from '@tanstack/react-router';
import {
  buildCreateUserCidiResponseRequest,
  useOnbCidiPastCareerExplorationBreadthSelfAnswers,
  useOnbCidiPastCareerExplorationBreadthSelfCanMoveToNextQuestion,
  useOnbCidiPastCareerExplorationBreadthSelfCurrentAnswer,
  useOnbCidiPastCareerExplorationBreadthSelfCurrentProgress,
  useOnbCidiPastCareerExplorationBreadthSelfCurrentQuestion,
  useOnbCidiPastCareerExplorationBreadthSelfIsFinalQuestion,
  useOnbCidiPastCareerExplorationBreadthSelfQuestionCount,
  useOnbCidiPastCareerExplorationBreadthSelfSurveyActions,
  useOnboardingCidiDataMutation
} from '~myjournai/onboarding-client';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import OnboardingSurveyWrapper from '../../-components/-onboarding-survey-wrapper';
import SavingCidiData from '../../-components/-saving-cidi-data';
import { LikertScaleSlider } from '../../-components/-likert-scale-slider';
import React from 'react';

export const Route = createFileRoute('/_app/onboarding/study/past-career-exploration-breadth-self/survey')({
  component: PastCareerCommitmentQuality
});

function PastCareerCommitmentQuality() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useOnbCidiPastCareerExplorationBreadthSelfSurveyActions();
  const questionCount = useOnbCidiPastCareerExplorationBreadthSelfQuestionCount();
  const isFinalQuestion = useOnbCidiPastCareerExplorationBreadthSelfIsFinalQuestion();
  const stepProgress = useOnbCidiPastCareerExplorationBreadthSelfCurrentProgress();
  const currentQuestion = useOnbCidiPastCareerExplorationBreadthSelfCurrentQuestion();
  const currentAnswer = useOnbCidiPastCareerExplorationBreadthSelfCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useOnbCidiPastCareerExplorationBreadthSelfCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useOnbCidiPastCareerExplorationBreadthSelfAnswers();
  const cidiMutation = useOnboardingCidiDataMutation(userId);
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
