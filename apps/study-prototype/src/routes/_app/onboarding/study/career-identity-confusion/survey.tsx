import { createFileRoute } from '@tanstack/react-router';
import OnboardingSurveyWrapper from '../../-components/-onboarding-survey-wrapper';
import { LikertScaleSlider } from '../../-components/-likert-scale-slider';
import {
  buildCreateUserCidiResponseRequest,
  useOnbCidiCareerIdentityConfusionAnswers,
  useOnbCidiCareerIdentityConfusionCanMoveToNextQuestion,
  useOnbCidiCareerIdentityConfusionCurrentAnswer,
  useOnbCidiCareerIdentityConfusionCurrentProgress,
  useOnbCidiCareerIdentityConfusionCurrentQuestion,
  useOnbCidiCareerIdentityConfusionIsFinalQuestion,
  useOnbCidiCareerIdentityConfusionQuestionCount,
  useOnbCidiCareerIdentityConfusionSurveyActions,
  useOnboardingCidiDataMutation
} from '~myjournai/onboarding-client';
import SavingCidiData from '../../-components/-saving-cidi-data';
import { useAuthUserIdFromHeaders } from '@myjournai/auth-client';

export const Route = createFileRoute('/_app/onboarding/study/career-identity-confusion/survey')({
  component: CareerIdentityConfusion
});

function CareerIdentityConfusion() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useOnbCidiCareerIdentityConfusionSurveyActions();
  const questionCount = useOnbCidiCareerIdentityConfusionQuestionCount();
  const isFinalQuestion = useOnbCidiCareerIdentityConfusionIsFinalQuestion();
  const stepProgress = useOnbCidiCareerIdentityConfusionCurrentProgress();
  const currentQuestion = useOnbCidiCareerIdentityConfusionCurrentQuestion();
  const currentAnswer = useOnbCidiCareerIdentityConfusionCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useOnbCidiCareerIdentityConfusionCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useOnbCidiCareerIdentityConfusionAnswers();
  const cidiMutation = useOnboardingCidiDataMutation(userId);
  const updateCidiData = () => {
    if (!userId) return;
    cidiMutation.mutate(buildCreateUserCidiResponseRequest('question1', answers, userId));
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
      title="Career Exploration in Breadth"
      description="4 questions"
      to="/onboarding/study/career-exploration-breadth-self/survey"
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
