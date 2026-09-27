import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva('im-ui-button', {
  variants: {
    variant: { default: 'im-ui-button--default', outline: 'im-ui-button--outline', ghost: 'im-ui-button--ghost' },
    size: { default: 'im-ui-button--default-size', icon: 'im-ui-button--icon' }
  },
  defaultVariants: { variant: 'default', size: 'default' }
});

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Component = asChild ? Slot : 'button';
  return <Component className={twMerge(clsx(buttonVariants({ variant, size }), className))} {...props} />;
}
