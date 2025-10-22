/**
 * Site Statistics Data Model
 * Single source of truth for all site-wide statistics
 */

export interface SiteStat {
  value: string;
  label: string;
  description: string;
}

export const siteStats = {
  projectsCompleted: {
    value: "1",
    label: "Open Source Project",
    description: "Presearch MCP Server on GitHub",
  },
  aiTools: {
    value: "AI-Powered",
    label: "Development",
    description: "Using Claude, Cursor, and modern AI tools",
  },
  delivery: {
    value: "Fast",
    label: "Turnaround",
    description: "AI-assisted development for speed",
  },
  yearsExperience: {
    value: "5+",
    label: "Years Experience",
    description: "In web development and AI",
  },
  technologiesUsed: {
    value: "Modern",
    label: "Tech Stack",
    description: "React, Astro, Next.js, TypeScript",
  },
  pricing: {
    value: "Affordable",
    label: "Pricing",
    description: "Solo dev rates, not agency prices",
  },
} as const;

/**
 * Get stats as an array for easy iteration
 */
export function getStatsArray(keys?: (keyof typeof siteStats)[]): SiteStat[] {
  if (keys) {
    return keys.map((key) => siteStats[key]);
  }
  return Object.values(siteStats);
}

/**
 * Get primary stats (most important 3)
 */
export function getPrimaryStats(): SiteStat[] {
  return [siteStats.projectsCompleted, siteStats.aiTools, siteStats.delivery];
}

/**
 * Get all stats
 */
export function getAllStats(): SiteStat[] {
  return getStatsArray();
}
