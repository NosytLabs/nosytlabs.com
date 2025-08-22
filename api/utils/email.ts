import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const isProduction = process.env.NODE_ENV === 'production';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailData) {
  try {
    if (!resend) {
      if (isProduction) {
        throw new Error('RESEND_API_KEY is required in production to send emails.');
      }
      console.warn('[email] RESEND_API_KEY not set. Skipping email send in non-production environment.');
      return { success: true, data: { skipped: true, reason: 'RESEND_API_KEY not set (development/test)' } };
    }

    const emailOptions: any = {
      from: process.env.FROM_EMAIL || 'NosytLabs <noreply@nosytlabs.com>',
      to,
      subject,
      html,
    };
    
    if (text) {
      emailOptions.text = text;
    }
    
    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error('Email sending error:', error);
      const errorMessage = typeof error === 'string' ? error : (error as any)?.message || 'Email sending failed';
      throw new Error(errorMessage);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

export function createContactEmailTemplate(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  service?: string;
}) {
  const { name, email, subject, message, service } = data;
  
  return {
    subject: `New Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    `,
  };
}

export function createAutoReplyTemplate(name: string) {
  return {
    subject: `We received your message, ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thanks for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We’ve received your message and will get back to you shortly.</p>
        <p>Best regards,<br/>NosytLabs Team</p>
      </div>
    `,
    text: `Hi ${name},\n\nWe’ve received your message and will get back to you shortly.\n\nBest regards,\nNosytLabs Team`,
  };
}