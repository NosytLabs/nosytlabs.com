# New Unified Design System

This document outlines the new, unified design system for the application. The goal is to create a more polished, professional, and cohesive user experience.

## 1. Color Palette

The color palette is the foundation of the design system. It establishes a clear visual hierarchy and reinforces the brand identity.

### Primary Color: Purple

The primary color is used for key actions, highlights, and to draw the user's attention to important elements.

-   **Primary:** `var(--brand-purple-500)` - #a855f7
-   **Primary Darker:** `var(--brand-purple-600)` - #9333ea
-   **Primary Lighter:** `var(--brand-purple-400)` - #c084fc

### Secondary Color: Orange

The secondary color is used for less prominent actions, secondary information, and to complement the primary color.

-   **Secondary:** `var(--brand-orange-500)` - #f97316
-   **Secondary Darker:** `var(--brand-orange-600)` - #ea580c
-   **Secondary Lighter:** `var(--brand-orange-400)` - #fb923c

### Neutral Colors

Neutral colors are used for text, backgrounds, and borders to create a clean and readable interface.

-   **Text Primary:** `var(--neutral-900)` / `var(--neutral-100)` (dark mode)
-   **Text Secondary:** `var(--neutral-600)` / `var(--neutral-400)` (dark mode)
-   **Background Primary:** `var(--neutral-0)` / `var(--neutral-900)` (dark mode)
-   **Background Secondary:** `var(--neutral-100)` / `var(--neutral-800)` (dark mode)
-   **Border:** `var(--neutral-200)` / `var(--neutral-700)` (dark mode)

### Semantic Colors

Semantic colors are used to convey specific meanings, such as success, warning, or danger.

-   **Success:** `var(--semantic-success-500)` - #22c55e
-   **Warning:** `var(--semantic-warning-500)` - #f59e0b
-   **Danger:** `var(--semantic-danger-500)` - #ef4444
-   **Info:** `var(--semantic-info-500)` - #3b82f6

## 2. Typography

The typography is designed to be clean, legible, and modern.

-   **Sans-serif:** 'Inter', system-ui, sans-serif (`--font-family-sans`)
-   **Monospace:** 'JetBrains Mono', Menlo, Monaco, monospace (`--font-family-mono`)

The font size scale remains the same, providing a consistent hierarchy for all text elements.

## 3. Spacing

The spacing scale is based on a 4px grid, ensuring consistent and harmonious layouts. All existing spacing tokens will be maintained.

## 4. Component Styles

To ensure consistency, we are simplifying the variants for our core UI components.

### Buttons

The following button variants will be supported:

-   **Primary:** The default button style, used for the main call-to-action.
    -   `bg-primary-500 text-white hover:bg-primary-600`
-   **Secondary:** For secondary actions that need to be distinct from the primary action.
    -   `bg-secondary-500 text-white hover:bg-secondary-600`
-   **Outline:** For less prominent actions, such as "Cancel" or "Go Back."
    -   `border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50`
-   **Ghost:** For actions that should be subtle and not distract from the main content.
    -   `bg-transparent text-neutral-700 hover:bg-neutral-100`
-   **Link:** For actions that navigate to another page.
    -   `bg-transparent text-primary-500 underline-offset-4 hover:underline`

### Cards

The following card variants will be supported:

-   **Default:** The standard card style for most content.
    -   `bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700`
-   **Featured:** To highlight important content or special offers.
    -   `bg-white dark:bg-neutral-800 border-2 border-primary-500 shadow-lg`
-   **Hoverable:** Adds a subtle lift and shadow effect on hover, ideal for interactive cards.
    -   `nosyt-card-hover cursor-pointer`

## 5. Implementation Plan

This design system will be implemented in a separate task. The implementation will involve:

1.  Updating the CSS custom properties in `src/styles/global.css`.
2.  Refactoring the `buttonVariants` and `cardVariants` in their respective component files.
3.  Updating all instances of the old variants throughout the application.

This new design system will bring a new level of professionalism and consistency to the application, making it more enjoyable and intuitive for our users.