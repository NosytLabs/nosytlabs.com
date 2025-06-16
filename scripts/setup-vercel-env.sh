#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this script to configure all required environment variables for NosytLabs

echo "🚀 Setting up Vercel Environment Variables for NosytLabs"
echo "======================================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Logging into Vercel..."
vercel login

# Link project (if not already linked)
echo "🔗 Linking project..."
vercel link

echo "📝 Setting up environment variables..."

# Sentry Configuration
echo "Setting up Sentry..."
vercel env add SENTRY_DSN production
vercel env add SENTRY_AUTH_TOKEN production

# Database Configuration
echo "Setting up Database..."
vercel env add DATABASE_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Email Configuration
echo "Setting up Email..."
vercel env add RESEND_API_KEY production
vercel env add CONTACT_EMAIL production
vercel env add EMAIL_FROM production
vercel env add EMAIL_REPLY_TO production

# Application Configuration
echo "Setting up Application..."
vercel env add NODE_ENV production
vercel env add APP_URL production
vercel env add APP_NAME production
vercel env add APP_VERSION production

# Security Configuration
echo "Setting up Security..."
vercel env add ENCRYPTION_KEY production
vercel env add JWT_SECRET production
vercel env add RATE_LIMIT_MAX production
vercel env add RATE_LIMIT_WINDOW production

# Feature Flags
echo "Setting up Feature Flags..."
vercel env add ENABLE_ANALYTICS production
vercel env add ENABLE_EMAIL_NOTIFICATIONS production
vercel env add ENABLE_CONTACT_FORM production
vercel env add ENABLE_NEWSLETTER production
vercel env add ENABLE_PAYMENTS production

# CORS & Security
echo "Setting up CORS & Security..."
vercel env add ALLOWED_ORIGINS production
vercel env add CSP_REPORT_URI production

echo "✅ Environment variables setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Verify variables: vercel env ls"
echo "2. Deploy: vercel --prod"
echo "3. Check Sentry dashboard for error tracking"
echo "4. Check Vercel dashboard for Speed Insights"
echo ""
echo "🔗 Useful links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Sentry Dashboard: https://sentry.io/organizations/nosyt/projects/nosytlabscom/"
echo "- Speed Insights: https://vercel.com/dashboard/analytics"
