import React from 'react';
import { TextArea } from 'react-aria-components';

export const Letter = ({ letterContent, setLetterContent, name }: {
  letterContent: string,
  setLetterContent: (c: string) => void;
  name: string | null | undefined
}) => {
  const sentenceCount = ((letterContent ?? '').match(/\(?[^.?!\n]+[.!?\n]\)?/g) ?? []).length;
  const questions = [
    'I\'ll move to the next question whenever you finish a sentence. Write Hey Sam! to get started.',
    'What sport did or do you play for your university?',
    'What achievement are you most proud of?',
    'What’s your favorite book, movie or TV show?',
    'What’s a goal you are working towards?',
    'What does a typical Sunday look like for you?',
    'Who’s someone you are close to?',
    'Do you have any siblings?',
    'What subject did you enjoy most in school?',
    'What’s something you’ve always wanted to try?',
    'What’s one thing your friends love about you?',
    'What’s an important belief that guides your choices?',
    'What, in life, do you want to be known for?',
    'All done! Feel free to read through the letter again and add what you\'d like me to know about you!'
  ];
  const currentQuestion = questions[Math.min((sentenceCount), questions.length - 1) % questions.length];

  return (
    <div className="h-full -mt-5 flex flex-col w-full bg-background/80">
      <div className="h-24 mb-1 px-4 w-full">
        <div
          className="text-sm bg-background text-left shadow-lg px-4 py-2.5 border rounded-xl inline-flex justify-between w-full items-center">
          <span className="max-w-[300px] sm:max-w-[400px]">{currentQuestion}</span>
        </div>
      </div>
      <div
        className="overflow-hidden bg-background p-4 w-full text-xl h-[45%] pressed:bg-muted text-muted-foreground border rounded-xl"
      >
        <div className="inset-0 bg-muted/20 h-full w-full absolute -z-10" />
        <TextArea value={letterContent} onChange={e => setLetterContent(e.target.value)}
                  className="min-h-full bg-transparent w-full outline-none"
                  placeholder={`${name ? name + ',' : 'Please'} introduce yourself...`} />

      </div>
    </div>
  );
};
