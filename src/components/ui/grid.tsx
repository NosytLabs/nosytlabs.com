import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
      auto: 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
      'auto-sm': 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
      'auto-lg': 'grid-cols-[repeat(auto-fit,minmax(350px,1fr))]',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2 md:gap-4',
      default: 'gap-4 md:gap-6',
      lg: 'gap-6 md:gap-8',
      xl: 'gap-8 md:gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
    },
  },
  defaultVariants: {
    cols: 'auto',
    gap: 'default',
    align: 'stretch',
    justify: 'stretch',
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  as?: keyof JSX.IntrinsicElements;
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'full';
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'full';
  as?: keyof JSX.IntrinsicElements;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, align, justify, as = 'div', ...props }, ref) => {
    const Component = as;

    return React.createElement(Component, {
      className: cn(gridVariants({ cols, gap, align, justify, className })),
      ref,
      ...props,
    });
  }
);

Grid.displayName = 'Grid';

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan, rowSpan, as = 'div', ...props }, ref) => {
  const Component = as;

  const colSpanClass = colSpan
    ? {
        1: 'col-span-1',
        2: 'col-span-2',
        3: 'col-span-3',
        4: 'col-span-4',
        5: 'col-span-5',
        6: 'col-span-6',
        full: 'col-span-full',
      }[colSpan]
    : '';

  const rowSpanClass = rowSpan
    ? {
        1: 'row-span-1',
        2: 'row-span-2',
        3: 'row-span-3',
        4: 'row-span-4',
        5: 'row-span-5',
        6: 'row-span-6',
        full: 'row-span-full',
      }[rowSpan]
    : '';

  return React.createElement(Component, {
    className: cn(colSpanClass, rowSpanClass, className),
    ref,
    ...props,
  });
});

GridItem.displayName = 'GridItem';

export { Grid, GridItem, gridVariants };
