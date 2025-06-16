# Vercel Environment Variables Configuration

## Required Environment Variables for NosytLabs Production Deployment

### 1. Sentry Configuration
```
SENTRY_DSN=https://c132847d853499737873e2baeb344f66@o4509057271988224.ingest.us.sentry.io/4509483976753152
SENTRY_AUTH_TOKEN=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
```

### 2. Database Configuration (Supabase)
```
DATABASE_URL=postgresql://postgres.jvorgukgexezucwxygdi:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://jvorgukgexezucwxygdi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2b3JndWtnZXhlenVjd3h5Z2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3ODg1MjksImV4cCI6MjA2MTM2NDUyOX0.XjaK_jo1f3MbkgHy7rlD8Vr-_x61vO1uRBRGCmDrXEo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2b3JndWtnZXhlenVjd3h5Z2RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTc4ODUyOSwiZXhwIjoyMDYxMzY0NTI5fQ.N00v7ZnO8qP1jC7n_aB0KxufHw6PA-dpyA2Wweclw-Y
```

### 3. Email Configuration (Resend)
```
RESEND_API_KEY=re_4LJQfGm1_Ft9thj3MZqXctAGtMBuPxRuy
CONTACT_EMAIL=hi@nosytlabs.com
EMAIL_FROM=NosytLabs <noreply@nosytlabs.com>
EMAIL_REPLY_TO=hi@nosytlabs.com
```

### 4. Application Configuration
```
NODE_ENV=production
APP_URL=https://nosytlabs.com
APP_NAME=NosytLabs
APP_VERSION=1.0.0
```

### 5. Security Configuration
```
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
JWT_SECRET=nosytlabs_jwt_secret_key_2025_secure_production
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### 6. Analytics & Monitoring
```
VERCEL_ANALYTICS_ID=[AUTO_GENERATED_BY_VERCEL]
GOOGLE_ANALYTICS_ID=[YOUR_GA_ID]
```

### 7. Feature Flags
```
ENABLE_ANALYTICS=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_CONTACT_FORM=true
ENABLE_NEWSLETTER=true
ENABLE_PAYMENTS=true
```

### 8. CORS & Security Headers
```
ALLOWED_ORIGINS=https://nosytlabs.com,https://www.nosytlabs.com
CSP_REPORT_URI=https://nosytlabs.com/api/csp-report
```

## Vercel CLI Commands to Set Environment Variables

### Production Environment
```bash
# Sentry
vercel env add SENTRY_DSN production
vercel env add SENTRY_AUTH_TOKEN production

# Database
vercel env add DATABASE_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Email
vercel env add RESEND_API_KEY production
vercel env add CONTACT_EMAIL production
vercel env add EMAIL_FROM production
vercel env add EMAIL_REPLY_TO production

# Application
vercel env add NODE_ENV production
vercel env add APP_URL production
vercel env add APP_NAME production
vercel env add APP_VERSION production

# Security
vercel env add ENCRYPTION_KEY production
vercel env add JWT_SECRET production
vercel env add RATE_LIMIT_MAX production
vercel env add RATE_LIMIT_WINDOW production

# Feature Flags
vercel env add ENABLE_ANALYTICS production
vercel env add ENABLE_EMAIL_NOTIFICATIONS production
vercel env add ENABLE_CONTACT_FORM production
vercel env add ENABLE_NEWSLETTER production
vercel env add ENABLE_PAYMENTS production

# CORS & Security
vercel env add ALLOWED_ORIGINS production
vercel env add CSP_REPORT_URI production
```

### Preview Environment (Optional)
```bash
# Add same variables for preview environment
vercel env add [VARIABLE_NAME] preview
```

## Manual Setup via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project (nosytlabs.com)
3. Go to Settings > Environment Variables
4. Add each variable with the values above
5. Set environment to "Production" for live site
6. Click "Save"

## Verification Commands

```bash
# List all environment variables
vercel env ls

# Pull environment variables to local
vercel env pull .env.local

# Deploy with environment variables
vercel --prod
```

## Important Notes

1. **Never commit sensitive environment variables to Git**
2. **Use different values for development/preview/production**
3. **Rotate secrets regularly for security**
4. **Test environment variables after deployment**
5. **Monitor Sentry dashboard for error tracking**
6. **Verify Speed Insights in Vercel dashboard**

## Speed Insights Verification

After deployment, verify Speed Insights is working:
1. Visit https://vercel.com/dashboard/analytics
2. Check for performance data collection
3. Monitor Core Web Vitals metrics
4. Verify data appears within 24 hours
