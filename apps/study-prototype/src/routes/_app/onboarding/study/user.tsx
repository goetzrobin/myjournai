import { createFileRoute } from '@tanstack/react-router';
import MultipleChoiceAnswers from '../-components/-multiple-choice-answers';
import { GradYearField } from '../-components/-grad-year-field';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import {
  useOnboardingAnswers,
  useOnboardingCanMoveToNextQuestion,
  useOnboardingCurrentAnswer,
  useOnboardingCurrentProgress,
  useOnboardingCurrentQuestion,
  useOnboardingIsFinalQuestion,
  useOnboardingSurveyActions,
  useOnboardingUserDataMutation
} from '~myjournai/onboarding-client';
import OnboardingSurveyWrapper from '../-components/-onboarding-survey-wrapper';
import SavingUserData from '../-components/-saving-user-data';
import { SurveyActualAnswer } from '~myjournai/survey';
import { useEffect } from 'react';


export const Route = createFileRoute('/_app/onboarding/study/user')({
  component: Onboarding
});

const buildUserOnboardingRequest = (answers: (SurveyActualAnswer | undefined)[]) => {
  const keys = ['cohort', 'genderIdentity', 'ethnicity', 'competitionLevel', 'ncaaDivision', 'graduationYear'];
  let result = {};
  console.log(answers)
  keys.forEach((key, index) => {
    const answer = answers[index];
    result = { ...result, [key]: answer?.type === 'fixed' ? answer.value : answer?.customValue };
  });
  return result;
}

function Onboarding() {
  const userId = useAuthUserIdFromHeaders();

  const { moveToPreviousQuestion, moveToNextQuestion, answerCurrentQuestion } = useOnboardingSurveyActions();
  const stepProgress = useOnboardingCurrentProgress();
  const currentQuestion = useOnboardingCurrentQuestion();
  const currentAnswer = useOnboardingCurrentAnswer();
  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useOnboardingCanMoveToNextQuestion();
  const isFinalQuestion = useOnboardingIsFinalQuestion();
  const answers = useOnboardingAnswers();

  const onboardingUserDataMut = useOnboardingUserDataMutation({ userId });

  const updateUserWithOnboardingData = () => {
    const result = buildUserOnboardingRequest(answers);
    if (!userId) {
      console.error('need userId to be able to update survey data');
      return;
    }
    onboardingUserDataMut.mutate(result);
  };

  const onMoveToNextQuestionPressed = () => isFinalQuestion ? updateUserWithOnboardingData() : moveToNextQuestion();

  useEffect(() => {
    if (currentQuestion.type !== 'number') return;
    answerCurrentQuestion(currentQuestion.possibleAnswers[0], 2025)
  }, [currentQuestion.type]);
  return <OnboardingSurveyWrapper
    onMoveToNextQuestionPressed={onMoveToNextQuestionPressed}
    moveToPreviousQuestion={moveToPreviousQuestion}
    isFirstQuestion={firstQuestion}
    canMoveToNextQuestion={canMoveToNextQuestion}
    stepProgress={stepProgress}
  >
    <SavingUserData status={onboardingUserDataMut.status} />
    <p className="text-xl">{currentQuestion.question}</p>
    {currentQuestion.type !== 'multiple-choice' ? null :
      <MultipleChoiceAnswers currentQuestion={currentQuestion} currentAnswer={currentAnswer}
                             answerCurrentQuestion={answerCurrentQuestion} />}
    {currentQuestion.type !== 'number' ? null :
      <GradYearField label="Graduation Year"
                     value={typeof currentAnswer?.customValue === 'number' ? currentAnswer.customValue : undefined}
        // can select first one, because only one possible answer
                     onChange={value => answerCurrentQuestion(currentQuestion.possibleAnswers[0], value)}
                     className="mt-10" />
    }
  </OnboardingSurveyWrapper>;
}
