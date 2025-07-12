console.log('[HELLO-JS] Module loaded');

export async function GET() {
  console.log('[HELLO-JS] GET function called');
  return new Response(JSON.stringify({ message: 'Hello World from JavaScript API!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

console.log('[HELLO-JS] Module processing complete');