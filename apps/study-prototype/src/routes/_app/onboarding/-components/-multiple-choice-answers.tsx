import React, { Fragment } from 'react';
import { ToggleButton } from '~myjournai/components';
import { OtherToggleButtonAndInput } from './-other-toggle-button-and-input';
import { OnboardingActualAnswer, OnboardingPossibleAnswer, OnboardingQuestion } from '~myjournai/onboarding-client';

const MultipleChoiceAnswers = ({ currentQuestion, currentAnswer, answerCurrentQuestion }: {
  currentQuestion: OnboardingQuestion,
  currentAnswer?: OnboardingActualAnswer,
  answerCurrentQuestion: (answer: OnboardingPossibleAnswer, customValue?: string | number) => void
}) => {
  return <div className="mt-8 space-y-4">
    {(currentQuestion.possibleAnswers ?? []).map(answer =>
      <Fragment key={`${currentQuestion.index}-${answer.value}`}>
        {answer.type !== 'fixed' ? null :
          <ToggleButton className="w-full text-left" isSelected={currentAnswer?.value === answer.value}
                        onPress={() => answerCurrentQuestion(answer)}>{answer.label}</ToggleButton>}
        {answer.type !== 'custom' ? null :
          <OtherToggleButtonAndInput label={answer.label}
                                     possibleAnswerValue={answer.value}
                                     currentAnswerValue={currentAnswer?.value}
                                     currentAnswerCustomValue={currentAnswer?.customValue}
                                     onPressAndInput={v => answerCurrentQuestion(answer, v)} />}
      </Fragment>
    )}
  </div>
};

export default MultipleChoiceAnswers;
