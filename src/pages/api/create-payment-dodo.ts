import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { service, amount, customerEmail, customerName } = body;

    // Validate required fields
    if (!service || !amount || !customerEmail) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: service, amount, customerEmail'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For now, return a mock response since we need DodoPayments API credentials
    // In production, this would integrate with the actual DodoPayments API
    const mockPaymentResponse = {
      success: true,
      paymentId: `payment_${Date.now()}`,
      paymentUrl: `https://pay.dodo.dev/checkout/${Date.now()}`,
      amount: amount,
      service: service,
      status: 'pending',
      message: 'Payment link created successfully'
    };

    return new Response(JSON.stringify(mockPaymentResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create payment'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

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
