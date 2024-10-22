import React, { ReactNode } from 'react';
import { MotivationIndicator } from './motivation-indicator';
import { AnxietyIndicator } from './anxiety-indicator';
import { FeelingIndicator } from './feeling-indicator';

export type SurveyView = 'feeling' | 'motivation' | 'anxiety' | 'final';
export type SurveyResults = {
  anxietyScore: number | undefined
  feelingScore: number | undefined
  motivationScore: number | undefined
}
export const Survey = ({
                         view,
                         setView,
                         feelingScore,
                         motivationScore,
                         anxietyScore,
                         setMotivationScore,
                         setAnxietyScore,
                         setFeelingScore,
  renderFinalStep
                       }: {
  view: SurveyView
  setView: (view: SurveyView) => void;
  anxietyScore: number | undefined;
  feelingScore: number | undefined;
  motivationScore: number | undefined;
  setFeelingScore: (value: number) => void;
  setMotivationScore: (value: number) => void;
  setAnxietyScore: (value: number) => void;
  renderFinalStep: (values: SurveyResults) => ReactNode
}) => {
  switch (view) {
    case 'feeling':
      return <FeelingIndicator value={feelingScore} setValue={setFeelingScore}
                               onNextClick={() => setView('motivation')} />;
    case 'motivation':
      return <MotivationIndicator value={motivationScore} setValue={setMotivationScore}
                                  onNextClick={() => setView('anxiety')} />;

    case 'anxiety':
      return <AnxietyIndicator value={anxietyScore} setValue={setAnxietyScore}
                               onNextClick={() => setView('final')} />;
    case 'final':
      return renderFinalStep({anxietyScore, motivationScore, feelingScore});
  }
};
