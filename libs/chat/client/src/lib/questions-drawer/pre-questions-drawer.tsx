import React, { Dispatch, SetStateAction } from 'react';
import QuestionsDrawer, { QuestionDrawerScores } from './questions-drawer';
import { SmoothButton } from '~myjournai/components';
import { useNavigate } from '@tanstack/react-router';
import { LucideLoader } from 'lucide-react';

export const PreQuestionsDrawer = ({ onStartClicked, open, setOpen, status }: {
  status: 'idle' | 'pending' | 'success' | 'error';
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  onStartClicked: (scores: QuestionDrawerScores) => void
}) => {
  const navigate = useNavigate();
  return (
    <QuestionsDrawer
      open={open}
      setOpen={setOpen}
      onClosePressed={() => navigate({ to: '/' })} title="Let's get started"
                     renderFinalStep={({ anxietyScore, motivationScore, feelingScore }) => {
                       const onButtonClicked = () => {
                         if (anxietyScore === undefined || motivationScore === undefined || feelingScore === undefined) return;
                         onStartClicked({ anxietyScore, motivationScore, feelingScore });
                       };
                       return <div className="pt-4">
                         <h3 className="pb-4 uppercase tracking-tight font-semibold">Thanks for sharing!</h3>
                         <p className="text-muted-foreground mb-8">Let's start today's session! Sam's already waiting
                           for you!</p>
                         <SmoothButton onPress={onButtonClicked} className="mt-8" buttonState={status}>
                           {status !== 'idle' ? null : 'Start session'}
                           {status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
                           {status !== 'success' ? null : 'Let\'s go'}
                           {status !== 'error' ? null : 'Something went wrong... Try again!'}
                         </SmoothButton>
                       </div>;
                     }} />
  );
};
