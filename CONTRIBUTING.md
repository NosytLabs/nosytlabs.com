# Contributing to NosytLabs Website

Thank you for your interest in contributing to the NosytLabs website! We welcome contributions from the community and are excited to work with you.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/nosytlabs-website.git
   cd nosytlabs-website
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** and navigate to `http://localhost:3000`

## 📋 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports** - Help us identify and fix issues
- **✨ Feature Requests** - Suggest new features or improvements
- **📝 Documentation** - Improve or add documentation
- **🎨 Design Improvements** - Enhance UI/UX and visual design
- **⚡ Performance Optimizations** - Improve site performance
- **🧪 Testing** - Add or improve test coverage
- **🎮 NosytOS95 Enhancements** - Improve the Windows 95 interface

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** to discuss major changes
3. **Follow our coding standards** and conventions
4. **Ensure your changes don't break existing functionality**

## 🛠️ Development Guidelines

### Code Style

- **JavaScript/TypeScript**: Follow ESLint configuration
- **CSS**: Use consistent naming conventions and organization
- **HTML**: Semantic markup and accessibility best practices
- **Astro Components**: Follow Astro.js best practices

### File Organization

```
src/
├── components/          # Reusable components
│   ├── animations/     # Animation components
│   ├── layout/         # Layout components
│   ├── sections/       # Page sections
│   └── ui/             # UI elements
├── layouts/            # Page layouts
├── pages/              # Route pages
├── scripts/            # Development scripts
├── styles/             # Global styles
└── utils/              # Utility functions
```

### Component Guidelines

- **Single Responsibility**: Each component should have one clear purpose
- **Reusability**: Design components to be reusable across the site
- **Props Documentation**: Document component props and usage
- **Accessibility**: Ensure components are accessible to all users

### Performance Standards

- **Lighthouse Score**: Maintain 90+ across all metrics
- **Image Optimization**: Use WebP/AVIF formats with fallbacks
- **Code Splitting**: Implement proper code splitting for large features
- **Lazy Loading**: Use lazy loading for non-critical content

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in debug mode
npm run test:debug

# Check links and performance
npm run check-links
npm run analyze
```

### Test Requirements

- **New Features**: Must include appropriate tests
- **Bug Fixes**: Should include regression tests
- **Performance**: Verify performance impact
- **Cross-Browser**: Test in multiple browsers

### Test Types

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Feature integration tests
- **E2E Tests**: End-to-end user journey tests
- **Performance Tests**: Core Web Vitals and optimization tests

## 📝 Pull Request Process

### Before Submitting

1. **Update documentation** for any new features
2. **Run the test suite** and ensure all tests pass
3. **Check performance** impact with `npm run analyze`
4. **Update CHANGELOG.md** with your changes
5. **Ensure code follows** our style guidelines

### Pull Request Template

When creating a pull request, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tests pass locally
- [ ] New tests added (if applicable)
- [ ] Performance impact verified

## Screenshots (if applicable)
Include screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and checks
2. **Code Review**: Maintainers review code quality and design
3. **Performance Review**: Performance impact assessment
4. **Testing**: Manual testing of changes
5. **Approval**: Final approval and merge

## 🎮 NosytOS95 Development

### Special Considerations

The NosytOS95 interface requires special attention:

- **Authentic Feel**: Maintain Windows 95 aesthetic
- **Modern Performance**: Use modern web technologies efficiently
- **Cross-Browser**: Ensure compatibility across browsers
- **Responsive**: Adapt to different screen sizes appropriately

### Adding New Applications

When adding new applications to NosytOS95:

1. **Create component** in `src/components/nosytos95/`
2. **Add window management** integration
3. **Include proper styling** with Windows 95 theme
4. **Add to Start Menu** configuration
5. **Test thoroughly** across different scenarios

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** for similar problems
2. **Try the latest version** to see if it's already fixed
3. **Gather information** about your environment

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 96, Firefox 95]
- Device: [e.g., Desktop, Mobile]

## Additional Context
Any other relevant information
```

## ✨ Feature Requests

### Before Requesting

1. **Check existing issues** for similar requests
2. **Consider the scope** and alignment with project goals
3. **Think about implementation** complexity

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## 📞 Getting Help

### Community Support

- **GitHub Discussions**: [Project Discussions](https://github.com/NosytLabs/nosytlabs-website/discussions)
- **GitHub Issues**: [Report Issues](https://github.com/NosytLabs/nosytlabs-website/issues)
- **Email**: [info@nosytlabs.com](mailto:info@nosytlabs.com)

### Documentation

- **README.md**: Project overview and setup
- **Wiki**: [Project Wiki](https://github.com/NosytLabs/nosytlabs-website/wiki)
- **Code Comments**: Inline documentation in source code

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to NosytLabs! Your efforts help make this project better for everyone.**
