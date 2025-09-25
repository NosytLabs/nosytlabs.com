import type { APIRoute } from 'astro';

// NOTE: For static builds, this API endpoint is disabled
// For production, use a serverless function (Vercel, Netlify) or form service (Formspree, Netlify Forms)
// export const prerender = false;

// Enhanced logging for debugging
console.log('=== CONTACT API ENDPOINT LOADED ===');

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Input sanitization helper
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Email service interface
interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
}

// Simple email service (replace with your preferred email service)
async function sendContactEmail(data: ContactEmailData): Promise<void> {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Log the email data (in production, send actual email)
  console.log('=== EMAIL NOTIFICATION ===');
  console.log('To: hi@nosytlabs.com');
  console.log('From:', data.email);
  console.log('Subject:', `[Contact Form] ${data.subject}`);
  console.log('Content:', {
    name: data.name,
    email: data.email,
    service: data.service,
    subject: data.subject,
    message: data.message
  });
  console.log('=== END EMAIL ===');

  // TODO: Replace with actual email service integration
  // Examples:
  // - Nodemailer with SMTP
  // - SendGrid API
  // - AWS SES
  // - Resend
  // - Postmark
}

// Rate limiting - simple in-memory store (in production, use Redis or similar)
const submissions = new Map<string, number[]>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxSubmissions = 3; // Max 3 submissions per 15 minutes

  const userSubmissions = submissions.get(email) || [];

  // Remove old submissions outside the window
  const recentSubmissions = userSubmissions.filter(time => now - time < windowMs);

  if (recentSubmissions.length >= maxSubmissions) {
    return false; // Rate limit exceeded
  }

  // Add current submission
  recentSubmissions.push(now);
  submissions.set(email, recentSubmissions);

  return true;
}

// GET endpoint for testing API availability
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: true,
    message: 'Contact API is available',
    methods: ['GET', 'POST', 'OPTIONS'],
    cors: true
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    console.log('Contact form submission received');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));

    // Check Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
      console.log('Invalid content type:', contentType);
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid content type. Expected form data.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const formData = await request.formData();
    console.log('FormData received successfully');

    // Extract and sanitize form fields
    const name = (formData as any).get('name') as string;
    const email = (formData as any).get('email') as string;
    const subject = (formData as any).get('subject') as string;
    const service = (formData as any).get('service') as string;
    const message = (formData as any).get('message') as string;

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedService = sanitizeInput(service);
    const sanitizedMessage = sanitizeInput(message);

    console.log('Sanitized fields:', { name, email, subject, service, message });

    // Comprehensive validation
    const errors: string[] = [];

    if (!sanitizedName) {
      errors.push('Name is required');
    } else if (sanitizedName.length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (sanitizedName.length > 100) {
      errors.push('Name must be less than 100 characters');
    }

    if (!sanitizedEmail) {
      errors.push('Email is required');
    } else if (!isValidEmail(sanitizedEmail)) {
      errors.push('Please enter a valid email address');
    }

    if (!sanitizedSubject) {
      errors.push('Subject is required');
    } else if (sanitizedSubject.length < 5) {
      errors.push('Subject must be at least 5 characters');
    } else if (sanitizedSubject.length > 200) {
      errors.push('Subject must be less than 200 characters');
    }

    if (!sanitizedService) {
      errors.push('Please select a service');
    }

    if (!sanitizedMessage) {
      errors.push('Message is required');
    } else if (sanitizedMessage.length < 10) {
      errors.push('Message must be at least 10 characters');
    } else if (sanitizedMessage.length > 5000) {
      errors.push('Message must be less than 5000 characters');
    }

    // Check rate limiting
    if (!checkRateLimit(sanitizedEmail)) {
      console.log('Rate limit exceeded for email:', email);
      return new Response(JSON.stringify({
        success: false,
        message: 'Too many submissions. Please wait 15 minutes before trying again.'
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (errors.length > 0) {
      console.log('Validation failed:', errors);
      return new Response(JSON.stringify({
        success: false,
        message: 'Please correct the following errors:',
        errors: errors
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    console.log('Validation passed, processing submission');

    // Send email notification
    try {
      await sendContactEmail({
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        service: sanitizedService,
        message: sanitizedMessage
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails - log it and continue
      // In production, you might want to save to a database as backup
    }

    console.log('Contact form processed successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return new Response(JSON.stringify({
      success: false,
      message: 'Something went wrong. Please try again or contact us directly at hi@nosytlabs.com.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
};