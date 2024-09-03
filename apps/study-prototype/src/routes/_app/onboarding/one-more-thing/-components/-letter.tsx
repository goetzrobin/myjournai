import React from 'react';
import { TextArea } from 'react-aria-components';

export const Letter = ({ letterContent, setLetterContent, name }: {
  letterContent: string,
  setLetterContent: (c: string) => void;
  name: string | null | undefined
}) => {
  const sentenceCount = ((letterContent ?? '').match(/\(?[^.?!\n]+[.!?\n]\)?/g) ?? []).length;
  const questions = [
    'What sport do you play?',
    'What achievement are you most proud of?',
    'What do you like doing in your downtime?',
    'What’s your favorite book, movie or TV show?',
    'What’s a goal you are working towards?',
    'What does a typical Sunday look like for you?',
    'Who’s someone you are close to?',
    'What is your dream job?',
    'What’s something you’ve always wanted to try?',
    'What’s one thing your friends love about you?',
    'If your life were to have a motto what would it be?',
    'If you could travel to any place in the world, where would it be?',
    'Who’s your best friend and why?',
    'What subject did you enjoy most in school?',
    'Do you have any siblings?',
    'In what ways are you similar to your parents?',
    'In what ways are you different from your parents?',
    'What’s your favorite cuisine?',
    'What’s an important belief that guides your choices?',
    'What, in life, do you want to be known for?',
    'What’s a value you hold that few others do?',
    'Thank you so much! You’ve answered all my questions, for now!'
  ];
  const currentQuestion = questions[Math.min((sentenceCount), questions.length - 1) % questions.length];
  return (
    <div className="-mt-5 flex flex-col w-full bg-background/80">
      <div className="h-20 mb-1 px-4 w-full">
        <div
          className="text-sm bg-background text-left shadow-lg px-4 py-2.5 border rounded-xl inline-flex justify-between w-full items-center">
          <span className="max-w-[250px] sm:max-w-[400px]">{currentQuestion}</span>
        </div>
      </div>
      <div
        className="overflow-hidden bg-background p-4 w-full text-xl h-[88vh] pressed:bg-muted text-muted-foreground border rounded-xl"
      >
        <div className="inset-0 bg-muted/20 h-full w-full absolute -z-10" />
        <TextArea value={letterContent} onChange={e => setLetterContent(e.target.value)}
                  className="min-h-full bg-transparent w-full outline-none"
                  placeholder={`${name ? name + ',' : 'Please'} introduce yourself...`} />

      </div>
    </div>
  );
};
