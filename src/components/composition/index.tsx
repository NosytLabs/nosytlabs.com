/**
 * Component Composition System
 * Provides reusable patterns and better abstractions for component building
 * 
 * @fileoverview Enhanced component composition utilities
 * @module components/composition
 * @version 1.0.0
 */

import React, { forwardRef } from 'react';
import type { ElementType, ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import type { 
  ComposableProps, 
  ComponentVariant, 
  ComponentSize,
  AnimationConfig 
} from '@/types/enhanced-component-types';

// ========== POLYMORPHIC COMPONENT SYSTEM ==========

/**
 * Polymorphic component props that allow changing the underlying element
 */
type PolymorphicProps<T extends ElementType> = ComposableProps & {
  as?: T;
} & Omit<ComponentProps<T>, keyof ComposableProps>;

/**
 * Base polymorphic component for flexible element rendering
 */
export function createPolymorphicComponent<DefaultElement extends ElementType>(
  defaultElement: DefaultElement,
  baseClassName?: string
) {  return forwardRef<
    HTMLElement,
    PolymorphicProps<DefaultElement>
  >((props, ref) => {
    // @ts-ignore - Complex polymorphic type intersection
    const { as, className, children, ...restProps } = props;
    const Component = as || defaultElement;
    
    return (
      <Component
        ref={ref}
        className={cn(baseClassName, className)}
        {...restProps}
      >
        {children}
      </Component>
    );
  });
}

// ========== VARIANT SYSTEM ==========

/**
 * Variant class mapping for consistent theming
 */
export const variantClasses = {
  default: 'bg-white border border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white',
  primary: 'nosyt-gradient-primary text-white border-0',
  secondary: 'bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200',
  outline: 'bg-transparent border-2 border-nosyt-purple text-nosyt-purple hover:bg-nosyt-purple hover:text-white',
  ghost: 'bg-transparent border-0 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
  minimal: 'bg-transparent border-0 text-inherit',
  featured: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200 dark:from-yellow-900 dark:to-orange-900 dark:border-orange-700'
} as const;

/**
 * Size class mapping
 */
export const sizeClasses = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-2',
  md: 'text-base px-4 py-3',
  lg: 'text-lg px-6 py-4',
  xl: 'text-xl px-8 py-5',
  '2xl': 'text-2xl px-10 py-6'
} as const;

// ========== LAYOUT COMPOSITION ==========

/**
 * Flexible container component with responsive design
 */
export const Container = createPolymorphicComponent(
  'div',
  'w-full mx-auto px-4 sm:px-6 lg:px-8'
);

/**
 * Flexible stack component for vertical layouts
 */
interface StackProps extends ComposableProps {
  gap?: ComponentSize;
  align?: 'start' | 'center' | 'end' | 'stretch';
  direction?: 'vertical' | 'horizontal';
}

export const Stack: React.FC<StackProps> = ({
  children,
  gap = 'md',
  align = 'stretch',
  direction = 'vertical',
  className,
  as: Component = 'div',
  ...props
}) => {
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <Component
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        gapClasses[gap],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Flexible grid component with responsive columns
 */
interface GridProps extends ComposableProps {
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: ComponentSize;
  autoRows?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 1,
  gap = 'md',
  autoRows,
  className,
  as: Component = 'div',
  ...props
}) => {
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12'
  };

  const getColumnClasses = () => {
    if (typeof columns === 'number') {
      return `grid-cols-${columns}`;
    }
    
    const classes = ['grid-cols-1'];
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    return classes.join(' ');
  };

  return (
    <Component
      className={cn(
        'grid',
        getColumnClasses(),
        gapClasses[gap],
        autoRows && `auto-rows-${autoRows}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// ========== ENHANCED CARD SYSTEM ==========

interface CardProps extends ComposableProps {
  variant?: ComponentVariant;
  hover?: boolean;
  padding?: ComponentSize;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Enhanced card component with consistent styling and behavior
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = true,
  padding = 'md',
  header,
  footer,
  className,
  as: Component = 'div',
  ...props
}) => {
  const paddingClasses = {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
    '2xl': 'p-12'
  };

  return (
    <Component
      className={cn(
        'rounded-xl shadow-sm transition-all duration-300',
        variantClasses[variant],
        hover && 'hover:shadow-lg hover:-translate-y-1',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {header && (
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          {header}
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </Component>
  );
};

// ========== CONTENT COMPOSITION ==========

interface SectionProps extends ComposableProps {
  fullWidth?: boolean;
  background?: 'transparent' | 'primary' | 'secondary' | 'gradient';
  padding?: ComponentSize;
}

/**
 * Section component for page layout composition
 */
export const Section: React.FC<SectionProps> = ({
  children,
  fullWidth = false,
  background = 'transparent',
  padding = 'xl',
  className,
  as: Component = 'section',
  ...props
}) => {
  const backgroundClasses = {
    transparent: 'bg-transparent',
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    gradient: 'nosyt-gradient-section'
  };

  const paddingClasses = {
    xs: 'py-4',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
    '2xl': 'py-32'
  };

  return (
    <Component
      className={cn(
        paddingClasses[padding],
        backgroundClasses[background],
        className
      )}
      {...props}
    >
      {fullWidth ? children : <Container>{children}</Container>}
    </Component>
  );
};

// ========== ANIMATION COMPOSITION ==========

interface AnimatedProps extends ComposableProps {
  animation?: AnimationConfig;
  trigger?: 'hover' | 'focus' | 'inView' | 'always';
}

/**
 * Animation wrapper component
 */
export const Animated: React.FC<AnimatedProps> = ({
  children,
  animation,
  trigger = 'inView',
  className,
  as: Component = 'div',
  ...props
}) => {
  // Animation implementation would go here
  // For now, returning basic structure
  
  return (
    <Component
      className={cn(
        'transition-all duration-300',
        animation && 'animate-in',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// ========== UTILITY EXPORTS ==========

/**
 * Utility function to create consistent component variants
 */
export function createVariantComponent<T extends ElementType>(
  Component: T,
  defaultVariant: ComponentVariant = 'default'
) {  return forwardRef<
    HTMLElement,
    PolymorphicProps<T> & { variant?: ComponentVariant }
  >((props, ref) => {
    // @ts-ignore - Complex polymorphic type intersection
    const { variant = defaultVariant, className, ...restProps } = props;    return (
      // @ts-ignore - Complex polymorphic component typing
      <Component
        ref={ref}
        className={cn(variantClasses[variant as keyof typeof variantClasses], className)}
        {...restProps}
      />
    );
  });
}

/**
 * Hook for managing component state consistently
 */
export function useComponentState(initialState = {}) {
  const [state, setState] = React.useState(initialState);
  
  const updateState = React.useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);
  
  return [state, updateState] as const;
}
