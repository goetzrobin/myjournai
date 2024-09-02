import React, { PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '~myjournai/components';
import { twMerge } from 'tailwind-merge';

const SmoothButton = ({ buttonState, className, children }: PropsWithChildren<{
  className?: string;
  buttonState: 'idle' | 'pending' | 'success' | 'error'
}>) => {
  return <Button className={twMerge("w-full",className)} type="submit">
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        className="block w-fit mx-auto"
        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 25 }}
        key={buttonState}
      >
        {children}
      </motion.span>
    </AnimatePresence></Button>;
};

export default SmoothButton;
