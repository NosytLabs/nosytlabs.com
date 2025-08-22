/**
 * Contact Service
 * 
 * Service for handling contact form submissions using Resend email service
 */

import emailService from '../lib/EmailService';

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
 * Send contact form email using Resend
 */
export const sendContactForm = async (formData: ContactFormData): Promise<ContactResult> => {
  try {
    const timestamp = new Date().toISOString();
    
    // Prepare contact data based on form type
    const contactData = {
      name: formData.name,
      email: formData.email,
      message: formatMessage(formData),
      timestamp,
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.company && { company: formData.company }),
      ...(formData.subject && { subject: formData.subject }),
      ...(formData.serviceInterest && { service: formData.serviceInterest })
    };

    // Send confirmation email to user
    const confirmationResult = await emailService.sendContactConfirmation(contactData);
    
    // Send notification email to admin
    const adminResult = await emailService.sendAdminContactNotification(contactData);

    if (confirmationResult.success && adminResult.success) {
      return {
        success: true,
        message: 'Contact form submitted successfully',
        id: confirmationResult.id
      };
    } else {
      throw new Error('Failed to send one or more emails');
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
 * Send project inquiry form
 */
export const sendProjectInquiry = async (formData: ContactFormData): Promise<ContactResult> => {
  try {
    const timestamp = new Date().toISOString();
    
    const projectData = {
      name: formData.name,
      email: formData.email,
      projectType: formData.projectType || 'General Project',
      timestamp,
      ...(formData.message && { message: formData.message }),
      ...(formData.company && { company: formData.company })
    };

    // Send confirmation email to user
    const confirmationResult = await emailService.sendProjectInquiryConfirmation(projectData);
    
    // Send notification email to admin
    const adminResult = await emailService.sendAdminProjectNotification(projectData);

    if (confirmationResult.success && adminResult.success) {
      return {
        success: true,
        message: 'Project inquiry submitted successfully',
        id: confirmationResult.id
      };
    } else {
      throw new Error('Failed to send one or more emails');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Project inquiry submission error:', errorMessage);
    return {
      success: false,
      message: `Failed to submit project inquiry: ${errorMessage}`
    };
  }
};

/**
 * Send newsletter subscription
 */
export const sendNewsletterSubscription = async (email: string, name?: string): Promise<ContactResult> => {
  try {
    const timestamp = new Date().toISOString();
    
    const subscriberData = {
      name: name || 'Newsletter Subscriber',
      email,
      timestamp,
      status: 'active'
    };

    // Send welcome email to subscriber
    const welcomeResult = await emailService.sendNewsletterWelcome(subscriberData);
    
    // Send notification email to admin
    const adminResult = await emailService.sendAdminNewsletterNotification(subscriberData);

    if (welcomeResult.success && adminResult.success) {
      return {
        success: true,
        message: 'Newsletter subscription successful',
        id: welcomeResult.id
      };
    } else {
      throw new Error('Failed to send one or more emails');
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
  } else if (formData.formType === 'consultation') {
    const consultationInfo = [];
    if (formData.consultationType) consultationInfo.push(`Consultation Type: ${formData.consultationType}`);
    if (formData.businessSize) consultationInfo.push(`Business Size: ${formData.businessSize}`);
    if (formData.currentChallenges) consultationInfo.push(`Current Challenges: ${formData.currentChallenges}`);
    if (formData.goals) consultationInfo.push(`Goals: ${formData.goals}`);
    if (formData.preferredMeetingType) consultationInfo.push(`Preferred Meeting Type: ${formData.preferredMeetingType}`);
    
    if (consultationInfo.length > 0) {
      message = `${message}\n\n--- Consultation Details ---\n${consultationInfo.join('\n')}`;
    }
  } else {
    // General contact form
    const generalInfo = [];
    if (formData.serviceInterest) generalInfo.push(`Service Interest: ${formData.serviceInterest}`);
    if (formData.budget) generalInfo.push(`Budget: ${formData.budget}`);
    if (formData.timeline) generalInfo.push(`Timeline: ${formData.timeline}`);
    
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
    const testResult = await emailService.testConfiguration();
    return {
      success: testResult.success,
      message: testResult.message,
      id: testResult.id
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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