import { createFileRoute } from '@tanstack/react-router';
import {
  buildCreateUserCidiResponseRequest,
  useOnbCidiCareerCommitmentQualityAnswers,
  useOnbCidiCareerCommitmentQualityCanMoveToNextQuestion,
  useOnbCidiCareerCommitmentQualityCurrentAnswer,
  useOnbCidiCareerCommitmentQualityCurrentProgress,
  useOnbCidiCareerCommitmentQualityCurrentQuestion,
  useOnbCidiCareerCommitmentQualityIsFinalQuestion,
  useOnbCidiCareerCommitmentQualityQuestionCount,
  useOnbCidiCareerCommitmentQualitySurveyActions,
  useOnboardingCidiDataMutation
} from '~myjournai/onboarding-client';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import OnboardingSurveyWrapper from '../../-components/-onboarding-survey-wrapper';
import SavingCidiData from '../../-components/-saving-cidi-data';
import { LikertScaleSlider } from '../../-components/-likert-scale-slider';
import React from 'react';

export const Route = createFileRoute('/_app/onboarding/study/career-commitment-quality/survey')({
  component: CareerComittmentQuality
});

function CareerComittmentQuality() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useOnbCidiCareerCommitmentQualitySurveyActions();
  const questionCount = useOnbCidiCareerCommitmentQualityQuestionCount();
  const isFinalQuestion = useOnbCidiCareerCommitmentQualityIsFinalQuestion();
  const stepProgress = useOnbCidiCareerCommitmentQualityCurrentProgress();
  const currentQuestion = useOnbCidiCareerCommitmentQualityCurrentQuestion();
  const currentAnswer = useOnbCidiCareerCommitmentQualityCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useOnbCidiCareerCommitmentQualityCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useOnbCidiCareerCommitmentQualityAnswers();
  const cidiMutation = useOnboardingCidiDataMutation(userId);
  const updateCidiData = () => {
    if (!userId) return;
    cidiMutation.mutate(buildCreateUserCidiResponseRequest('question5', answers, userId));
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
      hideNextSection={true}
      title="And that's a wrap!"
      description="Your responses have been stored!"
      to="/onboarding/study/complete"
      label="Finish Survey"
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
