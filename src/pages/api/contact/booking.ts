import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Basic field presence validation (alignment with Express expects)
    const requiredFields = ['name', 'email', 'consultationType', 'businessSize', 'currentChallenges'];
    const missing = requiredFields.filter((f) => {
      const v = data[f];
      return !v || (Array.isArray(v) && v.length === 0);
    });

    if (missing.length > 0) {
      const msg = `Missing required fields: ${missing.join(', ')}`;
      return new Response(
        JSON.stringify({ success: false, message: msg }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const EXPRESS_API_URL = process.env.EXPRESS_API_URL || 'http://localhost:3000';

    const response = await fetch(`${EXPRESS_API_URL}/api/contact/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Astro-Proxy/1.0',
        // forward CSRF token header if present
        ...(request.headers.get('x-csrf-token') ? { 'X-CSRF-Token': request.headers.get('x-csrf-token') as string } : {}),
        // forward cookies for CSRF validation/session pairing
        ...(request.headers.get('cookie') ? { 'Cookie': request.headers.get('cookie') as string } : {}),
      },
      body: JSON.stringify({
        ...data,
        formType: 'booking',
        source: 'astro-frontend',
        timestamp: new Date().toISOString(),
      })
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
    console.error('Booking inquiry API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};