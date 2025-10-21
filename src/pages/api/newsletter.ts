import type { APIRoute } from 'astro';
import { 
  createOptionsHandler, 
  createErrorResponse, 
  createSuccessResponse, 
  parseRequestData, 
  isValidEmail,
  withAPIMiddleware 
} from '@/lib/api/api-helpers';

export const OPTIONS: APIRoute = createOptionsHandler();

export const GET: APIRoute = () => new Response('Method Not Allowed', { status: 405 });

/**
 * Mock API endpoint for newsletter subscriptions.
 * Accepts JSON or form data with an `email` field.
 * Replace with integration to a real email service (e.g., Mailchimp/SendGrid) in production.
 */
export const POST: APIRoute = withAPIMiddleware(async (request) => {
  const data = await parseRequestData<{ email: string }>(request, 'newsletter_subscription');

  if (!data?.email) {
    return createErrorResponse('Email address is required');
  }

  // Validate email
  if (!isValidEmail(data.email)) {
    return createErrorResponse('Valid email address is required');
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Newsletter subscription email:', data.email);
  }

  // Simulate successful subscription
  return createSuccessResponse(
    { email: data.email },
    'Successfully subscribed to newsletter'
  );
}, { 
  logRequests: true,
  rateLimit: { maxRequests: 5, windowMs: 60000 } // 5 requests per minute
});
