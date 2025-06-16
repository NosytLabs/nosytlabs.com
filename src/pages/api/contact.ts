/**
 * Contact Form API Endpoint
 * Handles contact form submissions and saves them to Neon database
 */

import type { APIRoute } from 'astro';
import { DatabaseOperations } from '../../lib/database';
import { EmailService } from '../../lib/email.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Name, email, and message are required fields' 
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

    // Prepare contact data
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: body.subject?.trim() ?? '',
      message: message.trim(),
      serviceType: body.serviceType?.trim() ?? '',
      budgetRange: body.budgetRange?.trim() ?? '',
      timeline: body.timeline?.trim() ?? ''
    };

    // Save to database
    const result = await DatabaseOperations.saveContactSubmission(contactData);

    if (!result.success) {
      console.error('Database error:', result.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save contact submission. Please try again.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Send email notification
    const emailResult = await EmailService.sendContactFormNotification(contactData);

    if (!emailResult.success) {
      console.warn('Email notification failed:', emailResult.error);
      // Don't fail the entire request if email fails, just log it
    } else {
      console.log('✅ Email notification sent successfully');
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you soon.',
        id: result.data?.id,
        emailSent: emailResult.success
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Contact API error:', error);
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
