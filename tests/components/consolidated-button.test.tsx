import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { 
  NosytButton, 
  ShinyButton, 
  ShimmerButton, 
  PrimaryButton, 
  SecondaryButton, 
  OutlineButton 
} from '@/components/ui/consolidated-button';

describe('NosytButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render button with default props', () => {
      render(<NosytButton>Click me</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('should render as anchor when href is provided', () => {
      render(<NosytButton href="/test">Link button</NosytButton>);
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveTextContent('Link button');
    });

    it('should apply custom className', () => {
      render(<NosytButton className="custom-class">Button</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should render primary variant', () => {
      render(<NosytButton variant="primary">Primary</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('nosyt-btn-primary');
    });

    it('should render secondary variant', () => {
      render(<NosytButton variant="secondary">Secondary</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('nosyt-btn-secondary');
    });

    it('should render outline variant', () => {
      render(<NosytButton variant="outline">Outline</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('nosyt-btn-outline');
    });

    it('should render shiny variant with proper styling', () => {
      render(<NosytButton variant="shiny">Shiny</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('group', 'relative', 'overflow-hidden');
    });

    it('should render shimmer variant with custom properties', () => {
      render(
        <NosytButton 
          variant="shimmer" 
          shimmerColor="#ff0000" 
          shimmerDuration="2s"
        >
          Shimmer
        </NosytButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        '--shimmer-color': '#ff0000',
        '--speed': '2s'
      });
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<NosytButton size="sm">Small</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('should render medium size (default)', () => {
      render(<NosytButton size="md">Medium</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });

    it('should render large size', () => {
      render(<NosytButton size="lg">Large</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
    });
  });

  describe('Interactive States', () => {
    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<NosytButton onClick={handleClick}>Click me</NosytButton>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      render(<NosytButton disabled>Disabled</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should support type attribute for form submission', () => {
      render(<NosytButton type="submit">Submit</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<NosytButton aria-label="Close dialog">×</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('should support aria-describedby', () => {
      render(
        <>
          <div id="help-text">This button does something</div>
          <NosytButton aria-describedby="help-text">Action</NosytButton>
        </>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('should be focusable by keyboard', () => {
      render(<NosytButton>Focus me</NosytButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Animation Props', () => {
    it('should apply animation classes when animated is true', () => {
      render(<NosytButton animated>Animated</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('nosyt-hover-lift');
    });

    it('should not apply animation classes when animated is false', () => {
      render(<NosytButton animated={false}>Not animated</NosytButton>);
      
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('nosyt-hover-lift');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(<NosytButton ref={ref}>Button</NosytButton>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Button');
    });

    it('should handle ref with href (anchor element)', () => {
      const ref = React.createRef<HTMLAnchorElement>();
      
      render(<NosytButton href="/test" ref={ref}>Link</NosytButton>);
      
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
      expect(ref.current?.href).toContain('/test');
    });
  });
});

describe('Button Variant Components', () => {
  describe('ShinyButton', () => {
    it('should render with shiny variant', () => {
      render(<ShinyButton>Shiny</ShinyButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('group', 'relative', 'overflow-hidden');
    });

    it('should accept all button props except variant', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<ShinyButton onClick={handleClick} size="lg">Large Shiny</ShinyButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
      
      await user.click(button);
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('ShimmerButton', () => {
    it('should render with shimmer variant', () => {
      render(<ShimmerButton>Shimmer</ShimmerButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('group', 'relative', 'z-0', 'cursor-pointer');
    });

    it('should accept shimmer-specific props', () => {
      render(
        <ShimmerButton 
          shimmerColor="#00ff00" 
          shimmerDuration="3s"
          shimmerSize="2px"
        >
          Custom Shimmer
        </ShimmerButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        '--shimmer-color': '#00ff00',
        '--speed': '3s',
        '--cut': '2px'
      });
    });
  });

  describe('PrimaryButton', () => {
    it('should render with primary variant', () => {
      render(<PrimaryButton>Primary</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('nosyt-btn-primary');
    });
  });

  describe('SecondaryButton', () => {
    it('should render with secondary variant', () => {
      render(<SecondaryButton>Secondary</SecondaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('nosyt-btn-secondary');
    });
  });

  describe('OutlineButton', () => {
    it('should render with outline variant', () => {
      render(<OutlineButton>Outline</OutlineButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('nosyt-btn-outline');
    });
  });
});

describe('Button Component Integration', () => {
  it('should work within forms', async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    const user = userEvent.setup();
    
    render(
      <form onSubmit={handleSubmit}>
        <NosytButton type="submit">Submit Form</NosytButton>
      </form>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should handle complex children elements', () => {
    render(
      <NosytButton>
        <svg width="16" height="16" aria-hidden="true">
          <circle cx="8" cy="8" r="4" />
        </svg>
        <span>Button with icon</span>
      </NosytButton>
    );
    
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button).toHaveTextContent('Button with icon');
  });

  it('should maintain consistent styling across variants', () => {
    const { rerender } = render(<NosytButton variant="primary">Test</NosytButton>);
    
    let button = screen.getByRole('button');
    const baseClasses = Array.from(button.classList).filter(cls => 
      cls.includes('inline-flex') || cls.includes('items-center') || cls.includes('justify-center')
    );
    
    rerender(<NosytButton variant="secondary">Test</NosytButton>);
    button = screen.getByRole('button');
    
    baseClasses.forEach(cls => {
      expect(button).toHaveClass(cls);
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const renderSpy = vi.fn();
      
      const TestButton = React.memo((props: any) => {
        renderSpy();
        return <NosytButton {...props} />;
      });
      
      const { rerender } = render(<TestButton>Test</TestButton>);
      
      // Same props should not cause re-render
      rerender(<TestButton>Test</TestButton>);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });
});
