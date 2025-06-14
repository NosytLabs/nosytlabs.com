/**
 * Database Initialization API Endpoint
 * Creates necessary tables and tests database connection
 */

import type { APIRoute } from 'astro';
import { testConnection, DatabaseOperations } from '../../lib/database';

export const POST: APIRoute = async () => {
  try {
    // Test database connection first
    // Testing database connection...
    const connectionTest = await testConnection();
    
    if (!connectionTest.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Database connection failed',
          details: connectionTest.error
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Database connection successful
    // Creating database tables...

    // Create all necessary tables
    const tablesResult = await DatabaseOperations.createTables();
    
    if (!tablesResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to create database tables',
          details: tablesResult.error
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Database tables created successfully');

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database initialized successfully',
        connection: {
          status: 'connected',
          version: connectionTest.version
        },
        tables: {
          status: 'created',
          tables: [
            'contact_submissions',
            'blog_analytics', 
            'project_inquiries',
            'newsletter_subscriptions'
          ]
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Database initialization error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error during database initialization',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// GET endpoint for checking database status
export const GET: APIRoute = async () => {
  try {
    const connectionTest = await testConnection();
    
    return new Response(
      JSON.stringify({ 
        success: connectionTest.success,
        status: connectionTest.success ? 'connected' : 'disconnected',
        version: connectionTest.version || null,
        error: connectionTest.error || null
      }),
      { 
        status: connectionTest.success ? 200 : 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Database status check error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
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
