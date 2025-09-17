# Project Tasks

## Phase 1: Typography Components
- [x] Ensure BrandHeading uses line-height variables for spacing consistency.
- [x] Implement BrandCode with variants, copy capability, CSS variables, and print styles to satisfy tests.
- [x] Pass brand-typography test suite locally.

## Phase 2: QA and Verification
- [x] Run full automated test suite to detect regressions.
- [x] Document issues by type and severity in problems.md with actionable recommendations.
- [x] Implement prioritized fixes for critical issues and re-test.
- [x] Run accessibility checks  
  - Automated: aXe across routes with timestamped per-route reports and axe-summary-*.json.
  - Aggregation: axe-issues-summary.json generated via npm run audit:axe:aggregate.
- [x] Assess functional integrity of components and routes.  
  - Automated: functional audit across routes with per-route and summary outputs.
- [x] Measure performance via build analysis and review warnings/errors.
  - Automated: perf audit across routes with per-route outputs and perf-summary.json.
- [x] Evaluate design consistency across pages (tokens, typography, spacing, colors).
- [x] Update this tasks.md as items are completed or added.
- [x] Accessibility Remediations
  - [x] Fix color contrast issues on '/', '/gallery', '/team', and '/projects/*' per axe-issues-summary.json
  - [x] Correct list semantics on '/services' (<ul>/<ol>/<li> structure)
