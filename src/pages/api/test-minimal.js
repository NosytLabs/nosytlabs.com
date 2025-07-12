// Minimal API route for Astro 5.x testing
console.log('[MINIMAL-API] File loaded - testing Astro 5.x API format');

export async function GET(context) {
  console.log('[MINIMAL-API] GET function called');
  console.log('[MINIMAL-API] Context:', context);
  
  return new Response(
    JSON.stringify({ 
      message: 'Minimal API test successful',
      timestamp: new Date().toISOString()
    }), 
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

console.log('[MINIMAL-API] Export completed');