# Card Component Framework Guidelines

## Overview

This document provides comprehensive guidelines for using the standardized card components across React and Astro frameworks within the NosytLabs design system.

## Component Architecture

### React Components (`src/components/ui/card.tsx`)

#### Base Card Component
```tsx
import { Card } from "@/components/ui/card";

// Basic usage
<Card variant="default" size="md" hoverable={false}>
  Content here
</Card>
```

#### Available Variants
- **Standard**: `default`, `outline`, `ghost`
- **Semantic**: `primary`, `secondary`, `success`, `warning`, `danger`, `info`
- **Brand**: `nosyt`, `gradient`, `featured`

#### Size Options
- `sm`: 16px padding
- `md`: 24px padding (default)
- `lg`: 32px padding  
- `xl`: 40px padding

#### Sub-Components
```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardImage,
  CardBadge 
} from "@/components/ui/card";

<Card variant="primary" hoverable>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    <CardImage 
      src="/image.jpg" 
      alt="Description" 
      aspectRatio="video" 
    />
    <p>Main content</p>
  </CardContent>
  <CardFooter>
    <CardBadge variant="success">Status</CardBadge>
  </CardFooter>
</Card>
```

### Astro Components

#### Unified Card (`src/components/core/Card.astro`)

```astro
---
import Card from '@/components/core/Card.astro';
---

<!-- Project Card -->
<Card
  contentType="project"
  title="Project Title"
  description="Project description"
  image="/project-image.jpg"
  technologies={['React', 'TypeScript', 'Tailwind']}
  featured={true}
  primaryAction={{
    text: 'View Project',
    href: '/projects/example',
    variant: 'primary'
  }}
/>

<!-- Blog Card -->
<Card
  contentType="blog"
  title="Blog Post Title"
  excerpt="Blog post excerpt..."
  image="/blog-image.jpg"
  author="Author Name"
  date="2024-01-15"
  readTime="5 min read"
  tags={['Development', 'Design']}
/>

<!-- Service Card -->
<Card
  contentType="service"
  title="Service Name"
  description="Service description"
  icon="🚀"
  pricing="Starting at $99"
  timeline="2-3 weeks"
  highlight="Popular"
/>
```

#### Responsive Card (`src/components/core/ResponsiveCard.astro`)

```astro
---
import ResponsiveCard from '@/components/core/ResponsiveCard.astro';
---

<ResponsiveCard
  title="Responsive Title"
  description="Adapts layout based on container size"
  image="/image.jpg"
  href="/learn-more"
  buttonText="Learn More"
  variant="featured"
/>
```

## Design Token Integration

### Color System Usage

#### Semantic Colors
```css
/* Primary */
bg-primary-50 dark:bg-primary-950
border-primary-200 dark:border-primary-700
text-primary-800 dark:text-primary-200

/* Success */
bg-success-50 dark:bg-success-950
border-success-200 dark:border-success-700
text-success-900 dark:text-success-100
```

#### Brand Colors
```css
/* NosytLabs Purple */
bg-brand-purple-500
border-brand-purple-200 dark:border-brand-purple-700
hover:bg-brand-purple-600

/* NosytLabs Orange */
bg-brand-orange-500
text-brand-orange-500 hover:text-brand-orange-600
```

#### Neutral Colors
```css
/* Standard backgrounds */
bg-white dark:bg-neutral-800
border-neutral-200 dark:border-neutral-700
text-neutral-900 dark:text-neutral-100
```

### Global Utility Classes

#### Hover Effects
```css
.nosyt-card-hover /* Predefined card hover animation */
.nosyt-button-hover /* Predefined button hover animation */
.nosyt-focus /* Predefined focus styles */
```

## Framework-Specific Guidelines

### React Best Practices

1. **Use TypeScript interfaces** for props
2. **Leverage `cva`** for variant-based styling
3. **Implement `React.forwardRef`** for ref forwarding
4. **Use the `cn` utility** for class merging

```tsx
const MyCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant={variant}
        className={cn("additional-classes", className)}
        {...props}
      />
    );
  }
);
```

### Astro Best Practices

1. **Use content types** for specialized styling
2. **Leverage CSS container queries** for responsive design
3. **Implement proper props interfaces**
4. **Use CSS variables** for dynamic styling

```astro
---
export interface Props {
  variant?: 'default' | 'featured';
  // ... other props
}

const { variant = 'default' } = Astro.props;
---

<div class:list={[
  'base-classes',
  { 'featured-classes': variant === 'featured' }
]}>
  <!-- Content -->
</div>
```

## Responsive Design Patterns

### Container Queries (ResponsiveCard)
- **< 300px**: Compact vertical layout
- **300-499px**: Standard card layout
- **500-699px**: Horizontal layout with image sidebar
- **≥ 700px**: Three-column layout with dedicated actions

### Breakpoint Guidelines
```css
/* Use container queries for component-level responsiveness */
@container card (min-width: 500px) {
  .card-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

/* Use media queries for global responsiveness */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## Accessibility Standards

### Required Attributes
```tsx
// React
<Card aria-label="Project card" data-testid="project-card">

// Astro
<Card aria-label="Project card" data-testid="project-card">
```

### Focus Management
- All interactive elements must be keyboard accessible
- Focus states use the `nosyt-focus` utility class
- Color contrast meets WCAG AA standards

### Screen Reader Support
```tsx
<CardImage 
  src="/image.jpg" 
  alt="Descriptive alt text" 
  loading="lazy"
  decoding="async"
/>
```

## Performance Considerations

### Image Optimization
```tsx
// React
<CardImage 
  src="/optimized-image.webp"
  alt="Description"
  loading="lazy"
  aspectRatio="video"
/>

// Astro
<img 
  src="/optimized-image.webp"
  alt="Description"
  loading="lazy"
  decoding="async"
/>
```

### Bundle Size
- Use dynamic imports for large card variants
- Leverage tree-shaking with named exports
- Minimize CSS-in-JS overhead

## Testing Patterns

### Unit Testing
```tsx
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/card';

test('renders card with correct variant', () => {
  render(<Card variant="primary" data-testid="test-card">Content</Card>);
  const card = screen.getByTestId('test-card');
  expect(card).toHaveClass('bg-primary-50');
});
```

### Visual Regression Testing
- Test all variant combinations
- Verify dark mode appearances
- Check responsive breakpoints

## Migration Guidelines

### From Legacy Components
1. **Identify the card type** (project, blog, info, etc.)
2. **Map props** to new component interface
3. **Update color references** to design tokens
4. **Test functionality** and appearance
5. **Update imports** and component usage

### Breaking Changes to Avoid
- Maintain existing prop interfaces
- Preserve variant names when possible
- Keep hover effects consistent
- Maintain accessibility attributes

## Common Patterns

### Card Grid Layouts
```tsx
// React
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} variant="default" hoverable>
      {/* Card content */}
    </Card>
  ))}
</div>

// Astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card 
      contentType="project"
      title={item.title}
      hoverable={true}
    />
  ))}
</div>
```

### Conditional Rendering
```tsx
// React
<Card variant={isPriority ? "featured" : "default"}>
  {showImage && <CardImage src={imageSrc} alt={imageAlt} />}
  <CardContent>
    {/* Content based on conditions */}
  </CardContent>
</Card>
```

## Troubleshooting

### Common Issues
1. **Missing hover effects**: Ensure `hoverable={true}` is set
2. **Inconsistent spacing**: Use size props instead of custom padding
3. **Dark mode issues**: Verify design token CSS variables are loaded
4. **Focus issues**: Check that `nosyt-focus` utility is applied

### Debug Steps
1. Verify design tokens are imported
2. Check Tailwind configuration includes design tokens
3. Ensure global CSS utilities are loaded
4. Validate prop interfaces match component expectations

## Future Enhancements

### Planned Features
- Animation variants for card entrance
- Enhanced accessibility features
- Performance optimizations
- Additional responsive patterns

### Extension Points
- Custom variant creation through design tokens
- Plugin system for specialized card types
- Enhanced container query support
- Advanced animation controls