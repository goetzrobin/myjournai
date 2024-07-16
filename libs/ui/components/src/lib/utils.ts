import {useEffect, useState} from "react";
import { composeRenderProps } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

export const focusRing = tv({
  base: 'outline outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight] outline-offset-2',
  variants: {
    isFocusVisible: {
      false: 'outline-0',
      true: 'outline-2'
    }
  }
});

export function composeTailwindRenderProps<T>(className: string | ((v: T) => string) | undefined, tw: string): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}



export const useFakeAiStream = ({
                                  fakeMessage,
                                  active,
                                  delay,
                                  onComplete
                                }: {
  fakeMessage: string;
  active?: boolean;
  delay?: number;
  onComplete?: () => void
},) => {
  const [message, setMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const chunks = fakeMessage.split(' ');

  useEffect(() => {
    if (!active) return;
    if (currentIndex < chunks.length) {
      const timeout = setTimeout(() => {
        setMessage(prevText => prevText + ' ' + chunks[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);

        if (currentIndex === chunks.length - 1) {
          onComplete && onComplete()
        }

      }, (delay ?? 60) + (Math.floor(Math.random() * 40) + 10));

      return () => clearTimeout(timeout);
    }
  }, [active, currentIndex, delay, message]);
  return message
}
