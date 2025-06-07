#!/usr/bin/env node

/**
 * Development Environment Manager
 * Handles port conflicts, server startup, and development optimizations
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 NosytLabs Development Environment Manager\n');

/**
 * Check if a port is in use
 */
async function isPortInUse(port) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync(`netstat -an | findstr :${port}`);
      return stdout.trim().length > 0;
    } else {
      const { stdout } = await execAsync(`lsof -i :${port}`);
      return stdout.trim().length > 0;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Find an available port starting from the given port
 */
async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  while (await isPortInUse(port)) {
    console.log(`⚠️  Port ${port} is in use, trying ${port + 1}...`);
    port++;
    if (port > startPort + 10) {
      throw new Error(`Could not find available port after ${startPort + 10}`);
    }
  }
  return port;
}

/**
 * Kill processes on specific ports
 */
async function killPortProcesses(port) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
      const lines = stdout.trim().split('\n');
      
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          try {
            await execAsync(`taskkill /F /PID ${pid}`);
            console.log(`✅ Killed process ${pid} on port ${port}`);
          } catch (error) {
            console.log(`⚠️  Could not kill process ${pid}: ${error.message}`);
          }
        }
      }
    } else {
      await execAsync(`lsof -ti :${port} | xargs kill -9`);
      console.log(`✅ Killed processes on port ${port}`);
    }
  } catch (error) {
    console.log(`⚠️  No processes found on port ${port} or could not kill them`);
  }
}

/**
 * Setup development environment
 */
async function setupDevEnvironment() {
  console.log('🔧 Setting up development environment...\n');

  // Check Node.js version
  const nodeVersion = process.version;
  console.log(`📦 Node.js version: ${nodeVersion}`);
  
  if (parseInt(nodeVersion.slice(1)) < 18) {
    console.log('⚠️  Warning: Node.js 18+ is recommended for optimal performance');
  }

  // Check if dependencies are installed
  const nodeModulesPath = path.join(rootDir, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    await execAsync('npm install', { cwd: rootDir });
    console.log('✅ Dependencies installed');
  }

  // Check for port conflicts
  console.log('🔍 Checking for port conflicts...');
  const mainPort = await findAvailablePort(3000);
  const hmrPort = await findAvailablePort(3001);

  if (mainPort !== 3000) {
    console.log(`⚠️  Port 3000 is in use. Will use port ${mainPort} instead.`);
    
    // Update astro config temporarily
    const configPath = path.join(rootDir, 'astro.config.mjs');
    let configContent = fs.readFileSync(configPath, 'utf8');
    configContent = configContent.replace(/port: 3000,/, `port: ${mainPort},`);
    fs.writeFileSync(configPath + '.tmp', configContent);
    console.log(`📝 Created temporary config with port ${mainPort}`);
  }

  if (hmrPort !== 3001) {
    console.log(`⚠️  HMR port 3001 is in use. Will use port ${hmrPort} instead.`);
  }

  return { mainPort, hmrPort };
}

/**
 * Start development server
 */
async function startDevServer(ports) {
  console.log('\n🚀 Starting development server...');
  
  const { mainPort, hmrPort } = ports;
  
  // Set environment variables
  process.env.NODE_ENV = 'development';
  process.env.ASTRO_DEV_PORT = mainPort.toString();
  process.env.ASTRO_HMR_PORT = hmrPort.toString();

  // Start the server
  const serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env }
  });

  // Handle server process events
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start development server:', error.message);
    process.exit(1);
  });

  serverProcess.on('close', (code) => {
    console.log(`\n🛑 Development server stopped with code ${code}`);
    
    // Cleanup temporary config
    const tempConfigPath = path.join(rootDir, 'astro.config.mjs.tmp');
    if (fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath);
      console.log('🧹 Cleaned up temporary configuration');
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    serverProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development server...');
    serverProcess.kill('SIGTERM');
  });

  console.log(`✅ Development server starting on http://localhost:${mainPort}`);
  console.log(`🔄 Hot Module Replacement on port ${hmrPort}`);
  console.log('📝 Press Ctrl+C to stop the server\n');
}

/**
 * Main execution
 */
async function main() {
  try {
    const command = process.argv[2];

    switch (command) {
      case 'kill':
        const portToKill = process.argv[3] || '3000';
        await killPortProcesses(parseInt(portToKill));
        break;
        
      case 'check':
        const port = process.argv[3] || '3000';
        const inUse = await isPortInUse(parseInt(port));
        console.log(`Port ${port} is ${inUse ? 'in use' : 'available'}`);
        break;
        
      case 'start':
      default:
        const ports = await setupDevEnvironment();
        await startDevServer(ports);
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { isPortInUse, findAvailablePort, killPortProcesses, setupDevEnvironment };
