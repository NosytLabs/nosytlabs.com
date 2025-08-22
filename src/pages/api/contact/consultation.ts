import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields for consultation
    const requiredFields = ['name', 'email', 'consultationType', 'businessSize', 'currentChallenges', 'goals', 'preferredMeetingType'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Forward to Express API server
    const EXPRESS_API_URL = process.env.EXPRESS_API_URL || 'http://localhost:3000';

    const response = await fetch(`${EXPRESS_API_URL}/api/contact/consultation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Astro-Proxy/1.0'
      },
      body: JSON.stringify({
        ...data,
        formType: 'consultation',
        source: 'astro-frontend',
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();

    return new Response(
      JSON.stringify(result),
      {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Consultation API error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error. Please try again later.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};