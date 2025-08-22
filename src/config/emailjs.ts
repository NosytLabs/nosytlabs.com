/**
 * EmailJS Configuration
 * 
 * Configuration for EmailJS service integration to send contact form emails
 * directly to hi@nosytlabs.com
 */

export const EMAILJS_CONFIG = {
  // These will need to be set up in EmailJS dashboard
  SERVICE_ID: 'service_nosytlabs', // Replace with your EmailJS service ID
  TEMPLATE_ID: 'template_contact', // Replace with your EmailJS template ID
  PUBLIC_KEY: 'your_public_key_here', // Replace with your EmailJS public key
  
  // Email configuration
  TO_EMAIL: 'hi@nosytlabs.com',
  FROM_NAME: 'NosyT Labs Contact Form',
  
  // Template variables mapping
  TEMPLATE_PARAMS: {
    to_email: 'hi@nosytlabs.com',
    from_name: '{{name}}',
    from_email: '{{email}}',
    subject: '{{subject}}',
    message: '{{message}}',
    phone: '{{phone}}',
    company: '{{company}}',
    form_type: '{{formType}}',
    timestamp: '{{timestamp}}'
  }
};

// Environment variable keys for production
export const ENV_KEYS = {
  SERVICE_ID: 'EMAILJS_SERVICE_ID',
  TEMPLATE_ID: 'EMAILJS_TEMPLATE_ID', 
  PUBLIC_KEY: 'EMAILJS_PUBLIC_KEY'
};