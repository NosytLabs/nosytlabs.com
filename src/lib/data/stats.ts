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
    value: "47",
    label: "Projects Completed",
    description: "Successful deployments with measurable ROI"
  },
  trafficIncrease: {
    value: "150%",
    label: "Avg Traffic Increase",
    description: "For client websites post-optimization"
  },
  timeSaved: {
    value: "40+",
    label: "Hours Saved Weekly",
    description: "Through automation and AI integration"
  },
  clientSatisfaction: {
    value: "98%",
    label: "Client Satisfaction",
    description: "Based on post-project surveys"
  },
  yearsExperience: {
    value: "10+",
    label: "Years Experience",
    description: "In web development and AI"
  },
  technologiesUsed: {
    value: "50+",
    label: "Technologies",
    description: "Modern frameworks and tools"
  }
} as const;

/**
 * Get stats as an array for easy iteration
 */
export function getStatsArray(keys?: (keyof typeof siteStats)[]): SiteStat[] {
  if (keys) {
    return keys.map(key => siteStats[key]);
  }
  return Object.values(siteStats);
}

/**
 * Get primary stats (most important 3)
 */
export function getPrimaryStats(): SiteStat[] {
  return [
    siteStats.projectsCompleted,
    siteStats.trafficIncrease,
    siteStats.timeSaved
  ];
}

/**
 * Get all stats
 */
export function getAllStats(): SiteStat[] {
  return getStatsArray();
}
