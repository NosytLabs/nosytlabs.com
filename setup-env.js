#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create .env.local file if it doesn't exist
const envFilePath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envFilePath)) {
  console.log('Creating .env.local file...');
  
  if (fs.existsSync(envExamplePath)) {
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envFilePath, envExample);
    console.log('✅ .env.local created from .env.example');
    console.log('⚠️  Please update .env.local with your actual values');
  } else {
    const defaultEnv = `# NosytLabs Environment Variables
# Copy this file to .env.local and fill in your values

# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database (PostgreSQL with Neon)
DATABASE_URL=postgresql://username:password@localhost:5432/nosytlabs

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=NosytLabs <noreply@nosytlabs.com>
CONTACT_EMAIL=contact@nosytlabs.com

# Security
ENCRYPTION_KEY=your-32-character-encryption-key-here
JWT_SECRET=your-jwt-secret-key-here

# SMTP (Alternative)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Debug
DEBUG=true
LOG_LEVEL=debug
`;
    fs.writeFileSync(envFilePath, defaultEnv);
    console.log('✅ .env.local created with default values');
    console.log('⚠️  Please update .env.local with your actual values');
  }
} else {
  console.log('✅ .env.local already exists');
}

// Create database setup script
const setupScript = `#!/bin/bash

# Database Setup Script
# Run this to set up your PostgreSQL database

echo "Setting up NosytLabs database..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) not found. Please install PostgreSQL."
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set. Please set it in your .env.local file."
    exit 1
fi

# Run database initialization
echo "Creating database tables..."
psql $DATABASE_URL -f sql/init.sql

echo "✅ Database setup complete!"
echo "You can now start the development server with: npm run dev"
`;

const setupPath = path.join(process.cwd(), 'setup-database.sh');
if (!fs.existsSync(setupPath)) {
  fs.writeFileSync(setupPath, setupScript);
  fs.chmodSync(setupPath, '755');
  console.log('✅ setup-database.sh created');
}

// Create SQL initialization file
const sqlDir = path.join(process.cwd(), 'sql');
if (!fs.existsSync(sqlDir)) {
  fs.mkdirSync(sqlDir);
}

const initSql = `-- NosytLabs Database Initialization
-- Run this SQL to set up your PostgreSQL database

-- Contact forms table
CREATE TABLE IF NOT EXISTS contact_forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    service VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new'
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);

-- Project inquiries table
CREATE TABLE IF NOT EXISTS project_inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    project_type VARCHAR(100),
    budget VARCHAR(100),
    timeline VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_forms_email ON contact_forms(email);
CREATE INDEX IF NOT EXISTS idx_contact_forms_created_at ON contact_forms(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_project_inquiries_email ON project_inquiries(email);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Insert sample data for testing (optional)
-- INSERT INTO contact_forms (name, email, subject, message) VALUES
-- ('Test User', 'test@example.com', 'Test Subject', 'This is a test message');

echo 'Database tables created successfully!';
`;

const initSqlPath = path.join(sqlDir, 'init.sql');
if (!fs.existsSync(initSqlPath)) {
  fs.writeFileSync(initSqlPath, initSql);
  console.log('✅ sql/init.sql created');
}

console.log('\n🚀 Setup complete! Next steps:');
console.log('1. Update .env.local with your actual values');
console.log('2. Set up your PostgreSQL database');
console.log('3. Run: npm install');
console.log('4. Run: npm run dev');
console.log('\nFor production:');
console.log('1. Sign up for Resend (email service)');
console.log('2. Set up Neon PostgreSQL database');
console.log('3. Deploy to Vercel');