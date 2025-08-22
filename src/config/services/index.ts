/**
 * Services Configuration Index
 * Centralized export of all service configurations and utility functions
 */

import { webDevelopmentServices } from './web-development';
import { aiIntegrationServices } from './ai-integration';
import { consultingServices } from './consulting';
import type { ServiceData } from './types';

// Combine all services
export const allServices: ServiceData[] = [
  ...webDevelopmentServices,
  ...aiIntegrationServices,
  ...consultingServices,
];

// Export individual service categories
export { webDevelopmentServices, aiIntegrationServices, consultingServices };

// Export types
export type { ServiceData, DetailedFeatureGroup, ServiceTestimonial } from './types';

// Utility functions
export const getServiceBySlug = (slug: string): ServiceData | undefined => {
  return allServices.find((service) => service.slug === slug);
};

export const getServicesByCategory = (category: string): ServiceData[] => {
  return allServices.filter((service) => service.category === category);
};

export const getPopularServices = (): ServiceData[] => {
  return allServices.filter((service) => service.popular);
};

export const getFeaturedServices = (limit: number = 3): ServiceData[] => {
  return allServices
    .filter((service) => service.popular)
    .slice(0, limit);
};

export const getServiceCategories = (): string[] => {
  const categories = new Set(allServices.map((service) => service.category));
  return Array.from(categories);
};

export const searchServices = (query: string): ServiceData[] => {
  const lowercaseQuery = query.toLowerCase();
  return allServices.filter(
    (service) =>
      service.name.toLowerCase().includes(lowercaseQuery) ||
      service.shortDescription.toLowerCase().includes(lowercaseQuery) ||
      service.description.toLowerCase().includes(lowercaseQuery) ||
      service.features.some((feature) =>
        feature.toLowerCase().includes(lowercaseQuery)
      ) ||
      (service.metadata.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(lowercaseQuery)
      ) ?? false)
  );
};

// Service options for form dropdowns
export const serviceOptions = allServices.map((service) => ({
  value: service.slug,
  label: service.name,
}));

// Default export for backward compatibility
export default {
  allServices,
  webDevelopmentServices,
  aiIntegrationServices,
  consultingServices,
  getServiceBySlug,
  getServicesByCategory,
  getPopularServices,
  getFeaturedServices,
  getServiceCategories,
  searchServices,
};