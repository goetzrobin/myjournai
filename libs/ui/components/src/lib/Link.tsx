import React from 'react';
import { tv } from 'tailwind-variants';
import { Link as TanLink, LinkProps as TanLinkProps } from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';
import { button } from './Button';

interface LinkProps extends TanLinkProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

const styles = tv({
  extend: button,
  base: 'px-0',
  variants: {
    variant: {
      ghost: 'shadow-none text-blue-600 dark:text-blue-500 underline decoration-blue-600/60 hover:decoration-blue-600 dark:decoration-blue-500/60 dark:hover:decoration-blue-500',
      underline: '!border-transparent shadow-none underline disabled:no-underline disabled:cursor-default transition rounded',
      icon: ''
    }
  },
  defaultVariants: {
    variant: 'underline'
  }
});

export function Link(props: LinkProps) {
  return <TanLink {...props}
                  className={twMerge(styles({ variant: props.variant, isFocusVisible: 'auto' }), props.className)} />;
}
