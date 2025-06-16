#!/usr/bin/env node

/**
 * Environment Setup Script for NosytLabs
 * Helps set up environment variables and validate configuration
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EnvironmentSetup {
  constructor() {
    this.projectRoot = path.dirname(__dirname);
    this.envPath = path.join(this.projectRoot, '.env');
    this.envExamplePath = path.join(this.projectRoot, '.env.example');
  }

  // Generate secure random strings
  generateSecureKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  generateJWTSecret() {
    return crypto.randomBytes(64).toString('base64');
  }

  // Check if .env file exists
  envExists() {
    return fs.existsSync(this.envPath);
  }

  // Create .env from template
  async createEnvFromTemplate() {
    console.log('🔧 Setting up environment variables...');

    if (!fs.existsSync(this.envExamplePath)) {
      console.error('❌ .env.example file not found');
      return false;
    }

    let envContent = fs.readFileSync(this.envExamplePath, 'utf-8');

    // Generate secure keys
    const encryptionKey = this.generateSecureKey(32);
    const jwtSecret = this.generateJWTSecret();

    // Replace placeholders with generated values
    envContent = envContent
      .replace('[YOUR_32_CHAR_ENCRYPTION_KEY]', encryptionKey)
      .replace('[YOUR_JWT_SECRET_KEY]', jwtSecret)
      .replace('development', 'development')
      .replace('http://localhost:4329', 'http://localhost:4329');

    // Write to .env file
    fs.writeFileSync(this.envPath, envContent);
    console.log('✅ .env file created successfully');
    console.log('🔑 Generated secure encryption key and JWT secret');
    
    return true;
  }

  // Validate environment variables
  async validateEnvironment() {
    console.log('🔍 Validating environment configuration...');

    if (!this.envExists()) {
      console.error('❌ .env file not found');
      return false;
    }

    // Load environment variables
    try {
      const dotenv = await import('dotenv');
      dotenv.config();
    } catch (error) {
      // dotenv not available, skip
    }

    const requiredVars = [
      'DATABASE_URL',
      'RESEND_API_KEY',
      'ENCRYPTION_KEY',
      'JWT_SECRET'
    ];

    const missingVars = [];
    const placeholderVars = [];

    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (!value) {
        missingVars.push(varName);
      } else if (value.includes('[YOUR_') || value.includes('your-')) {
        placeholderVars.push(varName);
      }
    });

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars);
      return false;
    }

    if (placeholderVars.length > 0) {
      console.warn('⚠️ Environment variables still contain placeholders:', placeholderVars);
      console.warn('   Please update these with actual values');
      return false;
    }

    console.log('✅ Environment validation passed');
    return true;
  }

  // Display setup instructions
  displayInstructions() {
    console.log('\n📋 SETUP INSTRUCTIONS:');
    console.log('');
    console.log('1. 🗄️ Database (Supabase):');
    console.log('   - Go to: https://supabase.com/dashboard/project/jvorgukgexezucwxygdi/settings/database');
    console.log('   - Copy the connection string');
    console.log('   - Update DATABASE_URL in .env');
    console.log('');
    console.log('2. 📧 Email (Resend):');
    console.log('   - Go to: https://resend.com/api-keys');
    console.log('   - Create a new API key');
    console.log('   - Update RESEND_API_KEY in .env');
    console.log('');
    console.log('3. 🔐 Supabase API Keys:');
    console.log('   - Go to: https://supabase.com/dashboard/project/jvorgukgexezucwxygdi/settings/api');
    console.log('   - Copy the anon and service role keys');
    console.log('   - Update SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in .env');
    console.log('');
    console.log('4. 📊 Analytics (Optional):');
    console.log('   - Update VERCEL_ANALYTICS_ID and GOOGLE_ANALYTICS_ID if needed');
    console.log('');
    console.log('5. 🧪 Test the setup:');
    console.log('   - Run: npm run dev');
    console.log('   - Check: http://localhost:4329');
    console.log('');
  }

  // Main setup process
  async setup() {
    console.log('🚀 NosytLabs Environment Setup');
    console.log('================================');

    try {
      if (this.envExists()) {
        console.log('📄 .env file already exists');
        
        if (await this.validateEnvironment()) {
          console.log('✅ Environment is properly configured');
          return true;
        } else {
          console.log('⚠️ Environment needs manual configuration');
          this.displayInstructions();
          return false;
        }
      } else {
        const created = await this.createEnvFromTemplate();
        if (created) {
          console.log('📝 Please update the .env file with your actual API keys and credentials');
          this.displayInstructions();
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      return false;
    }
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new EnvironmentSetup();
  setup.setup().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export default EnvironmentSetup;
