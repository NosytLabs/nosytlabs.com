/**
 * EmailJS Service
 * 
 * Service for sending contact form emails using EmailJS
 */

import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

// Initialize EmailJS with public key
const initEmailJS = () => {
  const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY;
  if (publicKey && publicKey !== 'your_public_key_here') {
    emailjs.init(publicKey);
  }
};

// Initialize on module load
initEmailJS();

// Form data interface
export interface EmailFormData {
  name: string;
  email: string;
  phone?: string | undefined;
  company?: string | undefined;
  subject?: string | undefined;
  message?: string | undefined;
  formType?: string | undefined;
  // Additional fields for different form types
  [key: string]: any;
}

// Email sending result
export interface EmailResult {
  success: boolean;
  message: string;
  error?: any;
}

/**
 * Send contact form email using EmailJS
 */
export const sendContactEmail = async (formData: EmailFormData): Promise<EmailResult> => {
  try {
    // Get configuration from environment variables or fallback to config
    const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID;
    const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID;
    const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY;

    // Validate configuration
    if (!serviceId || serviceId === 'service_nosytlabs') {
      throw new Error('EmailJS Service ID not configured');
    }
    if (!templateId || templateId === 'template_contact') {
      throw new Error('EmailJS Template ID not configured');
    }
    if (!publicKey || publicKey === 'your_public_key_here') {
      throw new Error('EmailJS Public Key not configured');
    }

    // Prepare template parameters
    const templateParams = {
      to_email: EMAILJS_CONFIG.TO_EMAIL,
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject || `New ${formData.formType || 'contact'} inquiry from ${formData.name}`,
      message: formatMessage(formData),
      phone: formData.phone || 'Not provided',
      company: formData.company || 'Not provided',
      form_type: formData.formType || 'general',
      timestamp: new Date().toLocaleString()
    };

    // Send email
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Email sent successfully'
      };
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('EmailJS Error:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error
    };
  }
};

/**
 * Format message content based on form type and data
 */
const formatMessage = (formData: EmailFormData): string => {
  let message = formData.message || '';
  
  // Add form-specific information
  if (formData.formType === 'project') {
    message += `\n\n--- Project Details ---\n`;
    if (formData.projectType) message += `Project Type: ${formData.projectType}\n`;
    if (formData.projectDescription) message += `Description: ${formData.projectDescription}\n`;
    if (formData.budget) message += `Budget: ${formData.budget}\n`;
    if (formData.timeline) message += `Timeline: ${formData.timeline}\n`;
    if (formData.currentWebsite) message += `Current Website: ${formData.currentWebsite}\n`;
    if (formData.additionalRequirements) message += `Additional Requirements: ${formData.additionalRequirements}\n`;
  } else if (formData.formType === 'consultation') {
    message += `\n\n--- Consultation Details ---\n`;
    if (formData.consultationType) message += `Consultation Type: ${formData.consultationType}\n`;
    if (formData.businessSize) message += `Business Size: ${formData.businessSize}\n`;
    if (formData.currentChallenges) message += `Current Challenges: ${formData.currentChallenges}\n`;
    if (formData.goals) message += `Goals: ${formData.goals}\n`;
    if (formData.preferredMeetingType) message += `Preferred Meeting Type: ${formData.preferredMeetingType}\n`;
  } else {
    // General contact form
    if (formData.serviceInterest) message += `\n\nService Interest: ${formData.serviceInterest}`;
    if (formData.budget) message += `\nBudget: ${formData.budget}`;
    if (formData.timeline) message += `\nTimeline: ${formData.timeline}`;
  }
  
  return message;
};

/**
 * Validate EmailJS configuration
 */
export const validateEmailJSConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID;
  const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID;
  const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY;
  
  if (!serviceId || serviceId === 'service_nosytlabs') {
    errors.push('EmailJS Service ID is not configured');
  }
  if (!templateId || templateId === 'template_contact') {
    errors.push('EmailJS Template ID is not configured');
  }
  if (!publicKey || publicKey === 'your_public_key_here') {
    errors.push('EmailJS Public Key is not configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};