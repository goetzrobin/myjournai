import React, { Dispatch, SetStateAction } from 'react';
import QuestionsDrawer, { QuestionDrawerScores } from './questions-drawer';
import { LucideLoader } from 'lucide-react';
import { SmoothButton } from '~myjournai/components';

export const PostQuestionsDrawer = ({ onEndClicked, open, setOpen, status }: {
  status: 'idle' | 'pending' | 'success' | 'error';
  onEndClicked: (scores: QuestionDrawerScores) => void;
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <QuestionsDrawer open={open} setOpen={setOpen} title="Let's wrap this up" renderFinalStep={({ anxietyScore, motivationScore, feelingScore }) => {
      const onButtonClicked = () => {
        if (anxietyScore === undefined || motivationScore === undefined || feelingScore === undefined) return;
        onEndClicked({ anxietyScore, motivationScore, feelingScore });
      };
      return <div className="pt-4">
        <h3 className="pb-4 uppercase tracking-tight font-semibold">Thanks for sharing!</h3>
        <p className="text-muted-foreground mb-8">Let's wrap this up</p>
        <SmoothButton onPress={onButtonClicked} className="w-full" buttonState={status}>
          {status !== 'idle' ? null : 'End Session'}
          {status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
          {status !== 'success' ? null : 'Answers stored!!'}
          {status !== 'error' ? null : 'Something went wrong... Try again!'}
        </SmoothButton>
       </div>;
    }} />
  );
};
