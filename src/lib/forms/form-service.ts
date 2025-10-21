/**
 * Form Service for Static Deployments
 * 
 * Handles form submissions for static sites using third-party services
 * like Formspree, Netlify Forms, or direct email services.
 */

import type { ContactFormData } from './form-validator';

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Configuration for form services
 */
export interface FormServiceConfig {
  // Formspree configuration
  formspreeEndpoint?: string;
  
  // Netlify Forms (automatically detected)
  useNetlifyForms?: boolean;
  
  // EmailJS configuration
  emailjsServiceId?: string;
  emailjsTemplateId?: string;
  emailjsPublicKey?: string;
  
  // Fallback email configuration
  fallbackEmail?: string;
}

/**
 * Default configuration - can be overridden via environment variables
 */
const defaultConfig: FormServiceConfig = {
  formspreeEndpoint: import.meta.env.PUBLIC_FORMSPREE_ENDPOINT,
  useNetlifyForms: import.meta.env.PUBLIC_USE_NETLIFY_FORMS === 'true',
  emailjsServiceId: import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
  emailjsTemplateId: import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
  emailjsPublicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY,
  fallbackEmail: import.meta.env.PUBLIC_FALLBACK_EMAIL || 'hi@nosytlabs.com'
};

/**
 * Submit form using Formspree
 */
async function submitToFormspree(data: ContactFormData, endpoint: string): Promise<FormSubmissionResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        service: data.service,
        message: data.message,
        _replyto: data.email,
        _subject: `[Contact Form] ${data.subject}`
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: 'Failed to send message. Please try again.',
        error: errorData.error || 'Unknown error'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Submit form using Netlify Forms
 */
async function submitToNetlify(data: ContactFormData): Promise<FormSubmissionResult> {
  try {
    const formData = new FormData();
    formData.append('form-name', 'contact');
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('subject', data.subject);
    formData.append('service', data.service);
    formData.append('message', data.message);

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as unknown as Record<string, string>).toString()
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      };
    } else {
      return {
        success: false,
        message: 'Failed to send message. Please try again.',
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Submit form using EmailJS
 */
async function submitToEmailJS(data: ContactFormData, config: FormServiceConfig): Promise<FormSubmissionResult> {
  try {
    // Dynamically import EmailJS to avoid bundling if not used
    const emailjs = await import('@emailjs/browser');
    
    if (!config.emailjsServiceId || !config.emailjsTemplateId || !config.emailjsPublicKey) {
      throw new Error('EmailJS configuration is incomplete');
    }

    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      service: data.service,
      message: data.message,
      to_email: config.fallbackEmail
    };

    await emailjs.send(
      config.emailjsServiceId,
      config.emailjsTemplateId,
      templateParams,
      config.emailjsPublicKey
    );

    return {
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Create a mailto link as fallback
 */
function createMailtoFallback(data: ContactFormData, config: FormServiceConfig): string {
  const subject = encodeURIComponent(`[Contact Form] ${data.subject}`);
  const body = encodeURIComponent(
    `Name: ${data.name}\n` +
    `Email: ${data.email}\n` +
    `Service: ${data.service}\n` +
    `Subject: ${data.subject}\n\n` +
    `Message:\n${data.message}`
  );
  
  return `mailto:${config.fallbackEmail}?subject=${subject}&body=${body}`;
}

/**
 * Main contact form submission function
 */
export async function submitContactForm(
  data: ContactFormData,
  config: FormServiceConfig = defaultConfig
): Promise<FormSubmissionResult> {
  
  console.warn('Form submission started with data:', data);
  console.warn('Form service config:', config);
  
  // Try Formspree first if configured
  if (config.formspreeEndpoint) {
    console.warn('Attempting to submit via Formspree...');
    const result = await submitToFormspree(data, config.formspreeEndpoint);
    if (result.success) return result;
    console.warn('Formspree submission failed:', result.error);
  }

  // Try Netlify Forms if configured
  if (config.useNetlifyForms) {
    console.warn('Attempting to submit via Netlify Forms...');
    const result = await submitToNetlify(data);
    if (result.success) return result;
    console.warn('Netlify Forms submission failed:', result.error);
  }

  // Try EmailJS if configured
  if (config.emailjsServiceId && config.emailjsTemplateId && config.emailjsPublicKey) {
    console.warn('Attempting to submit via EmailJS...');
    const result = await submitToEmailJS(data, config);
    if (result.success) return result;
    console.warn('EmailJS submission failed:', result.error);
  }

  // Fallback to mailto link
  console.warn('All services failed, falling back to mailto...');
  const mailtoLink = createMailtoFallback(data, config);
  
  // Open mailto link
  window.location.href = mailtoLink;
  
  return {
    success: true,
    message: 'Your email client should open with a pre-filled message. Please send it to complete your request.'
  };
}

/**
 * Newsletter subscription function
 */
export async function submitNewsletterSubscription(
  email: string,
  config: FormServiceConfig = defaultConfig
): Promise<FormSubmissionResult> {
  
  // Try Formspree for newsletter if configured
  if (config.formspreeEndpoint) {
    try {
      const newsletterEndpoint = config.formspreeEndpoint.replace('/contact', '/newsletter');
      const response = await fetch(newsletterEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          _subject: 'Newsletter Subscription'
        })
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Successfully subscribed to newsletter!'
        };
      }
    } catch (error) {
      console.warn('Newsletter subscription failed:', error);
    }
  }

  // Fallback for newsletter
  return {
    success: false,
    message: 'Newsletter subscription is currently unavailable. Please contact us directly.',
    error: 'No newsletter service configured'
  };
}
