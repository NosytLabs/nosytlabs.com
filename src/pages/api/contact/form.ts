import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Basic required fields for general contact form
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missing = requiredFields.filter((f) => !data[f]);
    if (missing.length > 0) {
      return new Response(
        JSON.stringify({ success: false, message: `Missing required fields: ${missing.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const EXPRESS_API_URL = process.env.EXPRESS_API_URL || 'http://localhost:3000';

    const response = await fetch(`${EXPRESS_API_URL}/api/contact/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Astro-Proxy/1.0',
        // Forward CSRF token header if present
        ...(request.headers.get('x-csrf-token') ? { 'X-CSRF-Token': request.headers.get('x-csrf-token') as string } : {}),
        // Forward cookies for CSRF/session pairing
        ...(request.headers.get('cookie') ? { 'Cookie': request.headers.get('cookie') as string } : {}),
      },
      body: JSON.stringify({
        ...data,
        formType: 'general',
        source: 'astro-frontend',
        timestamp: new Date().toISOString(),
      }),
    });

    const setCookie = response.headers.get('set-cookie');
    const resultText = await response.text();

    return new Response(resultText, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        ...(setCookie ? { 'Set-Cookie': setCookie } : {}),
      },
    });
  } catch (error) {
    console.error('Contact form API proxy error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};