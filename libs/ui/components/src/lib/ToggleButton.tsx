import React from 'react';
import { composeRenderProps, ToggleButton as RACToggleButton, ToggleButtonProps } from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { focusRing } from './utils';

let styles = tv({
  extend: focusRing,
  base: 'px-5 py-2 text-sm text-center transition rounded-lg border border-black/10 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-none cursor-default forced-color-adjust-none',
  variants: {
    isSelected: {
      false: 'bg-zinc-100 hover:bg-zinc-200 pressed:bg-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-500 dark:pressed:bg-zinc-400 dark:text-zinc-100',
      true: 'bg-zinc-700 hover:bg-zinc-800 pressed:bg-zinc-900 text-white dark:bg-zinc-300 dark:hover:bg-zinc-200 dark:pressed:bg-zinc-100 dark:text-black'
    },
    isDisabled: {
      true: 'bg-zinc-100 dark:bg-zinc-800 forced-colors:!bg-[ButtonFace] text-zinc-300 dark:text-zinc-600 forced-colors:!text-[GrayText] border-black/5 dark:border-white/5 forced-colors:border-[GrayText]'
    }
  }
});

export function ToggleButton(props: ToggleButtonProps) {
  return (
    <RACToggleButton
      {...props}
      className={composeRenderProps(
        props.className,
        (className, renderProps) => styles({...renderProps, className})
      )} />
  );
}
