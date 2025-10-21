# EmailJS Setup Guide for NOSYT Labs

Your site is now fully migrated to Replit with EmailJS integration! The contact form is ready - it just needs your EmailJS credentials to start sending emails.

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account

1. Go to https://dashboard.emailjs.com/sign-up
2. Sign up with your email (it's free - 200 emails/month)
3. Verify your email address

### Step 2: Add Email Service

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended):
   - **Gmail**: Connect your Hi@nosytlabs.com Gmail account
   - **Outlook**: If you use Outlook/Microsoft
   - **Other**: Any SMTP service
4. Follow the connection wizard
5. **Copy your Service ID** (looks like `service_xxxxxxx`)

### Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template configuration:

**Template Name:** Contact Form Submission

**Subject:** New Contact from {{from_name}}

**Content (HTML):**

```html
<h2>New Contact Form Submission</h2>

<p><strong>From:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Subject:</strong> {{subject}}</p>
<p><strong>Service:</strong> {{service}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr />
<p>Reply to: {{from_email}}</p>
```

**To Email:** Hi@nosytlabs.com

4. **Save the template** and **copy the Template ID** (looks like `template_xxxxxxx`)

### Step 4: Get Public Key

1. Go to **Account** → **General** in the dashboard
2. **Copy your Public Key** (looks like a long string of letters/numbers)

### Step 5: Add to Replit Secrets

1. In Replit, open the **Secrets** panel (lock icon in left sidebar)
2. Add these three secrets:

```
PUBLIC_EMAILJS_SERVICE_ID = service_xxxxxxx
PUBLIC_EMAILJS_TEMPLATE_ID = template_xxxxxxx
PUBLIC_EMAILJS_PUBLIC_KEY = your_public_key_here
```

3. Also add your site URL:

```
PUBLIC_SITE_URL = https://nosytlabs.com
```

### Step 6: Restart the Server

1. Click the **Stop** button in Replit
2. Click **Run** to restart with the new secrets
3. The contact form will now work!

## Testing the Contact Form

1. Go to https://[your-replit-url]/contact
2. Fill out the form with test data
3. Submit the form
4. Check Hi@nosytlabs.com for the test email
5. If it works, you're all set! 🎉

## Troubleshooting

**"EmailJS configuration is incomplete" error:**

- Make sure all three PUBLIC*EMAILJS*\* variables are set in Replit Secrets
- Restart the server after adding secrets

**Form opens email client instead:**

- This is the fallback when EmailJS isn't configured
- Check that your secrets are named exactly as shown above

**No email received:**

- Check your EmailJS dashboard for rate limits (200/month free)
- Verify the template ID and service ID are correct
- Check spam folder

## Publishing to Production

Once EmailJS is working:

1. In Replit, click **Publish** in the top right
2. Choose **Static** deployment (this site is already configured for it)
3. Your site will be deployed to a permanent URL
4. Optionally add your custom domain (nosytlabs.com)

## What Changed in This Migration

✅ **Removed:** Resend API (server-side email)
✅ **Added:** EmailJS (client-side email, no server needed)
✅ **Removed:** API routes (not needed for static sites)
✅ **Updated:** Site URL to nosytlabs.com
✅ **Improved:** All UI/UX across hero, stats, services, footer
✅ **Fixed:** Responsive design and visual consistency
✅ **Configured:** Static deployment for Replit

Your site is production-ready once you add the EmailJS credentials!
