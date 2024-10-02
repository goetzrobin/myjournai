import { createFileRoute } from '@tanstack/react-router';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import OnboardingSurveyWrapper from '../../../onboarding/-components/-onboarding-survey-wrapper';
import SavingCidiData from '../../../onboarding/-components/-saving-cidi-data';
import { LikertScaleSlider } from '../../../onboarding/-components/-likert-scale-slider';
import React from 'react';
import {
  buildCreateUserCidiResponseRequest,
  useCidiDataMutation,
  useCidiPostCareerCommitmentQualityAnswers,
  useCidiPostCareerCommitmentQualityCanMoveToNextQuestion,
  useCidiPostCareerCommitmentQualityCurrentAnswer,
  useCidiPostCareerCommitmentQualityCurrentProgress,
  useCidiPostCareerCommitmentQualityCurrentQuestion,
  useCidiPostCareerCommitmentQualityIsFinalQuestion,
  useCidiPostCareerCommitmentQualityQuestionCount,
  useCidiPostCareerCommitmentQualitySurveyActions
} from '~myjournai/cidi-client';

export const Route = createFileRoute('/_app/offboarding/study/career-commitment-quality/survey')({
  component: CareerComittmentQuality
});

function CareerComittmentQuality() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useCidiPostCareerCommitmentQualitySurveyActions();
  const questionCount = useCidiPostCareerCommitmentQualityQuestionCount();
  const isFinalQuestion = useCidiPostCareerCommitmentQualityIsFinalQuestion();
  const stepProgress = useCidiPostCareerCommitmentQualityCurrentProgress();
  const currentQuestion = useCidiPostCareerCommitmentQualityCurrentQuestion();
  const currentAnswer = useCidiPostCareerCommitmentQualityCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useCidiPostCareerCommitmentQualityCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useCidiPostCareerCommitmentQualityAnswers();
  const cidiMutation = useCidiDataMutation({ userId, scope: 'post' });
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
      to="/offboarding/study/complete"
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
