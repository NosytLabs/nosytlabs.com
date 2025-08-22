/**
 * Color Contrast Utilities for WCAG AA Compliance
 * Provides color contrast calculation, validation, and enhancement utilities
 */

import { logger } from './logger';

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

export interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  passes: {
    normalText: boolean;
    largeText: boolean;
    uiComponents: boolean;
  };
}

export class ColorContrastManager {
  private static instance: ColorContrastManager;

  // WCAG contrast ratio thresholds
  private readonly CONTRAST_THRESHOLDS = {
    AAA_NORMAL: 7,
    AAA_LARGE: 4.5,
    AA_NORMAL: 4.5,
    AA_LARGE: 3,
    UI_COMPONENTS: 3,
  };

  public static getInstance(): ColorContrastManager {
    if (!ColorContrastManager.instance) {
      ColorContrastManager.instance = new ColorContrastManager();
    }
    return ColorContrastManager.instance;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  public calculateContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);

    if (!rgb1 || !rgb2) {
      throw new Error('Invalid color format');
    }

    const luminance1 = this.calculateLuminance(rgb1);
    const luminance2 = this.calculateLuminance(rgb2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get comprehensive contrast analysis
   */
  public analyzeContrast(foreground: string, background: string): ContrastResult {
    const ratio = this.calculateContrastRatio(foreground, background);

    let level: ContrastResult['level'];
    if (ratio >= this.CONTRAST_THRESHOLDS.AAA_NORMAL) {
      level = 'AAA';
    } else if (ratio >= this.CONTRAST_THRESHOLDS.AA_NORMAL) {
      level = 'AA';
    } else if (ratio >= this.CONTRAST_THRESHOLDS.AA_LARGE) {
      level = 'A';
    } else {
      level = 'FAIL';
    }

    return {
      ratio,
      level,
      passes: {
        normalText: ratio >= this.CONTRAST_THRESHOLDS.AA_NORMAL,
        largeText: ratio >= this.CONTRAST_THRESHOLDS.AA_LARGE,
        uiComponents: ratio >= this.CONTRAST_THRESHOLDS.UI_COMPONENTS,
      },
    };
  }

  /**
   * Find the best contrasting color from a palette
   */
  public findBestContrast(
    baseColor: string,
    palette: string[],
    minRatio: number = this.CONTRAST_THRESHOLDS.AA_NORMAL
  ): { color: string; ratio: number } | null {
    let bestColor: string | null = null;
    let bestRatio = 0;

    for (const color of palette) {
      try {
        const ratio = this.calculateContrastRatio(baseColor, color);
        if (ratio >= minRatio && ratio > bestRatio) {
          bestColor = color;
          bestRatio = ratio;
        }
      } catch (_error) {
        logger.warn(`Invalid color in palette: ${color}`, 'color-contrast');
      }
    }

    return bestColor ? { color: bestColor, ratio: bestRatio } : null;
  }

  /**
   * Adjust color to meet minimum contrast ratio
   */
  public adjustColorForContrast(
    foreground: string,
    background: string,
    targetRatio: number = this.CONTRAST_THRESHOLDS.AA_NORMAL
  ): string {
    const currentRatio = this.calculateContrastRatio(foreground, background);

    if (currentRatio >= targetRatio) {
      return foreground; // Already meets requirements
    }

    const fgRgb = this.parseColor(foreground);
    const bgRgb = this.parseColor(background);

    if (!fgRgb || !bgRgb) {
      throw new Error('Invalid color format');
    }

    const bgLuminance = this.calculateLuminance(bgRgb);

    // Determine if we should make the foreground lighter or darker
    const shouldLighten = bgLuminance < 0.5;

    return this.adjustLuminance(fgRgb, bgLuminance, targetRatio, shouldLighten);
  }

  /**
   * Validate color combinations in a design system
   */
  public validateColorSystem(colorSystem: { [key: string]: string }): {
    [combination: string]: ContrastResult;
  } {
    const results: { [combination: string]: ContrastResult } = {};
    const colors = Object.entries(colorSystem);

    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const colorEntry1 = colors[i];
        const colorEntry2 = colors[j];

        if (!colorEntry1 || !colorEntry2) continue;

        const [name1, color1] = colorEntry1;
        const [name2, color2] = colorEntry2;

        const combinationName = `${name1}-on-${name2}`;
        results[combinationName] = this.analyzeContrast(color1, color2);
      }
    }

    return results;
  }

  /**
   * Generate accessible color variations
   */
  public generateAccessibleVariations(
    baseColor: string,
    backgroundColors: string[]
  ): { [background: string]: string } {
    const variations: { [background: string]: string } = {};

    for (const bgColor of backgroundColors) {
      try {
        const adjustedColor = this.adjustColorForContrast(baseColor, bgColor);
        variations[bgColor] = adjustedColor;
      } catch (_error) {
        logger.warn(
          `Could not generate variation for ${baseColor} on ${bgColor}`,
          'color-contrast'
        );
        variations[bgColor] = baseColor;
      }
    }

    return variations;
  }

  /**
   * Parse color string to RGB values
   */
  private parseColor(color: string): ColorRGB | null {
    // Handle CSS custom properties
    if (color.startsWith('var(')) {
      const computedColor = getComputedStyle(document.documentElement)
        .getPropertyValue(color.slice(4, -1))
        .trim();
      if (computedColor) {
        color = computedColor;
      }
    }

    // Remove whitespace
    color = color.trim();

    // Handle hex colors
    if (color.startsWith('#')) {
      return this.parseHexColor(color);
    }

    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
      return this.parseRgbColor(color);
    }

    // Handle hsl/hsla colors
    if (color.startsWith('hsl')) {
      return this.parseHslColor(color);
    }

    // Handle named colors
    return this.parseNamedColor(color);
  }

  /**
   * Parse hex color to RGB
   */
  private parseHexColor(hex: string): ColorRGB | null {
    const cleanHex = hex.replace('#', '');

    if (cleanHex.length === 3) {
      const r = cleanHex[0];
      const g = cleanHex[1];
      const b = cleanHex[2];
      if (!r || !g || !b) return null;

      return {
        r: parseInt(r + r, 16),
        g: parseInt(g + g, 16),
        b: parseInt(b + b, 16),
      };
    }

    if (cleanHex.length === 6) {
      return {
        r: parseInt(cleanHex.substring(0, 2), 16),
        g: parseInt(cleanHex.substring(2, 4), 16),
        b: parseInt(cleanHex.substring(4, 6), 16),
      };
    }

    return null;
  }

  /**
   * Parse RGB color string
   */
  private parseRgbColor(rgb: string): ColorRGB | null {
    const match = rgb.match(/rgba?\(([^)]+)\)/);
    if (!match || !match[1]) return null;

    const values = match[1].split(',').map(v => parseFloat(v.trim()));
    if (
      values.length < 3 ||
      values[0] === undefined ||
      values[1] === undefined ||
      values[2] === undefined
    )
      return null;

    return {
      r: Math.round(values[0]),
      g: Math.round(values[1]),
      b: Math.round(values[2]),
    };
  }

  /**
   * Parse HSL color string and convert to RGB
   */
  private parseHslColor(hsl: string): ColorRGB | null {
    const match = hsl.match(/hsla?\(([^)]+)\)/);
    if (!match || !match[1]) return null;

    const values = match[1].split(',').map(v => parseFloat(v.trim()));
    if (
      values.length < 3 ||
      values[0] === undefined ||
      values[1] === undefined ||
      values[2] === undefined
    )
      return null;

    const h = values[0] / 360;
    const s = values[1] / 100;
    const l = values[2] / 100;

    return this.hslToRgb({ h, s, l });
  }

  /**
   * Parse named color using canvas
   */
  private parseNamedColor(color: string): ColorRGB | null {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);

    const imageData = ctx.getImageData(0, 0, 1, 1).data;
    const r = imageData[0];
    const g = imageData[1];
    const b = imageData[2];

    if (r === undefined || g === undefined || b === undefined) {
      return null;
    }

    return { r, g, b };
  }

  /**
   * Convert HSL to RGB
   */
  private hslToRgb(hsl: ColorHSL): ColorRGB {
    const { h, s, l } = hsl;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    if (s === 0) {
      const gray = Math.round(l * 255);
      return { r: gray, g: gray, b: gray };
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

    return { r, g, b };
  }

  /**
   * Calculate relative luminance of a color
   */
  private calculateLuminance(rgb: ColorRGB): number {
    const { r, g, b } = rgb;

    // Convert to sRGB
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    // Apply gamma correction
    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    // Calculate luminance
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  /**
   * Adjust luminance to meet target contrast ratio
   */
  private adjustLuminance(
    rgb: ColorRGB,
    backgroundLuminance: number,
    targetRatio: number,
    shouldLighten: boolean
  ): string {
    let { r, g, b } = rgb;
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const currentLuminance = this.calculateLuminance({ r, g, b });
      const currentRatio =
        backgroundLuminance > currentLuminance
          ? (backgroundLuminance + 0.05) / (currentLuminance + 0.05)
          : (currentLuminance + 0.05) / (backgroundLuminance + 0.05);

      if (currentRatio >= targetRatio) {
        break;
      }

      // Adjust RGB values
      const adjustment = shouldLighten ? 5 : -5;
      r = Math.max(0, Math.min(255, r + adjustment));
      g = Math.max(0, Math.min(255, g + adjustment));
      b = Math.max(0, Math.min(255, b + adjustment));

      attempts++;
    }

    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Convert RGB to hex
   */
  public rgbToHex(rgb: ColorRGB): string {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  /**
   * Get readable text color for any background
   */
  public getReadableTextColor(backgroundColor: string): string {
    const whiteContrast = this.calculateContrastRatio('var(--color-neutral-0)', backgroundColor);
    const blackContrast = this.calculateContrastRatio('var(--color-neutral-900)', backgroundColor);

    return whiteContrast > blackContrast ? 'var(--color-neutral-0)' : 'var(--color-neutral-900)';
  }
}

// Export singleton instance
export const colorContrastManager = ColorContrastManager.getInstance();

// Utility functions
export const calculateContrastRatio = (color1: string, color2: string) =>
  colorContrastManager.calculateContrastRatio(color1, color2);

export const analyzeContrast = (foreground: string, background: string) =>
  colorContrastManager.analyzeContrast(foreground, background);

export const adjustColorForContrast = (
  foreground: string,
  background: string,
  targetRatio?: number
) => colorContrastManager.adjustColorForContrast(foreground, background, targetRatio);

export const getReadableTextColor = (backgroundColor: string) =>
  colorContrastManager.getReadableTextColor(backgroundColor);

export const validateColorSystem = (colorSystem: { [key: string]: string }) =>
  colorContrastManager.validateColorSystem(colorSystem);
