import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init(import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY);

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Send newsletter subscription via EmailJS
    // You'll need to create a newsletter template in EmailJS
    const response = await emailjs.send(
      import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
      'template_newsletter', // Create this template in EmailJS
      {
        subscriber_email: email,
        to_email: 'hi@nosytlabs.com',
        subject: `New Newsletter Subscriber: ${email}`,
        message: `A new subscriber has joined the newsletter: ${email}`,
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Thank you for subscribing! Check your email for confirmation.',
      };
    } else {
      throw new Error('Failed to subscribe');
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Failed to subscribe. Please try again later.',
    };
  }
}
