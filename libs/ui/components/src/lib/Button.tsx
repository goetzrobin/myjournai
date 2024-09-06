import React from 'react';
import { Button as RACButton, ButtonProps as RACButtonProps, composeRenderProps } from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { focusRing } from './utils';

export interface ButtonProps extends RACButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'icon' | 'ghost'
}

export const button = tv({
  extend: focusRing,
  base: 'px-5 py-2 text-sm text-center transition rounded-lg border border-black/10 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-none cursor-default',
  variants: {
    variant: {
      primary: 'bg-primary/90 hover:bg-primary/95 pressed:bg-primary text-primary-foreground',
      secondary: 'bg-zinc-100 hover:bg-zinc-200 pressed:bg-zinc-300 text-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:pressed:bg-zinc-400 dark:text-zinc-100',
      destructive: 'bg-red-700 hover:bg-red-800 pressed:bg-red-900 text-white',
      ghost: 'border-0 text-zinc-600 hover:bg-black/[5%] pressed:bg-black/10 dark:hover:bg-white/10 dark:pressed:bg-white/20 disabled:bg-transparent',
      icon: 'border-0 flex items-center justify-center p-1 text-zinc-600 hover:bg-black/[5%] pressed:bg-black/10 dark:hover:bg-white/10 dark:pressed:bg-white/20 disabled:bg-transparent'
    },
    isDisabled: {
      true: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 forced-colors:text-[GrayText] border-black/5 dark:border-white/5'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
});

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(
        props.className,
        (className, renderProps) => button({...renderProps, variant: props.variant, className})
      )} />
  );
}
