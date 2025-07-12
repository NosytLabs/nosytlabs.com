#!/usr/bin/env node

/**
 * Service Routes Verification Script
 * 
 * This script verifies that all service routes are properly configured
 * and can be generated successfully by Astro's static path generation.
 */

import { services, getServiceBySlug } from '../src/config/services.ts';
import { generateCanonicalUrl } from '../src/utils/pathResolvers.ts';

console.log('🔍 Verifying Service Routes Configuration...\n');

// Test 1: Verify services data structure
console.log('1. Checking services data structure...');
let hasErrors = false;

services.forEach((service, index) => {
  const requiredFields = ['name', 'slug', 'description', 'href', 'category', 'price', 'timeline', 'features'];
  const missingFields = requiredFields.filter(field => !service[field]);
  
  if (missingFields.length > 0) {
    console.error(`   ❌ Service ${index + 1} (${service.name || 'Unknown'}) missing fields: ${missingFields.join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`   ✅ Service: ${service.name} - All required fields present`);
  }
});

// Test 2: Verify slug format and uniqueness
console.log('\n2. Checking slug format and uniqueness...');
const slugs = new Set();
const slugPattern = /^[a-z0-9-]+$/;

services.forEach(service => {
  // Check slug format
  if (!slugPattern.test(service.slug)) {
    console.error(`   ❌ Invalid slug format: "${service.slug}" (should be lowercase, alphanumeric, and hyphens only)`);
    hasErrors = true;
  }
  
  // Check slug uniqueness
  if (slugs.has(service.slug)) {
    console.error(`   ❌ Duplicate slug detected: "${service.slug}"`);
    hasErrors = true;
  } else {
    slugs.add(service.slug);
    console.log(`   ✅ Slug: ${service.slug} - Valid format and unique`);
  }
});

// Test 3: Verify getServiceBySlug function
console.log('\n3. Testing getServiceBySlug function...');
services.forEach(service => {
  const retrieved = getServiceBySlug(service.slug);
  if (!retrieved || retrieved.slug !== service.slug) {
    console.error(`   ❌ getServiceBySlug failed for slug: "${service.slug}"`);
    hasErrors = true;
  } else {
    console.log(`   ✅ getServiceBySlug("${service.slug}") - Working correctly`);
  }
});

// Test 4: Verify canonical URL generation
console.log('\n4. Testing canonical URL generation...');
const baseUrl = 'https://nosytlabs.com'; // From astro.config.mjs site setting
services.forEach(service => {
  try {
    const canonicalUrl = generateCanonicalUrl(service.href, baseUrl);
    if (!canonicalUrl || !canonicalUrl.startsWith('http')) {
      console.error(`   ❌ Invalid canonical URL for ${service.slug}: "${canonicalUrl}"`);
      hasErrors = true;
    } else {
      console.log(`   ✅ Canonical URL for ${service.slug}: ${canonicalUrl}`);
    }
  } catch (error) {
    console.error(`   ❌ Error generating canonical URL for ${service.slug}: ${error.message}`);
    hasErrors = true;
  }
});

// Test 5: Verify SEO metadata completeness
console.log('\n5. Checking SEO metadata completeness...');
services.forEach(service => {
  const issues = [];
  
  if (service.description.length < 50) {
    issues.push('Description too short (< 50 chars)');
  }
  if (service.description.length > 160) {
    issues.push('Description too long (> 160 chars)');
  }
  if (!service.metadata?.keywords || service.metadata.keywords.length === 0) {
    issues.push('Missing keywords');
  }
  
  if (issues.length > 0) {
    console.error(`   ❌ SEO issues for ${service.slug}: ${issues.join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`   ✅ SEO metadata for ${service.slug} - Complete and optimal`);
  }
});

// Test 6: Verify icon mapping
console.log('\n6. Checking icon availability...');
const availableIcons = ['Globe', 'Zap', 'Bot', 'Lightbulb', 'Smartphone', 'Settings'];
services.forEach(service => {
  if (!availableIcons.includes(service.icon)) {
    console.error(`   ❌ Icon "${service.icon}" not available in iconMap for service: ${service.slug}`);
    hasErrors = true;
  } else {
    console.log(`   ✅ Icon "${service.icon}" available for service: ${service.slug}`);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.error('❌ VERIFICATION FAILED - Please fix the issues above before building');
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASSED - Service routes are properly configured!');
  console.log(`📊 Total services verified: ${services.length}`);
  console.log('🚀 Ready for production build');
}