# Vercel Environment Variables Setup Script (PowerShell)
# Run this script to configure all required environment variables for NosytLabs

Write-Host "🚀 Setting up Vercel Environment Variables for NosytLabs" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green

# Check if vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Login to Vercel (if not already logged in)
Write-Host "🔐 Logging into Vercel..." -ForegroundColor Yellow
npx vercel login

# Link project (if not already linked)
Write-Host "🔗 Linking project..." -ForegroundColor Yellow
npx vercel link

Write-Host "📝 Setting up environment variables..." -ForegroundColor Yellow

# Function to add environment variable
function Add-VercelEnv {
    param($Name, $Description)
    Write-Host "Setting $Name..." -ForegroundColor Cyan
    npx vercel env add $Name production
}

# Sentry Configuration
Write-Host "Setting up Sentry..." -ForegroundColor Blue
Add-VercelEnv "SENTRY_DSN" "Sentry DSN for error tracking"
Add-VercelEnv "SENTRY_AUTH_TOKEN" "Sentry auth token for source maps"

# Database Configuration
Write-Host "Setting up Database..." -ForegroundColor Blue
Add-VercelEnv "DATABASE_URL" "Supabase database connection URL"
Add-VercelEnv "SUPABASE_URL" "Supabase project URL"
Add-VercelEnv "SUPABASE_ANON_KEY" "Supabase anonymous key"
Add-VercelEnv "SUPABASE_SERVICE_ROLE_KEY" "Supabase service role key"

# Email Configuration
Write-Host "Setting up Email..." -ForegroundColor Blue
Add-VercelEnv "RESEND_API_KEY" "Resend API key for email"
Add-VercelEnv "CONTACT_EMAIL" "Contact email address"
Add-VercelEnv "EMAIL_FROM" "From email address"
Add-VercelEnv "EMAIL_REPLY_TO" "Reply-to email address"

# Application Configuration
Write-Host "Setting up Application..." -ForegroundColor Blue
Add-VercelEnv "NODE_ENV" "Node environment (production)"
Add-VercelEnv "APP_URL" "Application URL"
Add-VercelEnv "APP_NAME" "Application name"
Add-VercelEnv "APP_VERSION" "Application version"

# Security Configuration
Write-Host "Setting up Security..." -ForegroundColor Blue
Add-VercelEnv "ENCRYPTION_KEY" "Encryption key for security"
Add-VercelEnv "JWT_SECRET" "JWT secret for authentication"
Add-VercelEnv "RATE_LIMIT_MAX" "Rate limit maximum requests"
Add-VercelEnv "RATE_LIMIT_WINDOW" "Rate limit window in ms"

# Feature Flags
Write-Host "Setting up Feature Flags..." -ForegroundColor Blue
Add-VercelEnv "ENABLE_ANALYTICS" "Enable analytics (true/false)"
Add-VercelEnv "ENABLE_EMAIL_NOTIFICATIONS" "Enable email notifications"
Add-VercelEnv "ENABLE_CONTACT_FORM" "Enable contact form"
Add-VercelEnv "ENABLE_NEWSLETTER" "Enable newsletter"
Add-VercelEnv "ENABLE_PAYMENTS" "Enable payments"

# CORS & Security
Write-Host "Setting up CORS & Security..." -ForegroundColor Blue
Add-VercelEnv "ALLOWED_ORIGINS" "Allowed CORS origins"
Add-VercelEnv "CSP_REPORT_URI" "CSP report URI"

Write-Host "✅ Environment variables setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify variables: npx vercel env ls" -ForegroundColor White
Write-Host "2. Deploy: npx vercel --prod" -ForegroundColor White
Write-Host "3. Check Sentry dashboard for error tracking" -ForegroundColor White
Write-Host "4. Check Vercel dashboard for Speed Insights" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful links:" -ForegroundColor Yellow
Write-Host "- Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "- Sentry Dashboard: https://sentry.io/organizations/nosyt/projects/nosytlabscom/" -ForegroundColor White
Write-Host "- Speed Insights: https://vercel.com/dashboard/analytics" -ForegroundColor White
