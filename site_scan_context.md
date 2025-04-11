# Comprehensive Site Scan & Analysis Context

## Objective
Conduct a full site scan and analysis for the project, covering:
- Code quality (JavaScript/TypeScript)
- Style quality (CSS)
- Performance (Lighthouse)
- Accessibility (axe-core)
- Image optimization

## Technical Constraints
- Non-destructive: analysis only, no code changes at this stage
- Use MCP tools where available for efficiency and best practices
- Aggregate findings and recommendations in this context file

## Task Decomposition

### 1. Code Quality Audit (ESLint)
- Scope: src/, server/, public/scripts/
- Tool: site-optimizer-mcp (run_eslint)
- Deliverable: List of code issues, warnings, and recommendations

### 2. Style Quality Audit (Stylelint)
- Scope: src/styles/, public/styles/
- Tool: site-optimizer-mcp (run_stylelint)
- Deliverable: List of style issues, warnings, and recommendations

### 3. Performance Audit (Lighthouse)
- Scope: Main site URL (local or deployed)
- Tool: site-optimizer-mcp (run_lighthouse)
- Deliverable: Lighthouse report with performance, SEO, best practices, and PWA scores

### 4. Accessibility Audit (axe-core)
- Scope: Main site URL (local or deployed)
- Tool: site-optimizer-mcp (run_accessibility_audit)
- Deliverable: Accessibility issues and recommendations

### 5. Image Optimization Audit
- Scope: images/, public/images/
- Tool: site-optimizer-mcp (optimize_images, dry-run/report mode)
- Deliverable: List of optimizable images and potential savings

## Acceptance Criteria
- Each audit produces a clear, actionable report
- All findings are aggregated and prioritized in this context file
- Recommendations are specific, feasible, and aligned with best practices

## Next Steps
- Assign each audit as a subtask to technical experts (code mode)
- Aggregate results and synthesize recommendations upon completion