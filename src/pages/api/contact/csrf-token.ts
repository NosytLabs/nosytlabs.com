import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const EXPRESS_API_URL = process.env.EXPRESS_API_URL || 'http://localhost:3000';

    const response = await fetch(`${EXPRESS_API_URL}/api/contact/csrf-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies from the client to Express so it can set/refresh tokens properly
        ...(request.headers.get('cookie') ? { 'Cookie': request.headers.get('cookie') as string } : {}),
        'User-Agent': 'Astro-Proxy/1.0'
      },
      // Keep credentials semantics explicit for clarity
      // Note: Node fetch uses headers; credentials is primarily for browsers
    });

    // Try to forward Set-Cookie headers from Express to the browser
    const setCookie = response.headers.get('set-cookie');
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        ...(setCookie ? { 'Set-Cookie': setCookie } : {}),
      }
    });
  } catch (error) {
    console.error('CSRF token proxy error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to get CSRF token' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};