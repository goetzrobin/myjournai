import { createFileRoute } from '@tanstack/react-router';
import OnboardingSurveyWrapper from '../../../onboarding/-components/-onboarding-survey-wrapper';
import { LikertScaleSlider } from '../../../onboarding/-components/-likert-scale-slider';
import SavingCidiData from '../../../onboarding/-components/-saving-cidi-data';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import {
  buildCreateUserCidiResponseRequest,
  useCidiDataMutation,
  useCidiPostCareerIdentityConfusionAnswers,
  useCidiPostCareerIdentityConfusionCanMoveToNextQuestion,
  useCidiPostCareerIdentityConfusionCurrentAnswer,
  useCidiPostCareerIdentityConfusionCurrentProgress,
  useCidiPostCareerIdentityConfusionCurrentQuestion,
  useCidiPostCareerIdentityConfusionIsFinalQuestion,
  useCidiPostCareerIdentityConfusionQuestionCount,
  useCidiPostCareerIdentityConfusionSurveyActions
} from '~myjournai/cidi-client';

export const Route = createFileRoute('/_app/offboarding/study/career-identity-confusion/survey')({
  component: CareerIdentityConfusion
});

function CareerIdentityConfusion() {
  const {
    moveToNextQuestion,
    moveToPreviousQuestion,
    answerCurrentQuestion
  } = useCidiPostCareerIdentityConfusionSurveyActions();
  const questionCount = useCidiPostCareerIdentityConfusionQuestionCount();
  const isFinalQuestion = useCidiPostCareerIdentityConfusionIsFinalQuestion();
  const stepProgress = useCidiPostCareerIdentityConfusionCurrentProgress();
  const currentQuestion = useCidiPostCareerIdentityConfusionCurrentQuestion();
  const currentAnswer = useCidiPostCareerIdentityConfusionCurrentAnswer();

  const firstQuestion = currentQuestion.index === 0;
  const canMoveToNextQuestion = useCidiPostCareerIdentityConfusionCanMoveToNextQuestion();

  const userId = useAuthUserIdFromHeaders();
  const answers = useCidiPostCareerIdentityConfusionAnswers();
  const cidiMutation = useCidiDataMutation({ userId, scope: 'post' });
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
      frameUp="These next few questions ask you to reflect on yourself and your actions as it relates to your career exploration."
      to="/offboarding/study/career-exploration-breadth-self/survey"
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
