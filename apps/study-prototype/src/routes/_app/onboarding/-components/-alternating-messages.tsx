import React, { PropsWithChildren, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const AlternatingMessages = ({ children, showing, messages, onComplete }: PropsWithChildren<{
  showing: boolean,
  messages: string[],
  onComplete?: () => void;
}>) => {
  const [isShowingButton, setShowingButton] = useState(false);
  const [count, setCount] = useState(0);
  const currentMessage = messages[count];
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 2500);

    if (count === messages.length - 1) {
      clearInterval(interval);
      setTimeout(() => setShowingButton(true), 1000);
      onComplete?.()
    }
    return () => clearInterval(interval);
  }, [messages.length, count, onComplete]);

  return (showing ? null :
    <div
      className="p-4 grid fade-in animate-in [animation-duration:500ms] -m-2 z-10 absolute inset-0 bg-background/20 backdrop-blur">
      <AnimatePresence mode="popLayout">
        <motion.p className="h-20 w-full place-self-center text-center text-xl"
                  key={currentMessage}
                  initial={{ y: 6, opacity: 0, filter: 'blur(4px)', scale: .9 }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }}
                  exit={{ y: 0, opacity: 0, filter: 'blur(4px)', scale: .9 }}
                  transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
        >
          {currentMessage}
        </motion.p>
      </AnimatePresence>
      {!isShowingButton ? null :
        <div className="p-2 bottom-4 w-full absolute">
          {children}
        </div>}
    </div>);
};

export default AlternatingMessages;
