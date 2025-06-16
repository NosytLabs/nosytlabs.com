/**
 * Email Service Utility
 * Provides email sending functionality using Resend for NosytLabs
 */

import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY environment variable not found - email features will be disabled');
    return null;
  }
  return new Resend(apiKey);
};

const resend = getResendClient();

// Email configuration
const EMAIL_CONFIG = {
  from: 'NosytLabs <noreply@nosytlabs.com>',
  to: 'hi@nosytlabs.com',
  replyTo: 'hi@nosytlabs.com'
};

// Email templates
export const EMAIL_TEMPLATES = {
  contactForm: {
    subject: (name: string, service?: string) => 
      `New Contact Form Submission${service ? ` - ${service}` : ''} from ${name}`,
    
    html: (data: {
      name: string;
      email: string;
      subject?: string;
      message: string;
      serviceType?: string;
      budgetRange?: string;
      timeline?: string;
    }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission - NosytLabs</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed, #ff6b35); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #7c3aed; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #ff6b35; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Contact Form Submission</h1>
              <p>Someone has reached out through the NosytLabs website!</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${data.name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              
              ${data.subject ? `
                <div class="field">
                  <div class="label">📝 Subject:</div>
                  <div class="value">${data.subject}</div>
                </div>
              ` : ''}
              
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
              
              ${data.serviceType ? `
                <div class="field">
                  <div class="label">🛠️ Service Type:</div>
                  <div class="value">${data.serviceType}</div>
                </div>
              ` : ''}
              
              ${data.budgetRange ? `
                <div class="field">
                  <div class="label">💰 Budget Range:</div>
                  <div class="value">${data.budgetRange}</div>
                </div>
              ` : ''}
              
              ${data.timeline ? `
                <div class="field">
                  <div class="label">⏰ Timeline:</div>
                  <div class="value">${data.timeline}</div>
                </div>
              ` : ''}
              
              <div class="footer">
                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>Reply to this email to respond directly to ${data.name}</li>
                  <li>Check the NosytLabs dashboard for additional details</li>
                  <li>Follow up within 24 hours for best customer experience</li>
                </ul>
                
                <p><em>This email was automatically generated from the NosytLabs contact form.</em></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    
    text: (data: {
      name: string;
      email: string;
      subject?: string;
      message: string;
      serviceType?: string;
      budgetRange?: string;
      timeline?: string;
    }) => `
New Contact Form Submission - NosytLabs

Name: ${data.name}
Email: ${data.email}
${data.subject ? `Subject: ${data.subject}\n` : ''}
Message: ${data.message}
${data.serviceType ? `Service Type: ${data.serviceType}\n` : ''}
${data.budgetRange ? `Budget Range: ${data.budgetRange}\n` : ''}
${data.timeline ? `Timeline: ${data.timeline}\n` : ''}

Reply to this email to respond directly to ${data.name}.

---
This email was automatically generated from the NosytLabs contact form.
    `
  }
};

// Email sending functions
export class EmailService {
  
  /**
   * Send contact form notification email
   */
  static async sendContactFormNotification(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    serviceType?: string;
    budgetRange?: string;
    timeline?: string;
  }) {
    try {
      if (!resend) {
        console.warn('⚠️ Resend not configured - skipping email notification');
        return { success: false, error: 'Email service not configured' };
      }

      const emailData = {
        from: EMAIL_CONFIG.from,
        to: EMAIL_CONFIG.to,
        replyTo: data.email, // Allow direct reply to the contact
        subject: EMAIL_TEMPLATES.contactForm.subject(data.name, data.serviceType),
        html: EMAIL_TEMPLATES.contactForm.html(data),
        text: EMAIL_TEMPLATES.contactForm.text(data)
      };

      const result = await resend.emails.send(emailData);

      if (result.error) {
        console.error('❌ Email sending failed:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log('✅ Contact form notification email sent successfully:', result.data?.id);
      return { success: true, emailId: result.data?.id };

    } catch (error) {
      console.error('❌ Email service error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown email error' 
      };
    }
  }

  /**
   * Test email connection
   */
  static async testConnection() {
    try {
      if (!resend) {
        return { success: false, error: 'Resend not configured' };
      }

      // Send a simple test email
      const result = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: EMAIL_CONFIG.to,
        subject: 'NosytLabs Email Service Test',
        text: 'This is a test email to verify the email service is working correctly.',
        html: '<p>This is a test email to verify the email service is working correctly.</p>'
      });

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      return { success: true, emailId: result.data?.id };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export default EmailService;
