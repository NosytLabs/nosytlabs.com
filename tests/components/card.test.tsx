import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardBadge
} from '@/components/ui/card';

describe('Card Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render card with default props', () => {
      render(<Card>Card content</Card>);
      
      const card = screen.getByText('Card content');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-xl', 'border', 'shadow-sm', 'transition-all');
    });

    it('should apply custom className', () => {
      render(<Card className="custom-class">Card content</Card>);
      
      const card = screen.getByText('Card content');
      expect(card).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(<Card ref={ref}>Card content</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe('Card content');
    });
  });

  describe('Variants', () => {
    it('should render default variant with design tokens', () => {
      render(<Card variant="default">Default card</Card>);
      
      const card = screen.getByText('Default card');
      expect(card).toHaveClass(
        'bg-white',
        'dark:bg-neutral-800',
        'border-neutral-200',
        'dark:border-neutral-700',
        'text-neutral-900',
        'dark:text-neutral-100'
      );
    });

    it('should render featured variant', () => {
      render(<Card variant="featured">Featured card</Card>);
      
      const card = screen.getByText('Featured card');
      expect(card).toHaveClass(
        'bg-white',
        'dark:bg-neutral-800',
        'border-2',
        'border-primary-500',
        'shadow-lg'
      );
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Card size="sm">Small card</Card>);
      
      const card = screen.getByText('Small card');
      expect(card).toHaveClass('p-4');
    });

    it('should render medium size (default)', () => {
      render(<Card size="default">Medium card</Card>);
      
      const card = screen.getByText('Medium card');
      expect(card).toHaveClass('p-6');
    });

    it('should render large size', () => {
      render(<Card size="lg">Large card</Card>);
      
      const card = screen.getByText('Large card');
      expect(card).toHaveClass('p-8');
    });

    it('should render extra large size', () => {
      render(<Card size="xl">Extra large card</Card>);
      
      const card = screen.getByText('Extra large card');
      expect(card).toHaveClass('p-10');
    });
  });

  describe('Hoverable State', () => {
    it('should apply hover effects when hoverable is true', () => {
      render(<Card hoverable>Hoverable card</Card>);
      
      const card = screen.getByText('Hoverable card');
      expect(card).toHaveClass('nosyt-card-hover', 'cursor-pointer');
    });

    it('should not apply hover effects when hoverable is false', () => {
      render(<Card hoverable={false}>Non-hoverable card</Card>);
      
      const card = screen.getByText('Non-hoverable card');
      expect(card).not.toHaveClass('nosyt-card-hover', 'cursor-pointer');
    });

    it('should handle click events when hoverable', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Card hoverable onClick={handleClick}>Clickable card</Card>);
      
      const card = screen.getByText('Clickable card');
      await user.click(card);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should support role attribute', () => {
      render(<Card role="region" aria-label="Card content">Accessible card</Card>);
      
      const card = screen.getByRole('region');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('aria-label', 'Card content');
    });

    it('should support aria-describedby', () => {
      render(
        <>
          <div id="description">This card contains important information</div>
          <Card aria-describedby="description">Card with description</Card>
        </>
      );
      
      const card = screen.getByText('Card with description');
      expect(card).toHaveAttribute('aria-describedby', 'description');
    });

    it('should be focusable when hoverable', () => {
      render(<Card hoverable tabIndex={0}>Focusable card</Card>);
      
      const card = screen.getByText('Focusable card');
      card.focus();
      expect(card).toHaveFocus();
    });
  });
});

describe('Card Sub-components', () => {
  describe('CardHeader', () => {
    it('should render with correct styling', () => {
      render(<CardHeader>Header content</CardHeader>);
      
      const header = screen.getByText('Header content');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });

    it('should apply custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>);
      
      const header = screen.getByText('Header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('should render as h3 by default', () => {
      render(<CardTitle>Card Title</CardTitle>);
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Card Title');
    });

    it('should apply correct styling', () => {
      render(<CardTitle>Styled title</CardTitle>);
      
      const title = screen.getByText('Styled title');
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('should apply custom className', () => {
      render(<CardTitle className="custom-title">Custom title</CardTitle>);
      
      const title = screen.getByText('Custom title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('should render with correct styling', () => {
      render(<CardDescription>Description text</CardDescription>);
      
      const description = screen.getByText('Description text');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-neutral-600', 'dark:text-neutral-300');
    });

    it('should apply custom className', () => {
      render(<CardDescription className="custom-desc">Description</CardDescription>);
      
      const description = screen.getByText('Description');
      expect(description).toHaveClass('custom-desc');
    });
  });

  describe('CardContent', () => {
    it('should render with correct styling', () => {
      render(<CardContent>Content area</CardContent>);
      
      const content = screen.getByText('Content area');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('should handle complex children', () => {
      render(
        <CardContent>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </CardContent>
      );
      
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });
  });

  describe('CardFooter', () => {
    it('should render with correct styling', () => {
      render(<CardFooter>Footer content</CardFooter>);
      
      const footer = screen.getByText('Footer content');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('should support action buttons', () => {
      render(
        <CardFooter>
          <button>Action 1</button>
          <button>Action 2</button>
        </CardFooter>
      );
      
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
    });
  });

  describe('CardBadge', () => {
    it('should render with default variant', () => {
      render(<CardBadge>Default badge</CardBadge>);
      
      const badge = screen.getByText('Default badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-neutral-100', 'text-neutral-800');
    });

    it('should render primary variant with design tokens', () => {
      render(<CardBadge variant="primary">Primary badge</CardBadge>);
      
      const badge = screen.getByText('Primary badge');
      expect(badge).toHaveClass('bg-primary-100', 'text-primary-800');
    });

    it('should render secondary variant', () => {
      render(<CardBadge variant="secondary">Secondary badge</CardBadge>);
      
      const badge = screen.getByText('Secondary badge');
      expect(badge).toHaveClass('bg-secondary-100', 'text-secondary-800');
    });

    it('should render info variant', () => {
      render(<CardBadge variant="info">Info badge</CardBadge>);
      
      const badge = screen.getByText('Info badge');
      expect(badge).toHaveClass('bg-info-100', 'text-info-800');
    });

    it('should apply transition classes', () => {
      render(<CardBadge>Animated badge</CardBadge>);
      
      const badge = screen.getByText('Animated badge');
      expect(badge).toHaveClass('transition-colors');
    });

    it('should apply correct base styling', () => {
      render(<CardBadge>Styled badge</CardBadge>);
      
      const badge = screen.getByText('Styled badge');
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'rounded-full',
        'px-2.5',
        'py-0.5',
        'text-xs',
        'font-medium'
      );
    });
  });
});

describe('Card Component Integration', () => {
  it('should compose all sub-components correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
          <CardDescription>This is a test card</CardDescription>
          <CardBadge variant="primary">Featured</CardBadge>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Primary Action</button>
          <button>Secondary Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Card');
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('Main content goes here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Secondary Action' })).toBeInTheDocument();
  });

  it('should maintain variant consistency', () => {
    const { rerender } = render(<Card variant="default">Default card</Card>);
    
    let card = screen.getByText('Default card');
    expect(card).toHaveClass('bg-white', 'border-neutral-200');
    
    rerender(<Card variant="featured">Featured card</Card>);
    card = screen.getByText('Featured card');
    expect(card).toHaveClass('bg-white', 'border-2', 'border-primary-500');
  });

  it('should work with complex layouts', () => {
    render(
      <div className="grid grid-cols-2 gap-4">
        <Card variant="default" size="sm">
          <CardHeader>
            <CardTitle>Card 1</CardTitle>
          </CardHeader>
          <CardContent>Content 1</CardContent>
        </Card>
        <Card variant="featured" size="lg" hoverable>
          <CardHeader>
            <CardTitle>Card 2</CardTitle>
            <CardBadge variant="primary">Important</CardBadge>
          </CardHeader>
          <CardContent>Content 2</CardContent>
        </Card>
      </div>
    );

    const card1 = screen.getByText('Content 1').closest('.rounded-xl');
    const card2 = screen.getByText('Content 2').closest('.rounded-xl');
    
    expect(card1).toHaveClass('p-4'); // Small size
    expect(card2).toHaveClass('p-8', 'nosyt-card-hover'); // Large size and hoverable
  });

  describe('Design Token Integration', () => {
    it('should use centralized design tokens for available variants', () => {
      // Test that available variants use the correct design token classes
      const { unmount: unmount1 } = render(<Card variant="default">Default Test</Card>);
      
      let card = screen.getByText('Default Test');
      expect(card).toHaveClass('bg-white', 'border-neutral-200');
      
      unmount1();
      
      const { unmount: unmount2 } = render(<Card variant="featured">Featured Test</Card>);
      card = screen.getByText('Featured Test');
      expect(card).toHaveClass('bg-white', 'border-2', 'border-primary-500');
      
      unmount2();
    });

    it('should maintain dark mode compatibility', () => {
      render(<Card variant="default">Dark mode card</Card>);
      
      const card = screen.getByText('Dark mode card');
      expect(card).toHaveClass(
        'dark:bg-neutral-800',
        'dark:border-neutral-700'
      );
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const renderSpy = vi.fn();
      
      const TestCard = React.memo((props: any) => {
        renderSpy();
        return <Card {...props} />;
      });
      
      const { rerender } = render(<TestCard>Test</TestCard>);
      
      // Same props should not cause re-render
      rerender(<TestCard>Test</TestCard>);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle large amounts of content efficiently', () => {
      const largeContent = Array.from({ length: 100 }, (_, i) => (
        <p key={i}>Line {i + 1}</p>
      ));
      
      render(
        <Card>
          <CardContent>
            {largeContent}
          </CardContent>
        </Card>
      );
      
      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 100')).toBeInTheDocument();
    });
  });
});