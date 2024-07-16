import { createFileRoute, useNavigate } from '@tanstack/react-router';
import MultipleChoiceAnswers from './-components/-multiple-choice-answers';
import { GradYearField } from './-components/-grad-year-field';
import SavingCidiData from './-components/-saving-cidi-data';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';
import {
  useOnboardingUserDataMutation, useOnboardingAnswers,
  useOnboardingCanMoveToNextQuestion,
  useOnboardingCurrentAnswer,
  useOnboardingCurrentProgress,
  useOnboardingCurrentQuestion, useOnboardingIsFinalQuestion,
  useOnboardingSurveyActions
} from '~myjournai/onboarding-client';
import OnboardingWrapper from './-components/-onboarding-wrapper';
import Welcome from './-components/-welcome';
import SavingUserData from './-components/-saving-user-data';


export const Route = createFileRoute('/_app/onboarding/user')({
  component: Onboarding
});

function Onboarding() {
  const navigate = useNavigate();
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
    const keys = ['cohort', 'gender_identity', 'ethnicity', 'ncaa_division', 'graduation_year'];
    let result = {};
    keys.forEach((key, index) => {
      const answer = answers[index];
      result = { ...result, [key]: answer.type === 'fixed' ? answer.value : answer.customValue };
    });
    if (!userId) {
      console.error('need userId to be able to update survey data');
      return;
    }
    onboardingUserDataMut.mutate(result, {
      onSuccess: () => setTimeout(() => navigate({ to: '/onboarding/career-identity-confusion/survey' }), 1000)
    });
  };

  const onMoveToNextQuestionPressed = () => isFinalQuestion ? updateUserWithOnboardingData() : moveToNextQuestion();


  return <OnboardingWrapper
    onMoveToNextQuestionPressed={onMoveToNextQuestionPressed}
    moveToPreviousQuestion={moveToPreviousQuestion}
    isFirstQuestion={firstQuestion}
    canMoveToNextQuestion={canMoveToNextQuestion}
    stepProgress={stepProgress}
  >
    <SavingUserData isIdle={onboardingUserDataMut.isIdle} />
    <Welcome />
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
  </OnboardingWrapper>;
}
