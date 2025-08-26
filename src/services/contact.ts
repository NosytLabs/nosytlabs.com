/**
 * Contact Service
 * 
 * Service for handling contact form submissions using EmailJS
 */

import { sendContactEmail, validateEmailJSConfig } from './emailjs';

// Form data interface
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  formType?: string;
  // Project inquiry fields
  projectType?: string;
  projectDescription?: string;
  budget?: string;
  timeline?: string;
  currentWebsite?: string;
  additionalRequirements?: string;
  // Consultation fields
  consultationType?: string;
  businessSize?: string;
  currentChallenges?: string;
  goals?: string;
  preferredMeetingType?: string;
  // Booking inquiry fields
  preferredTimeframe?: string;
  meetingDuration?: string;
  urgency?: string;
  // Service interest
  serviceInterest?: string;
  [key: string]: any;
}

export interface ContactResult {
  success: boolean;
  message: string;
  id?: string | undefined;
}

/**
 * Send contact form email using EmailJS
 */
export const sendContactForm = async (formData: ContactFormData): Promise<ContactResult> => {
  try {
    // Validate EmailJS configuration
    const configValidation = validateEmailJSConfig();
    if (!configValidation.isValid) {
      throw new Error(`EmailJS configuration error: ${configValidation.errors.join(', ')}`);
    }

    // Send contact email via EmailJS
    const result = await sendContactEmail(formData);

    if (result.success) {
      return {
        success: true,
        message: 'Contact form submitted successfully'
      };
    } else {
      throw new Error(result.message);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact form submission error:', errorMessage);
    return {
      success: false,
      message: `Failed to submit contact form: ${errorMessage}`
    };
  }
};



/**
 * Send newsletter subscription using EmailJS
 */
export const sendNewsletterSubscription = async (email: string, name?: string): Promise<ContactResult> => {
  try {
    // Validate EmailJS configuration
    const configValidation = validateEmailJSConfig();
    if (!configValidation.isValid) {
      throw new Error(`EmailJS configuration error: ${configValidation.errors.join(', ')}`);
    }

    // Send newsletter subscription via EmailJS
    const formData = {
      name: name || 'Newsletter Subscriber',
      email,
      formType: 'newsletter',
      subject: 'Newsletter Subscription'
    };

    const result = await sendContactEmail(formData);

    if (result.success) {
      return {
        success: true,
        message: 'Newsletter subscription successful'
      };
    } else {
      throw new Error(result.message);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Newsletter subscription error:', errorMessage);
    return {
      success: false,
      message: `Failed to subscribe to newsletter: ${errorMessage}`
    };
  }
};

// Removed unused getDefaultSubject function

/**
 * Format message content based on form type and data
 */
function formatMessage(formData: ContactFormData): string {
  let message = formData.message || '';
  
  // Add form-specific information
  if (formData.formType === 'project') {
    const projectInfo = [];
    if (formData.projectType) projectInfo.push(`Project Type: ${formData.projectType}`);
    if (formData.projectDescription) projectInfo.push(`Description: ${formData.projectDescription}`);
    if (formData.budget) projectInfo.push(`Budget: ${formData.budget}`);
    if (formData.timeline) projectInfo.push(`Timeline: ${formData.timeline}`);
    if (formData.currentWebsite) projectInfo.push(`Current Website: ${formData.currentWebsite}`);
    if (formData.additionalRequirements) projectInfo.push(`Additional Requirements: ${formData.additionalRequirements}`);
    
    if (projectInfo.length > 0) {
      message = `${message}\n\n--- Project Details ---\n${projectInfo.join('\n')}`;
    }
  } else if (formData.formType === 'consultation' || formData.formType === 'booking') {
    const consultationInfo = [];
    if (formData.consultationType) consultationInfo.push(`Consultation Type: ${formData.consultationType}`);
    if (formData.businessSize) consultationInfo.push(`Business Size: ${formData.businessSize}`);
    if (formData.currentChallenges) consultationInfo.push(`Current Challenges: ${formData.currentChallenges}`);
    if (formData.goals) consultationInfo.push(`Goals: ${formData.goals}`);
    if (formData.preferredMeetingType) consultationInfo.push(`Preferred Meeting Type: ${formData.preferredMeetingType}`);
    if (formData.preferredTimeframe) consultationInfo.push(`Preferred Timeframe: ${formData.preferredTimeframe}`);
    if (formData.meetingDuration) consultationInfo.push(`Meeting Duration: ${formData.meetingDuration}`);
    
    if (consultationInfo.length > 0) {
      const sectionTitle = formData.formType === 'booking' ? '--- Booking Details ---' : '--- Consultation Details ---';
      message = `${message}\n\n${sectionTitle}\n${consultationInfo.join('\n')}`;
    }
  } else {
    // General contact form
    const generalInfo = [];
    if (formData.serviceInterest) generalInfo.push(`Service Interest: ${formData.serviceInterest}`);
    if (formData.budget) generalInfo.push(`Budget: ${formData.budget}`);
    if (formData.timeline) generalInfo.push(`Timeline: ${formData.timeline}`);
    if (formData.urgency) generalInfo.push(`Urgency: ${formData.urgency}`);
    
    if (generalInfo.length > 0) {
      message = `${message}\n\n--- Additional Information ---\n${generalInfo.join('\n')}`;
    }
  }
  
  // Add contact information
  const contactInfo = [];
  if (formData.phone) contactInfo.push(`Phone: ${formData.phone}`);
  if (formData.company) contactInfo.push(`Company: ${formData.company}`);
  
  if (contactInfo.length > 0) {
    message = `${message}\n\n--- Contact Information ---\n${contactInfo.join('\n')}`;
  }
  
  return message;
}

/**
 * Test the contact service configuration
 */
export const testContactService = async (): Promise<ContactResult> => {
  try {
    const configValidation = validateEmailJSConfig();
    
    if (configValidation.isValid) {
      return {
        success: true,
        message: 'EmailJS service is properly configured'
      };
    } else {
      return {
        success: false,
        message: `EmailJS configuration issues: ${configValidation.errors.join(', ')}`
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact service test error:', errorMessage);
    return {
      success: false,
      message: `Contact service test failed: ${errorMessage}`
    };
  }
};

/**
 * Get contact service status
 */
export const getContactServiceStatus = () => {
  return emailService.getStatus();
};