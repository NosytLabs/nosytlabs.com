/**
 * Newsletter Subscription API Endpoint
 * Handles newsletter subscriptions and saves them to Neon database
 */

import type { APIRoute } from 'astro';
import { DatabaseOperations } from '../../lib/database';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const { email } = body;
    if (!email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email address is required' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Please provide a valid email address' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Save to database
    const result = await DatabaseOperations.subscribeToNewsletter(
      email.trim().toLowerCase(),
      body.name?.trim() || ''
    );

    if (!result.success) {
      console.error('Database error:', result.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to subscribe to newsletter. Please try again.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed to our newsletter!',
        id: result.data?.id
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Newsletter API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Handle OPTIONS for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
