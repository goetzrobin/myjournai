import React from 'react';
import {
  ProgressBar as AriaProgressBar,
  ProgressBarProps as AriaProgressBarProps
} from 'react-aria-components';
import { Label } from './Field';
import { composeTailwindRenderProps } from './utils';

export interface ProgressBarProps extends AriaProgressBarProps {
  label?: string;
  withText?: boolean;
}

export function ProgressBar({ label, withText, ...props }: ProgressBarProps) {
  return (
    <AriaProgressBar {...props} className={composeTailwindRenderProps(props.className, 'flex flex-col gap-1')}>
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          {!withText ? null : <div className="flex justify-between gap-2">
            <Label>{label}</Label>
            <span className="text-sm text-gray-600 dark:text-zinc-400">{valueText}</span>
          </div>}
          <div
            className="h-2 rounded-full bg-gray-300 dark:bg-zinc-700 outline outline-1 -outline-offset-1 outline-transparent relative overflow-hidden">
            <div
              className={`w-full transition-transform absolute top-0 h-full rounded-full bg-blue-600 dark:bg-blue-500 forced-colors:bg-[Highlight] ${isIndeterminate ? 'left-full animate-in duration-1000 [--tw-enter-translate-x:calc(-16rem-100%)] slide-out-to-right-full repeat-infinite ease-out' : 'left-0'}`}
              style={{ transform: `translateX(${-100 + (isIndeterminate ? 40 : percentage ?? 0)}%)` }} />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
