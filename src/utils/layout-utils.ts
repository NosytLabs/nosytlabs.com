/**
 * Layout Utility Classes
 * Consolidated container and layout patterns
 */

export interface ContainerOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
  relative?: boolean;
  className?: string;
}

/**
 * Get standardized container classes based on options
 */
export function getContainerClasses(options: ContainerOptions = {}): string {
  const {
    size = 'xl',
    padding = 'md',
    center = true,
    relative = false,
    className = ''
  } = options;

  const classes = ['container'];
  
  // Size classes
  const sizeMap = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };
  classes.push(sizeMap[size]);

  // Center the container
  if (center) {
    classes.push('mx-auto');
  }

  // Padding classes
  const paddingMap = {
    none: '',
    sm: 'px-4',
    md: 'px-4 md:px-6',
    lg: 'px-4 md:px-6 lg:px-8'
  };
  if (paddingMap[padding]) {
    classes.push(paddingMap[padding]);
  }

  // Relative positioning
  if (relative) {
    classes.push('relative');
  }

  // Custom classes
  if (className) {
    classes.push(className);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get responsive grid classes
 */
export function getGridClasses(options: {
  cols?: number | string;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
} = {}): string {
  const { cols = 'auto-fit', gap = 'md' } = options;
  
  const classes = ['grid'];
  
  if (typeof cols === 'number') {
    classes.push(`grid-cols-${cols}`);
  } else if (cols === 'auto-fit') {
    classes.push('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
  } else if (cols === 'auto-fill') {
    classes.push('grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4');
  }

  const gapMap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };
  classes.push(gapMap[gap]);

  return classes.join(' ');
}

/**
 * Get section spacing classes
 */
export function getSectionClasses(options: {
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  background?: string;
  className?: string;
} = {}): string {
  const { padding = 'lg', background, className = '' } = options;
  
  const classes = ['section'];
  
  const paddingMap = {
    sm: 'py-8',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-20',
    xl: 'py-20 md:py-24'
  };
  classes.push(paddingMap[padding]);

  if (background) {
    classes.push(background);
  }

  if (className) {
    classes.push(className);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get flex utility classes
 */
export function getFlexClasses(options: {
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg';
} = {}): string {
  const { 
    direction = 'row', 
    align = 'center', 
    justify = 'start', 
    wrap = false,
    gap = 'md'
  } = options;

  const classes = ['flex'];
  
  if (direction === 'col') {
    classes.push('flex-col');
  }

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };
  classes.push(alignMap[align]);

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };
  classes.push(justifyMap[justify]);

  if (wrap) {
    classes.push('flex-wrap');
  }

  const gapMap = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };
  classes.push(gapMap[gap]);

  return classes.join(' ');
}
