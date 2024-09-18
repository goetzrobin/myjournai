import React from 'react';
import {
  composeRenderProps,
  FieldError as RACFieldError,
  FieldErrorProps,
  Group,
  GroupProps,
  Input as RACInput,
  InputProps,
  Label as RACLabel,
  LabelProps,
  Text,
  TextProps
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { composeTailwindRenderProps, focusRing } from './utils';

export function Label(props: LabelProps) {
  return <RACLabel {...props} className={twMerge('text-sm text-muted-foreground/80 cursor-default w-fit', props.className)} />;
}

export function Description(props: TextProps) {
  return <Text {...props} slot="description" className={twMerge('text-sm text-muted-foreground/80', props.className)} />;
}

export function FieldError(props: FieldErrorProps) {
  return <RACFieldError {...props} className={composeTailwindRenderProps(props.className, 'text-sm text-destructive')} />
}

export const fieldBorderStyles = tv({
  variants: {
    isFocusWithin: {
      false: 'border-border/90',
      true: 'border-border',
    },
    isInvalid: {
      true: 'border-destructive'
    },
    isDisabled: {
      true: 'border-border/40'
    }
  }
});

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: 'group flex items-center h-9 border rounded-lg overflow-hidden',
  variants: fieldBorderStyles.variants
});

export function FieldGroup(props: GroupProps) {
  return <Group {...props} className={composeRenderProps(props.className, (className, renderProps) => fieldGroupStyles({...renderProps, className}))} />;
}

export function Input(props: InputProps) {
  return <RACInput {...props} className={composeTailwindRenderProps(props.className, 'px-2 py-1.5 flex-1 min-w-0 outline outline-0 text-sm border bg-input/40 placeholder:text-muted-foreground disabled:opacity-50')} />
}
