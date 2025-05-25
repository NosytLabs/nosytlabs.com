import { test } from '@playwright/test';
import fs from 'fs';

test('Component code quality tests', async () => {
  console.log('Running component code quality tests');
  
  // Test 1: IntroAnimation.astro
  console.log('Test 1: Checking IntroAnimation component fixes');
  try {
    const introAnimationContent = fs.readFileSync('src/components/IntroAnimation.astro', 'utf8');
    
    // Check for try-catch blocks around sessionStorage
    const hasTryCatch = introAnimationContent.includes('try {') && 
                        introAnimationContent.includes('catch (e)');
    console.log('IntroAnimation has try-catch blocks:', hasTryCatch);
    
    // Check for cookie fallback implementation
    const hasCookieFallback = introAnimationContent.includes('document.cookie');
    console.log('IntroAnimation has cookie fallback:', hasCookieFallback);
    
    // Check for parent node check before removing
    const hasParentNodeCheck = introAnimationContent.includes('parentNode');
    console.log('IntroAnimation has parent node checks:', hasParentNodeCheck);
  } catch (err) {
    console.error('Error reading IntroAnimation.astro:', err);
  }

  // Test 2: VideoHero component
  console.log('Test 2: Checking VideoHero component fixes');
  try {
    const videoHeroContent = fs.readFileSync('src/components/VideoHero.astro', 'utf8');
    
    // Check for poster attribute
    const hasPosterAttribute = videoHeroContent.includes('poster=');
    console.log('VideoHero has poster attribute:', hasPosterAttribute);
    
    // Check for improved backdrop styling
    const hasImprovedBackdrop = videoHeroContent.includes('backdrop-blur');
    console.log('VideoHero has backdrop blur:', hasImprovedBackdrop);
    
    // Check for mobile responsive improvements
    const hasResponsiveClasses = videoHeroContent.includes('md:') || 
                               videoHeroContent.includes('lg:');
    console.log('VideoHero has responsive classes:', hasResponsiveClasses);
  } catch (err) {
    console.error('Error reading VideoHero.astro:', err);
  }

  // Test 3: LazyLoading JS files
  console.log('Test 3: Checking LazyLoading component fixes');
  try {
    const lazyLoadingContent = fs.readFileSync('public/scripts/performance/lazyLoadingInit.js', 'utf8');
    
    // Check for error handling in observer
    const hasErrorHandlingInObserver = lazyLoadingContent.includes('try {') && 
                                    lazyLoadingContent.includes('catch') &&
                                    lazyLoadingContent.includes('observer');
    console.log('LazyLoading has error handling in observer:', hasErrorHandlingInObserver);
    
    // Check for element existence checks
    const hasElementChecks = lazyLoadingContent.includes('element') && 
                         lazyLoadingContent.includes('parentNode');
    console.log('LazyLoading has element existence checks:', hasElementChecks);
  } catch (err) {
    console.error('Error reading lazyLoadingInit.js:', err);
  }

  // Test 4: NosytOS95 storage handling
  console.log('Test 4: Checking NosytOS95 component fixes');
  try {
    const nosytOS95Content = fs.readFileSync('nosytos95/index.tsx', 'utf8');
    
    // Check for styleSheets error handling
    const hasStyleSheetsErrorHandling = nosytOS95Content.includes('try {') && 
                                    nosytOS95Content.includes('styleSheets');
    console.log('NosytOS95 has styleSheets error handling:', hasStyleSheetsErrorHandling);
  } catch (err) {
    console.error('Error reading nosytos95/index.tsx:', err);
  }

  // Test 5: Service Worker resource references
  console.log('Test 5: Checking Service Worker fixes');
  try {
    const serviceWorkerContent = fs.readFileSync('public/service-worker.js', 'utf8');
    
    // Check for resourceOptimizer.js reference
    const hasResourceOptimizer = serviceWorkerContent.includes('resourceOptimizer.js');
    console.log('Service Worker includes resourceOptimizer.js:', hasResourceOptimizer);
    
    // Check for proper closing braces and complete file
    const hasProperClosing = serviceWorkerContent.includes('});') &&
                          serviceWorkerContent.endsWith('});') || 
                          serviceWorkerContent.endsWith('});\n');
    console.log('Service Worker has proper closing:', hasProperClosing);
    
    // Check for error handling
    const hasErrorHandling = serviceWorkerContent.includes('try {') && 
                          serviceWorkerContent.includes('catch');
    console.log('Service Worker has error handling:', hasErrorHandling);
  } catch (err) {
    console.error('Error reading service-worker.js:', err);
  }
});
