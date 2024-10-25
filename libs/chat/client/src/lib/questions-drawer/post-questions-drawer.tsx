import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import QuestionsDrawer, { QuestionDrawerScores } from './questions-drawer';
import { SmoothButton } from '~myjournai/components';

export const PENDING_DESCRIPTIONS = [
  'Just a moment while we finish up...',
  'Summarizing key insights ...',
  'Gathering the key takeaways...',
  'Wrapping things up...',
  'Finalizing our conversation...'
];

const FinalStep = ({ status, onEndClicked, anxietyScore, motivationScore, feelingScore }: {
  status: 'idle' | 'pending' | 'success' | 'error';
  onEndClicked: (scores: QuestionDrawerScores) => void;
  anxietyScore: number | undefined
  motivationScore: number | undefined
  feelingScore: number | undefined
}) => {
  const intervalRef = useRef<any>(null);
  const [pendingIndex, setPendingIndex] = useState(0);
  const pendingDescription = PENDING_DESCRIPTIONS[pendingIndex % PENDING_DESCRIPTIONS.length];

  useEffect(() => {
    if (status === 'pending') {
      intervalRef.current = setInterval(() => {
        setPendingIndex((prev) => prev + 1);
      }, 2500 + (Math.random() * 500));
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPendingIndex(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [status]);

  const onButtonClicked = () => {
    if (anxietyScore === undefined || motivationScore === undefined || feelingScore === undefined) return;
    onEndClicked({ anxietyScore, motivationScore, feelingScore });
  };
  return <div className="pt-4">
    <h3 className="pb-4 uppercase tracking-tight font-semibold">One last thing!</h3>
    <p className="text-muted-foreground leading-loose mb-8">
      We would also love to hear how we did on this session! Please share your feedback in our <a
      className="text-base underline text-sky-500" target="_blank"
      href="https://groupme.com/join_group/103413656/KOdLSE1a" rel="noreferrer">GroupMe</a>
      {' '}or fill out our anonymous <a className="text-red-500 underline text-base"
                                        target="_blank" href="https://forms.gle/UycYw7ZgkjM9y9Sw8"
                                        rel="noreferrer">Google Forms survey!</a>
    </p>
    <SmoothButton onPress={onButtonClicked} className="w-full"
                  buttonState={(status === 'pending' ? status + pendingDescription : status) as any}>
      {status !== 'idle' ? null : 'End Session'}
      {status !== 'pending' ? null : pendingDescription}
      {status !== 'success' ? null : 'Answers stored!!'}
      {status !== 'error' ? null : 'Something went wrong... Try again!'}
    </SmoothButton>
  </div>;
};

export const PostQuestionsDrawer = ({ onEndClicked, open, setOpen, status }: {
  status: 'idle' | 'pending' | 'success' | 'error';
  onEndClicked: (scores: QuestionDrawerScores) => void;
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {


  console.log(status);

  return (
    <QuestionsDrawer open={open} setOpen={setOpen} title="Let's wrap this up"
                     renderFinalStep={({ anxietyScore, motivationScore, feelingScore }) => <FinalStep
                       status={status}
                       onEndClicked={onEndClicked}
                       anxietyScore={anxietyScore}
                       motivationScore={motivationScore}
                       feelingScore={feelingScore}
                     />} />
  );
};
