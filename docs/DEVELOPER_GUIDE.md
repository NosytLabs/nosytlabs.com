# Developer Guide

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- VSCode with recommended extensions

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
├── public/              # Static assets
│   ├── images/         # Optimized images
│   ├── scripts/        # Client-side JavaScript
│   ├── styles/         # CSS files
│   └── sounds/         # Audio files
├── src/                # Source code
│   ├── pages/         # Astro pages
│   ├── styles/        # Global styles
│   └── utils/         # Utility functions
├── tests/             # Test files
├── docs/              # Documentation
└── scripts/           # Build and utility scripts
```

## Performance Guidelines

### Asset Optimization

1. **Images**
   ```javascript
   // Use WebP with fallback
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="Description" loading="lazy">
   </picture>
   ```

2. **JavaScript**
   ```javascript
   // Use dynamic imports for code splitting
   const MyComponent = () => import('./MyComponent');

   // Implement proper cleanup
   useEffect(() => {
     const handler = () => {...};
     window.addEventListener('event', handler);
     return () => window.removeEventListener('event', handler);
   }, []);
   ```

3. **CSS**
   ```css
   /* Use CSS containment for performance */
   .component {
     contain: content;
     content-visibility: auto;
   }
   ```

### Performance Testing

```typescript
// Example performance test
test('performance metrics', async ({ page }) => {
  const metrics = await page.evaluate(() => ({
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime,
  }));
  
  expect(metrics.fcp).toBeLessThan(1000);
  expect(metrics.lcp).toBeLessThan(2500);
});
```

## Accessibility Implementation

### ARIA Labels
```html
<!-- Use semantic HTML with ARIA -->
<button 
  aria-label="Close dialog"
  aria-pressed="false"
  onClick={handleClose}
>
  <span aria-hidden="true">×</span>
</button>
```

### Keyboard Navigation
```javascript
// Implement keyboard handlers
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeDialog();
  }
};

// Trap focus in modals
const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
};
```

## Testing Guidelines

### Unit Tests
```typescript
test('component renders correctly', () => {
  render(<Component />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### Accessibility Tests
```typescript
test('meets accessibility standards', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Coding Standards

### TypeScript
```typescript
// Use proper typing
interface Props {
  title: string;
  onAction: () => void;
  isActive?: boolean;
}

// Implement error boundaries
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
}
```

### CSS
```css
/* Use CSS custom properties */
:root {
  --primary-color: #007bff;
  --text-color: #333;
}

/* Implement responsive design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}
```

## Build and Deployment

### Production Build
```bash
# Generate optimized build
npm run build

# Preview production build
npm run preview
```

### Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals in production
- Set up error tracking and reporting

## Troubleshooting

### Common Issues

1. **Service Worker Problems**
   ```javascript
   // Clear service worker cache
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.getRegistrations().then((registrations) => {
       registrations.forEach((registration) => registration.unregister());
     });
   }
   ```

2. **Performance Issues**
   - Check for memory leaks using Chrome DevTools
   - Analyze bundle size with `source-map-explorer`
   - Use React Profiler for component optimization

## Best Practices

1. **Code Organization**
   - Follow single responsibility principle
   - Implement proper error handling
   - Use meaningful variable names
   - Document complex logic

2. **Performance**
   - Minimize reflows and repaints
   - Implement proper caching
   - Optimize critical rendering path
   - Use performance budgets

3. **Accessibility**
   - Test with screen readers
   - Ensure keyboard navigation
   - Maintain proper heading hierarchy
   - Implement ARIA where needed

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/name

# Make commits with conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"

# Push changes
git push origin feature/name
```

## Contribution Guidelines

1. Follow the coding standards
2. Write tests for new features
3. Update documentation
4. Create detailed pull requests
5. Review code thoroughly

Remember to check the [Architecture Documentation](./ARCHITECTURE.md) for detailed system design information.