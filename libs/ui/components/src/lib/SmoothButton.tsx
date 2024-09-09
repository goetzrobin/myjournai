import React, { PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Button, ButtonProps } from './Button';

export const SmoothButton = ({ buttonState, className, children, ...buttonProps }: PropsWithChildren<{
  className?: string;
  buttonState: 'idle' | 'pending' | 'success' | 'error'
} & ButtonProps>) => {
  return <Button className={twMerge("w-full",className)} {...buttonProps}>
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
