import { createFileRoute } from '@tanstack/react-router';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import OnboardingSurveyWrapper from '../../../onboarding/-components/-onboarding-survey-wrapper';
import SavingCidiData from '../../../onboarding/-components/-saving-cidi-data';
import { LikertScaleSlider } from '../../../onboarding/-components/-likert-scale-slider';
import React from 'react';
import {
  buildCreateUserCidiResponseRequest,
  useCidiDataMutation,
  useCidiPostPastCareerExplorationBreadthSelfAnswers,
  useCidiPostPastCareerExplorationBreadthSelfCanMoveToNextQuestion,
  useCidiPostPastCareerExplorationBreadthSelfCurrentAnswer,
  useCidiPostPastCareerExplorationBreadthSelfCurrentProgress,
  useCidiPostPastCareerExplorationBreadthSelfCurrentQuestion,
  useCidiPostPastCareerExplorationBreadthSelfIsFinalQuestion,
  useCidiPostPastCareerExplorationBreadthSelfQuestionCount,
  useCidiPostPastCareerExplorationBreadthSelfSurveyActions
} from '~myjournai/cidi-client';

export const Route = createFileRoute('/_app/offboarding/study/past-career-exploration-breadth-self/survey')({
  component: PastCareerCommitmentQuality
});

function PastCareerCommitmentQuality() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useCidiPostPastCareerExplorationBreadthSelfSurveyActions();
  const questionCount = useCidiPostPastCareerExplorationBreadthSelfQuestionCount();
  const isFinalQuestion = useCidiPostPastCareerExplorationBreadthSelfIsFinalQuestion();
  const stepProgress = useCidiPostPastCareerExplorationBreadthSelfCurrentProgress();
  const currentQuestion = useCidiPostPastCareerExplorationBreadthSelfCurrentQuestion();
  const currentAnswer = useCidiPostPastCareerExplorationBreadthSelfCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useCidiPostPastCareerExplorationBreadthSelfCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useCidiPostPastCareerExplorationBreadthSelfAnswers();
  const cidiMutation = useCidiDataMutation({ userId, scope: 'post' });
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
      to="/offboarding/study/career-commitment-quality/survey"
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
