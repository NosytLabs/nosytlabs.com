# NosytLabs Design System

This document serves as the single source of truth for the NosytLabs website's design system. It ensures a cohesive and unified user experience across all pages and components.

## 1. Color Palette

Our color palette is defined in `src/tokens/design-tokens.js` and is composed of brand colors, semantic colors, and a neutral grayscale system.

### 1.1. Primary Colors

The primary color palette is based on our brand's core colors: purple and orange.

#### Purple

*   **Primary:** `var(--brand-purple-500)` - `#a855f7`
*   **Shades:** A full range from `50` to `900` is available.

| Name                 | Hex       | Variable                  |
| -------------------- | --------- | ------------------------- |
| `brand-purple-50`    | `#faf5ff` | `var(--brand-purple-50)`  |
| `brand-purple-100`   | `#f3e8ff` | `var(--brand-purple-100)` |
| `brand-purple-200`   | `#e9d5ff` | `var(--brand-purple-200)` |
| `brand-purple-300`   | `#d8b4fe` | `var(--brand-purple-300)` |
| `brand-purple-400`   | `#c084fc` | `var(--brand-purple-400)` |
| `brand-purple-500`   | `#a855f7` | `var(--brand-purple-500)` |
| `brand-purple-600`   | `#9333ea` | `var(--brand-purple-600)` |
| `brand-purple-700`   | `#7c3aed` | `var(--brand-purple-700)` |
| `brand-purple-800`   | `#6d28d9` | `var(--brand-purple-800)` |
| `brand-purple-900`   | `#581c87` | `var(--brand-purple-900)` |

#### Orange

*   **Secondary:** `var(--brand-orange-500)` - `#f97316`
*   **Shades:** A full range from `50` to `900` is available.

| Name                 | Hex       | Variable                  |
| -------------------- | --------- | ------------------------- |
| `brand-orange-50`    | `#fff7ed` | `var(--brand-orange-50)`  |
| `brand-orange-100`   | `#ffedd5` | `var(--brand-orange-100)` |
| `brand-orange-200`   | `#fed7aa` | `var(--brand-orange-200)` |
| `brand-orange-300`   | `#fdba74` | `var(--brand-orange-300)` |
| `brand-orange-400`   | `#fb923c` | `var(--brand-orange-400)` |
| `brand-orange-500`   | `#f97316` | `var(--brand-orange-500)` |
| `brand-orange-600`   | `#ea580c` | `var(--brand-orange-600)` |
| `brand-orange-700`   | `#c2410c` | `var(--brand-orange-700)` |
| `brand-orange-800`   | `#9a3412` | `var(--brand-orange-800)` |
| `brand-orange-900`   | `#7c2d12` | `var(--brand-orange-900)` |

### 1.2. Semantic Colors

Semantic colors are used for UI states like success, warning, and danger.

*   **Success:** `var(--semantic-success-500)` - `#22c55e`
*   **Warning:** `var(--semantic-warning-500)` - `#f59e0b`
*   **Danger:** `var(--semantic-danger-500)` - `#ef4444`
*   **Info:** `var(--semantic-info-500)` - `#3b82f6`

### 1.3. Neutral Colors

The neutral palette is used for text, backgrounds, and borders.

| Name            | Hex       | Variable               |
| --------------- | --------- | ---------------------- |
| `neutral-0`     | `#ffffff` | `var(--neutral-0)`     |
| `neutral-50`    | `#fafafa` | `var(--neutral-50)`    |
| `neutral-100`   | `#f5f5f5` | `var(--neutral-100)`   |
| `neutral-200`   | `#e5e5e5` | `var(--neutral-200)`   |
| `neutral-300`   | `#d4d4d4` | `var(--neutral-300)`   |
| `neutral-400`   | `#a3a3a3` | `var(--neutral-400)`   |
| `neutral-500`   | `#737373` | `var(--neutral-500)`   |
| `neutral-600`   | `#525252` | `var(--neutral-600)`   |
| `neutral-700`   | `#404040` | `var(--neutral-700)`   |
| `neutral-800`   | `#262626` | `var(--neutral-800)`   |
| `neutral-900`   | `#171717` | `var(--neutral-900)`   |
| `neutral-950`   | `#0a0a0a` | `var(--neutral-950)`   |
| `neutral-1000`  | `#000000` | `var(--neutral-1000)`  |

## 2. Typography

Our typographic scale is designed for clarity and readability, using the "Inter" font family.

### 2.1. Font Families

*   **Sans-serif:** `Inter`, `system-ui`, `sans-serif`
*   **Monospace:** `JetBrains Mono`, `Menlo`, `Monaco`, `monospace`

### 2.2. Font Sizes

| Name    | Size      | Pixels | Variable              |
| ------- | --------- | ------ | --------------------- |
| `xs`    | `0.75rem` | 12px   | `var(--font-size-xs)` |
| `sm`    | `0.875rem`| 14px   | `var(--font-size-sm)` |
| `base`  | `1rem`    | 16px   | `var(--font-size-base)`|
| `lg`    | `1.125rem`| 18px   | `var(--font-size-lg)` |
| `xl`    | `1.25rem` | 20px   | `var(--font-size-xl)` |
| `2xl`   | `1.5rem`  | 24px   | `var(--font-size-2xl)`|
| `3xl`   | `1.875rem`| 30px   | `var(--font-size-3xl)`|
| `4xl`   | `2.25rem` | 36px   | `var(--font-size-4xl)`|
| `5xl`   | `3rem`    | 48px   | `var(--font-size-5xl)`|
| `6xl`   | `3.75rem` | 60px   | `var(--font-size-6xl)`|

## 3. Spacing

We use a consistent spacing scale based on a `4px` grid.

| Name | Size      | Pixels | Variable           |
| ---- | --------- | ------ | ------------------ |
| `1`  | `0.25rem` | 4px    | `var(--spacing-1)` |
| `2`  | `0.5rem`  | 8px    | `var(--spacing-2)` |
| `3`  | `0.75rem` | 12px   | `var(--spacing-3)` |
| `4`  | `1rem`    | 16px   | `var(--spacing-4)` |
| `5`  | `1.25rem` | 20px   | `var(--spacing-5)` |
| `6`  | `1.5rem`  | 24px   | `var(--spacing-6)` |
| `8`  | `2rem`    | 32px   | `var(--spacing-8)` |
| `12` | `3rem`    | 48px   | `var(--spacing-12)`|
| `16` | `4rem`    | 64px   | `var(--spacing-16)`|
| `24` | `6rem`    | 96px   | `var(--spacing-24)`|

## 4. Layout

The `UnifiedLayout.astro` component provides a standardized structure for all pages.

*   **Max Width:** `1280px` (`var(--container-max-width)`)
*   **Padding:** `1rem` (`var(--container-padding)`) on mobile, with responsive adjustments for larger screens.

This ensures a consistent and predictable layout across the entire website.