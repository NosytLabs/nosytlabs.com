// Build optimization script for Nosyt Labs
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function optimizeBuild() {
  console.log('Starting build optimization...');
  
  try {
    // Run Astro build
    console.log('Running Astro build...');
    const { stdout, stderr } = await execAsync('npm run build');
    
    if (stderr) {
      console.error('Build stderr:', stderr);
    }
    
    console.log('Build stdout:', stdout);
    console.log('Build completed successfully!');
    
    // Additional optimizations could be added here
    // For example, minifying additional assets, optimizing service worker, etc.
    
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

optimizeBuild();