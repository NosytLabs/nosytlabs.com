import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const containerVariants = cva('w-full mx-auto px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-2xl',
      default: 'max-w-7xl',
      lg: 'max-w-screen-xl',
      xl: 'max-w-screen-2xl',
      full: 'max-w-none',
      prose: 'max-w-4xl',
    },
    padding: {
      none: 'px-0',
      sm: 'px-2 sm:px-4 lg:px-6',
      default: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-12',
      xl: 'px-8 sm:px-12 lg:px-16',
    },
  },
  defaultVariants: {
    size: 'default',
    padding: 'default',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: keyof JSX.IntrinsicElements;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, as = 'div', ...props }, ref) => {
    const Component = as;

    return React.createElement(Component, {
      className: cn(containerVariants({ size, padding, className })),
      ref,
      ...props,
    });
  }
);

Container.displayName = 'Container';

export { Container, containerVariants };
