/**
 * Analytics API Endpoint
 * Provides analytics data from Neon database
 */

import type { APIRoute } from 'astro';
import { DatabaseOperations } from '../../lib/database';

export const GET: APIRoute = async () => {
  try {
    // Get analytics data from database
    const result = await DatabaseOperations.getAnalytics();

    if (!result.success) {
      console.error('Database error:', result.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to fetch analytics data' 
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
        data: result.data
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        }
      }
    );

  } catch (error) {
    console.error('Analytics API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Blog view tracking endpoint
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { postSlug } = body;

    if (!postSlug) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Post slug is required' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Increment blog views
    const result = await DatabaseOperations.incrementBlogViews(postSlug);

    if (!result.success) {
      console.error('Database error:', result.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to track blog view' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Blog view tracked successfully'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Blog tracking error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
