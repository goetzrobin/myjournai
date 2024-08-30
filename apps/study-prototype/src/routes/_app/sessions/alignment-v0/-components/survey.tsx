import React from 'react';
import { Button } from '~myjournai/components';
import { MotivationIndicator } from './motivation-indicator';
import { AnxietyIndicator } from './anxiety-indicator';
import { FeelingIndicator } from './feeling-indicator';

export const Survey = ({
                         view,
                         setView,
                         onStart,
                         preFeelingScore,
                         preMotivationScore,
                         preAnxietyScore,
                         setPreMotivationScore,
                         setPreAnxietyScore,
                         setPreFeelingScore
                       }: {
  view: string
  setView: (vie: string) => void;
  preAnxietyScore: number | undefined;
  preFeelingScore: number | undefined;
  preMotivationScore: number | undefined;
  setPreFeelingScore: (value: number) => void;
  setPreMotivationScore: (value: number) => void;
  setPreAnxietyScore: (value: number) => void;
  onStart: (values: {
    preAnxietyScore: number
    preFeelingScore: number
    preMotivationScore: number
  }) => void
}) => {

  const onStartClicked = () => {
    console.log('yooooo', preAnxietyScore,
      preFeelingScore,
      preMotivationScore);
    if (preAnxietyScore === undefined || preFeelingScore === undefined || preMotivationScore === undefined) return;
    onStart({
      preAnxietyScore,
      preFeelingScore,
      preMotivationScore
    });
  };

  switch (view) {
    case 'feeling':
      return <><FeelingIndicator value={preFeelingScore} setValue={setPreFeelingScore}
                                 onNextClick={() => setView('motivation')} />
        <pre>{preAnxietyScore + ';' +
          preFeelingScore + ';' +
          preMotivationScore}</pre>
      </>;
    case 'motivation':
      return <><MotivationIndicator value={preMotivationScore} setValue={setPreMotivationScore}
                                    onNextClick={() => setView('anxiety')} />;
        <pre>{preAnxietyScore + ';' +
          preFeelingScore + ';' +
          preMotivationScore}</pre>;
      </>
        ;
    case 'anxiety':
      return <><AnxietyIndicator value={preAnxietyScore} setValue={setPreAnxietyScore}
                                 onNextClick={() => setView('start')} />
        <pre>{preAnxietyScore + ';' +
          preFeelingScore + ';' +
          preMotivationScore}</pre>
      </>;
    case 'start':
      return <div className="pt-4">
        <h3 className="pb-4 uppercase tracking-tight font-semibold">Thanks for sharing!</h3>
        <p className="text-muted-foreground mb-8">Let's start today's session! Sam's already waiting for you!</p>
        <pre>{preAnxietyScore + ';' +
          preFeelingScore + ';' +
          preMotivationScore}</pre>
        <Button
          className="w-full"
          onPress={onStartClicked}>Start Session</Button></div>;
  }
};
