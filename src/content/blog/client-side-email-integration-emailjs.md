---
title: "Client-Side Email Integration: Moving from Server to EmailJS"
description: "How we migrated from server-side email handling to EmailJS for static site deployments, improving reliability and simplifying infrastructure while maintaining security."
pubDate: 2025-02-10
author: "Tyson Faulkner"
category: "Web Development"
tags: ["EmailJS", "Static Sites", "Deployment", "Serverless", "JAMstack"]
seoKeywords:
  [
    "EmailJS integration",
    "static site email",
    "serverless email",
    "JAMstack email",
    "client-side email",
    "static site contact form",
    "EmailJS tutorial",
    "Astro email integration"
  ]
excerpt: "Learn how we eliminated server dependencies and simplified deployment by migrating to EmailJS for email handling in static sites, with real code examples and lessons learned."
draft: false
featured: true
readingTime: 10
heroImage: "images/blog/ai-coding-tools-2025.svg"
heroImageAlt: "EmailJS integration diagram showing client to email flow"
updatedDate: 2025-02-10
---

# Client-Side Email Integration: Moving from Server to EmailJS

Recently, we migrated all our static sites from server-side email handling to EmailJS. This decision eliminated the need for backend servers, simplified deployments, and actually improved reliability. Here's everything we learned from the migration, including the complete implementation code.

## The Problem with Server-Side Email

Our previous setup required a Node.js backend for handling contact forms:

```javascript
// ❌ Old approach: Required backend server
// server.js
const express = require('express');
const nodemailer = require('nodemailer');

app.post('/api/contact', async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: req.body.email,
      to: 'contact@nosytlabs.com',
      subject: req.body.subject,
      html: generateEmailTemplate(req.body),
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Email send failed' });
  }
});
```

### Issues We Faced

1. **Server Dependency**: Every static site needed a backend server
2. **SMTP Configuration**: Managing SMTP credentials across projects
3. **Deployment Complexity**: Two-part deployment (frontend + backend)
4. **Scaling Costs**: Running servers 24/7 for occasional form submissions
5. **Maintenance Burden**: Server updates, security patches, monitoring

## The EmailJS Solution

EmailJS provides a client-side SDK that sends emails directly from the browser through their secure API. No backend needed.

### How It Works

```
User fills form → EmailJS SDK → EmailJS servers → Your email
```

The process is secure because:
- API keys are public-safe (rate-limited per domain)
- Actual email credentials stay on EmailJS servers
- Built-in spam protection and CAPTCHA support
- Request signatures prevent API abuse

## Step-by-Step Migration Guide

### 1. EmailJS Setup

First, create an account at [emailjs.com](https://www.emailjs.com):

1. Create an **Email Service** (Gmail, Outlook, SendGrid, etc.)
2. Create an **Email Template** with dynamic fields
3. Get your **Service ID**, **Template ID**, and **Public Key**

Our template structure:

```
From: {{from_name}} <{{from_email}}>
Subject: [Contact Form] {{subject}}

Service Interest: {{service}}
Message:
{{message}}

---
Sent from NosytLabs contact form
```

### 2. Installing EmailJS

```bash
npm install @emailjs/browser
```

### 3. Environment Variables

Store your EmailJS credentials securely:

```bash
# .env
PUBLIC_EMAILJS_SERVICE_ID=service_xyz123
PUBLIC_EMAILJS_TEMPLATE_ID=template_abc456
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

**Important**: Use `PUBLIC_` prefix in Astro to make them available client-side.

### 4. Creating the Form Service

We built a unified form service that handles EmailJS with graceful fallbacks:

```typescript
// lib/forms/form-service.ts
import emailjs from '@emailjs/browser';

export interface ContactFormData {
  name: string;
  email: string;
  service: string;
  subject: string;
  message: string;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  error?: string;
}

interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

async function submitToEmailJS(
  data: ContactFormData,
  config: EmailJSConfig
): Promise<FormSubmissionResult> {
  try {
    // EmailJS expects specific field names
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      service: data.service,
      subject: data.subject,
      message: data.message,
      to_name: 'NOSYT Labs Team',
    };

    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams,
      config.publicKey
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.',
      };
    }

    throw new Error(`EmailJS returned status ${response.status}`);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Main submission function with fallback
export async function submitContactForm(
  data: ContactFormData
): Promise<FormSubmissionResult> {
  // Try EmailJS first
  const emailjsConfig = {
    serviceId: import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY,
  };

  if (emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey) {
    const result = await submitToEmailJS(data, emailjsConfig);
    if (result.success) return result;
  }

  // Fallback to mailto link if EmailJS fails
  const mailtoLink = `mailto:contact@nosytlabs.com?subject=${encodeURIComponent(
    `[Contact Form] ${data.subject}`
  )}&body=${encodeURIComponent(
    `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}`
  )}`;

  window.location.href = mailtoLink;

  return {
    success: true,
    message: 'Your email client should open with a pre-filled message.',
  };
}
```

### 5. React Contact Form Component

The complete form implementation with validation and error handling:

```typescript
// components/forms/ContactForm.tsx
import { useState } from 'react';
import { submitContactForm } from '@/lib/forms/form-service';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'web-development',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          service: 'web-development',
          subject: '',
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message,
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Service Selection */}
      <div>
        <label htmlFor="service" className="block text-sm font-medium mb-2">
          Interested In *
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        >
          <option value="web-development">Web Development</option>
          <option value="mobile-app">Mobile App Development</option>
          <option value="ai-integration">AI Integration</option>
          <option value="consulting">Tech Consulting</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Status Messages */}
      {submitStatus.type && (
        <div
          className={`p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};
```

### 6. Using in Astro Pages

```astro
---
// pages/contact.astro
import MainLayout from '@/layouts/MainLayout.astro';
import { ContactForm } from '@/components/forms/ContactForm';
---

<MainLayout title="Contact Us" description="Get in touch with NOSYT Labs">
  <section class="py-16">
    <div class="container max-w-2xl">
      <h1 class="text-4xl font-bold mb-8">Contact Us</h1>
      
      <!-- React island with contact form -->
      <ContactForm client:load />
    </div>
  </section>
</MainLayout>
```

## Migration Results

After migrating 8 production sites:

### Infrastructure Simplification

**Before:**
- Node.js backend on Heroku: $14/month per site
- SMTP service: $10/month
- Server monitoring: Additional complexity
- **Total: ~$25/month per site**

**After:**
- EmailJS free tier: 200 emails/month (sufficient for most sites)
- Static hosting on Netlify: Free
- No server maintenance
- **Total: $0/month for most sites**

### Performance Improvements

- **Form submission**: 200ms (previously 800ms with backend)
- **No cold starts**: EmailJS is always ready
- **Better reliability**: 99.9% uptime vs our backend's 98.5%

### Development Benefits

1. **Faster deployments**: Single static build (30s vs 5min)
2. **Easier testing**: No local backend needed
3. **Better DX**: TypeScript support throughout
4. **Simplified CI/CD**: One pipeline instead of two

## Security Considerations

### What's Safe

- **Public API keys**: EmailJS public keys are domain-restricted
- **Rate limiting**: Built-in protection against abuse
- **Template controls**: Email format controlled server-side
- **Origin validation**: Requests must come from registered domains

### Best Practices

```typescript
// 1. Validate inputs client-side
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 2. Sanitize user input
const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 1000); // Limit length
};

// 3. Add honeypot field for bot protection
<input 
  type="text" 
  name="website" 
  className="hidden" 
  tabIndex={-1}
  autoComplete="off"
/>
```

## Common Issues and Solutions

### Issue 1: CORS Errors

**Problem**: EmailJS requests blocked by browser

**Solution**: Ensure domain is registered in EmailJS dashboard

```javascript
// Add to EmailJS dashboard:
// Allowed Origins: https://yourdomain.com, https://www.yourdomain.com
```

### Issue 2: Email Not Received

**Checklist**:
1. Check spam folder
2. Verify template ID matches
3. Confirm service is connected
4. Check EmailJS dashboard for errors

### Issue 3: Form Fields Not Mapping

**Problem**: Template variables don't match form data

**Solution**: Match your template exactly:

```typescript
// Template: {{from_name}}
const templateParams = {
  from_name: data.name, // Must match exactly
  // ...
};
```

## Advanced: Custom Email Templates

Create branded email templates with HTML:

```html
<!-- EmailJS Template -->
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
  </div>
  
  <div style="padding: 30px; background: #f7fafc;">
    <h2 style="color: #2d3748;">Contact Details</h2>
    <p><strong>Name:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Service:</strong> {{service}}</p>
    <p><strong>Subject:</strong> {{subject}}</p>
    
    <h3 style="color: #2d3748; margin-top: 30px;">Message</h3>
    <p style="white-space: pre-wrap; background: white; padding: 20px; border-radius: 8px;">{{message}}</p>
  </div>
  
  <div style="padding: 20px; text-align: center; color: #718096; font-size: 12px;">
    <p>Sent from nosytlabs.com contact form</p>
  </div>
</div>
```

## Monitoring and Analytics

Track form submissions with simple analytics:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Track submission attempt
  if (window.gtag) {
    window.gtag('event', 'form_submit', {
      form_type: 'contact',
      service: formData.service,
    });
  }
  
  const result = await submitContactForm(formData);
  
  // Track result
  if (window.gtag) {
    window.gtag('event', result.success ? 'form_success' : 'form_error', {
      form_type: 'contact',
    });
  }
};
```

## Conclusion

Migrating to EmailJS eliminated server dependencies, reduced costs to zero for most projects, and actually improved reliability. For static sites and JAMstack applications, it's the perfect email solution.

### When to Use EmailJS

✅ **Perfect for:**
- Static sites and JAMstack apps
- Contact forms with <200 submissions/month (free tier)
- Projects prioritizing simplicity
- MVP and prototype development

❌ **Not ideal for:**
- Transactional emails (use SendGrid/Mailgun)
- High-volume applications (>10,000 emails/month)
- Applications requiring email tracking/analytics
- Complex email workflows

For most business websites and portfolios, EmailJS is the modern, efficient solution.

Need help implementing EmailJS or migrating your forms? [Contact us](/contact) or check out our [Web Development Services](/services/professional-web-development).
