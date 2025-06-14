import type { APIRoute } from 'astro';

// DodoPayments API configuration
// Dodo Payments configuration - commented out for now
// const DODO_API_KEY = 'hIWJuDO6bH4fMr3C.FAKK8CKphAllPbLcXicSAuENdiTARhgxpO3BZdqH6w2Q63tL';
// const DODO_API_BASE = 'https://api.dodopayments.com/v1';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    const {
      productId,
      productName,
      amount,
      customer,
      billing,
      returnUrl
      // metadata = {} // Commented out as unused
    } = body;

    // Validate required fields
    if (!productId || !productName || !amount || !customer || !billing) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        required: ['productId', 'productName', 'amount', 'customer', 'billing']
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Payment data structure - would be used with actual API integration
    /*
    const paymentData = {
      customer: {
        email: customer.email || 'hi@nosytlabs.com',
        name: customer.name || 'NosytLabs Customer'
      },
      billing: {
        street: billing.street || '123 Main St',
        city: billing.city || 'Albuquerque',
        state: billing.state || 'New Mexico',
        zipcode: billing.zipcode || '87101',
        country: billing.country || 'US'
      },
      product_cart: [{
        product_id: productId,
        quantity: 1,
        amount: amount
      }],
      billing_currency: 'USD',
      payment_link: true,
      return_url: returnUrl || 'https://nosytlabs.com/thank-you',
      metadata: {
        service: productName,
        source: 'nosytlabs_website',
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };
    */

    console.log('Creating DodoPayments payment:', {
      productId,
      productName,
      amount: amount / 100,
      customer: customer.email
    });

    // For testing purposes, create a mock checkout URL
    // In production, this would make the actual DodoPayments API call
    console.log('Creating test payment for:', {
      productId,
      productName,
      amount: amount / 100
    });

    // Generate a test checkout URL - commented out as unused
    // const testCheckoutUrl = `https://test.checkout.dodopayments.com/test-payment?product=${encodeURIComponent(productName)}&amount=${amount}&return_url=${encodeURIComponent(returnUrl || 'https://nosytlabs.com/thank-you')}`;

    // For demo purposes, we'll redirect directly to thank you page with payment simulation
    const simulatedCheckoutUrl = `${returnUrl || 'https://nosytlabs.com/thank-you'}?payment_id=test_${Date.now()}&status=success`;

    console.log('Generated test checkout URL:', simulatedCheckoutUrl);

    // Return success response with checkout URL
    return new Response(JSON.stringify({
      success: true,
      checkoutUrl: simulatedCheckoutUrl,
      paymentId: `test_${Date.now()}`,
      amount: amount,
      currency: 'USD',
      productName: productName
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle preflight requests for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
};
