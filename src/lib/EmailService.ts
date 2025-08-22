import { Resend } from 'resend';

interface EmailData {
  name: string;
  email: string;
  timestamp: string;
  [key: string]: any;
}

interface ContactData extends EmailData {
  subject?: string;
  message: string;
  service?: string;
  company?: string;
}

interface ProjectData extends EmailData {
  projectType: string;
}

interface SubscriberData extends EmailData {
  status?: string;
}

class EmailService {
  private resend: Resend | null = null;
  private isInitialized = false;
  private templateCache = new Map<string, string>();
  private fromEmail = 'noreply@nosytlabs.com';
  private replyToEmail = 'hello@nosytlabs.com';
  private adminEmail = 'admin@nosytlabs.com';

  // Color tokens for email templates
  private colors = {
    primary: 'var(--color-primary-500)',
    secondary: 'var(--color-secondary-500)',
    success: 'var(--color-success-500)',
    warning: 'var(--color-warning-500)',
    error: 'var(--color-error-500)',
    info: 'var(--color-info-500)',
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      muted: 'var(--color-text-muted)'
    },
    background: {
      primary: 'var(--color-background-primary)',
      secondary: 'var(--color-background-secondary)',
      muted: 'var(--color-background-muted)',
      success: 'var(--color-background-success)',
      warning: 'var(--color-background-warning)',
      error: 'var(--color-background-error)',
      info: 'var(--color-background-info)'
    },
    border: {
      primary: 'var(--color-border-primary)',
      success: 'var(--color-border-success)',
      warning: 'var(--color-border-warning)',
      error: 'var(--color-border-error)',
      info: 'var(--color-border-info)'
    }
  };

  async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  async initialize(): Promise<void> {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error('RESEND_API_KEY environment variable is required');
      }

      this.resend = new Resend(apiKey);
      this.isInitialized = true;
      console.log('[SUCCESS] EmailService initialized successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ERROR] Failed to initialize EmailService:', errorMessage);
      throw error;
    }
  }

  async loadTemplate(templateName: string): Promise<string> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    try {
      // For now, return a basic template structure
      // In production, this would load from a template file or database
      const template = this.getDefaultTemplate(templateName);
      this.templateCache.set(templateName, template);
      return template;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[ERROR] Failed to load email template ${templateName}:`, errorMessage);
      throw new Error(`Email template ${templateName} not found`);
    }
  }

  private getDefaultTemplate(templateName: string): string {
    const templates: Record<string, string> = {
      'contact-confirmation': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${this.colors.background.primary}; color: ${this.colors.text.primary};">
          <h2 style="color: ${this.colors.primary}; margin-bottom: 20px;">Thank you for contacting NosytLabs!</h2>
          <p style="color: ${this.colors.text.primary}; line-height: 1.6;">Hi {{name}},</p>
          <p style="color: ${this.colors.text.primary}; line-height: 1.6;">We've received your message and will get back to you soon.</p>
          <p style="color: ${this.colors.text.secondary}; margin-top: 20px;"><strong>Submitted:</strong> {{timestamp}}</p>
        </div>
      `,
      'newsletter-welcome': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${this.colors.background.primary}; color: ${this.colors.text.primary};">
          <h2 style="color: ${this.colors.success}; margin-bottom: 20px;">Welcome to NosytLabs Newsletter!</h2>
          <p style="color: ${this.colors.text.primary}; line-height: 1.6;">Hi {{name}},</p>
          <p style="color: ${this.colors.text.primary}; line-height: 1.6;">Thank you for subscribing to our newsletter!</p>
          <p style="color: ${this.colors.text.secondary}; margin-top: 20px;"><strong>Subscribed:</strong> {{timestamp}}</p>
        </div>
      `,
      'project-inquiry': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${this.colors.background.primary}; color: ${this.colors.text.primary};">
          <h2 style="color: ${this.colors.secondary}; margin-bottom: 20px;">Project Inquiry Received!</h2>
          <p style="color: ${this.colors.text.primary}; line-height: 1.6;">Hi {{name}},</p>
          <p style="color: ${this.colors.text.primary}; line-height: 1.6;">We're excited about your {{projectType}} project and will be in touch soon!</p>
          <p style="color: ${this.colors.text.secondary}; margin-top: 20px;"><strong>Submitted:</strong> {{timestamp}}</p>
        </div>
      `,
      'admin-project-notification': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${this.colors.background.primary}; color: ${this.colors.text.primary};">
          <h2 style="color: ${this.colors.error}; margin-bottom: 20px;">New Project Inquiry</h2>
          <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Name:</strong> {{name}}</p>
          <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Email:</strong> {{email}}</p>
          <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Project Type:</strong> {{projectType}}</p>
          <p style="color: ${this.colors.text.secondary}; margin-top: 20px;"><strong>Submitted:</strong> {{timestamp}}</p>
        </div>
      `
    };
    
    return templates[templateName] || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${this.colors.background.primary}; color: ${this.colors.text.primary};">
        <h2 style="color: ${this.colors.primary};">Email Template</h2>
        <p style="color: ${this.colors.text.primary};">Template: {{templateName}}</p>
      </div>
    `;
  }

  renderTemplate(template: string, data: Record<string, unknown>): string {
    try {
      let rendered = template;
      
      // Replace simple variables {{variable}}
      rendered = rendered.replace(/\{\{(\w+)\}\}/g, (_, variable) => {
        const value = data[variable];
        return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
      });
      
      // Handle conditional blocks {{#if variable}} ... {{/if}}
      rendered = rendered.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, variable, content) => {
        return data[variable] ? content : '';
      });
      
      // Handle equality conditionals
      rendered = rendered.replace(/\{\{#if\s+\(eq\s+(\w+)\s+"([^"]+)"\)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, variable, value, content) => {
        return data[variable] === value ? content : '';
      });
      
      // Clean up any remaining template syntax
      rendered = rendered.replace(/\{\{[^}]+\}\}/g, '');
      
      return rendered;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ERROR] Template rendering failed:', errorMessage);
      throw new Error('Failed to render email template');
    }
  }

  async sendContactConfirmation(contactData: ContactData): Promise<{ success: boolean; id?: string }> {
    await this.ensureInitialized();
    
    try {
      const template = await this.loadTemplate('contact-confirmation');
      const html = this.renderTemplate(template, {
        ...contactData,
        timestamp: new Date(contactData.timestamp).toLocaleString()
      });

      const result = await this.resend!.emails.send({
        from: this.fromEmail,
        to: contactData.email,
        subject: `Thank you for contacting NosytLabs, ${contactData.name}!`,
        html,
        replyTo: this.fromEmail
      });

      console.log('[SUCCESS] Contact confirmation email sent:', result.data?.id);
      return result.data?.id ? { success: true, id: result.data.id } : { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ERROR] Failed to send contact confirmation:', errorMessage);
      throw new Error(`Failed to send contact confirmation email: ${errorMessage}`);
    }
  }

  async sendNewsletterWelcome(subscriberData: SubscriberData): Promise<{ success: boolean; id?: string }> {
    await this.ensureInitialized();
    
    try {
      const template = await this.loadTemplate('newsletter-welcome');
      const html = this.renderTemplate(template, {
        ...subscriberData,
        timestamp: new Date(subscriberData.timestamp).toLocaleString()
      });

      const result = await this.resend!.emails.send({
        from: this.fromEmail,
        to: subscriberData.email,
        subject: 'Welcome to NosytLabs Newsletter!',
        html,
        replyTo: this.replyToEmail
      });

      console.log('[SUCCESS] Newsletter welcome email sent:', result.data?.id);
      return result.data?.id ? { success: true, id: result.data.id } : { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ERROR] Failed to send newsletter welcome:', errorMessage);
      throw new Error(`Failed to send newsletter welcome email: ${errorMessage}`);
    }
  }

  async sendProjectInquiryConfirmation(projectData: ProjectData): Promise<{ success: boolean; id?: string }> {
    await this.ensureInitialized();
    
    try {
      const template = await this.loadTemplate('project-inquiry');
      const html = this.renderTemplate(template, {
        ...projectData,
        timestamp: new Date(projectData.timestamp).toLocaleString()
      });

      const result = await this.resend!.emails.send({
        from: this.fromEmail,
        to: projectData.email,
        subject: 'Project Inquiry Received - We are Excited to Work With You!',
        html,
        replyTo: this.fromEmail
      });

      console.log('[SUCCESS] Project inquiry confirmation email sent:', result.data?.id);
      return result.data?.id ? { success: true, id: result.data.id } : { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ERROR] Failed to send project inquiry confirmation:', errorMessage);
      throw new Error(`Failed to send project inquiry confirmation email: ${errorMessage}`);
    }
  }

  async sendAdminProjectNotification(projectData: ProjectData): Promise<{ success: boolean; id?: string }> {
    await this.ensureInitialized();
    
    try {
      const template = await this.loadTemplate('admin-project-notification');
      const html = this.renderTemplate(template, {
        ...projectData,
        timestamp: new Date(projectData.timestamp).toLocaleString()
      });

      const result = await this.resend!.emails.send({
        from: this.fromEmail,
        to: this.adminEmail,
        subject: `[ALERT] New Project Inquiry: ${projectData.projectType} - ${projectData.name}`,
        html,
        replyTo: this.replyToEmail
      });

      console.log('[SUCCESS] Admin project notification sent:', result.data?.id);
      return result.data?.id ? { success: true, id: result.data.id } : { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ERROR] Failed to send admin newsletter notification:', errorMessage);
      throw new Error(`Failed to send admin newsletter notification: ${errorMessage}`);
    }
  }

  async sendAdminContactNotification(contactData: ContactData): Promise<{ success: boolean; id?: string }> {
    await this.ensureInitialized();
    
    try {
      const subject = `New Contact: ${contactData.subject || 'General Inquiry'} - ${contactData.name}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${this.colors.background.primary}; color: ${this.colors.text.primary};">
          <h2 style="color: ${this.colors.info}; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="background: ${this.colors.background.secondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid ${this.colors.border.primary};">
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Name:</strong> ${contactData.name}</p>
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Email:</strong> ${contactData.email}</p>
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Subject:</strong> ${contactData.subject || 'Not specified'}</p>
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Service:</strong> ${contactData.service || 'Not specified'}</p>
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Company:</strong> ${contactData.company || 'Not specified'}</p>
            <p style="color: ${this.colors.text.secondary}; line-height: 1.6;"><strong>Submitted:</strong> ${new Date(contactData.timestamp).toLocaleString()}</p>
          </div>
          <div style="background: ${this.colors.background.warning}; padding: 20px; border-radius: 8px; border: 1px solid ${this.colors.border.warning};">
            <h3 style="color: ${this.colors.warning}; margin-top: 0;">Message:</h3>
            <p style="color: ${this.colors.text.primary}; white-space: pre-wrap;">${contactData.message}</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <a href="mailto:${contactData.email}?subject=Re: ${contactData.subject || 'Your inquiry'}&body=Hi ${contactData.name},%0D%0A%0D%0AThank you for contacting NosytLabs..." 
               style="background: ${this.colors.primary}; color: ${this.colors.background.primary}; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reply to ${contactData.name}
            </a>
          </div>
        </div>
      `;

      const result = await this.resend!.emails.send({
        from: this.fromEmail,
        to: this.adminEmail,
        subject,
        html,
        replyTo: contactData.email
      });

      console.log('[SUCCESS] Admin contact notification sent:', result.data?.id);
      return result.data?.id ? { success: true, id: result.data.id } : { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ERROR] Failed to send admin project notification:', errorMessage);
      throw new Error(`Failed to send admin project notification: ${errorMessage}`);
    }
  }

  async sendAdminNewsletterNotification(subscriberData: SubscriberData): Promise<{ success: boolean; id?: string }> {
    await this.ensureInitialized();
    
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${this.colors.background.primary}; color: ${this.colors.text.primary};">
          <h2 style="color: ${this.colors.success}; margin-bottom: 20px;">New Newsletter Subscription</h2>
          <div style="background: ${this.colors.background.success}; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid ${this.colors.border.success};">
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Name:</strong> ${subscriberData.name || 'Not provided'}</p>
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Email:</strong> ${subscriberData.email}</p>
            <p style="color: ${this.colors.text.secondary}; line-height: 1.6;"><strong>Subscribed:</strong> ${new Date(subscriberData.timestamp).toLocaleString()}</p>
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Status:</strong> ${subscriberData.status || 'active'}</p>
          </div>
          <p style="color: ${this.colors.success};">A new subscriber has joined the NosytLabs newsletter!</p>
        </div>
      `;

      const result = await this.resend!.emails.send({
        from: this.fromEmail,
        to: this.adminEmail,
        subject: `[NEWSLETTER] New Newsletter Subscriber: ${subscriberData.email}`,
        html,
        replyTo: this.replyToEmail
      });

      console.log('[SUCCESS] Admin newsletter notification sent:', result.data?.id);
      return result.data?.id ? { success: true, id: result.data.id } : { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ERROR] Failed to send admin contact notification:', errorMessage);
      throw new Error(`Failed to send admin contact notification: ${errorMessage}`);
    }
  }

  async testConfiguration(): Promise<{ success: boolean; message: string; id?: string }> {
    try {
      await this.ensureInitialized();
      
      const testResult = await this.resend!.emails.send({
        from: this.fromEmail,
        to: this.adminEmail,
        subject: 'EmailService Configuration Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: ${this.colors.background.primary}; color: ${this.colors.text.primary};">
            <h2 style="color: ${this.colors.success}; margin-bottom: 20px;">[SUCCESS] EmailService Test Successful</h2>
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;">This is a test email to verify that the EmailService is properly configured.</p>
            <p style="color: ${this.colors.text.secondary}; line-height: 1.6;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p style="color: ${this.colors.text.primary}; line-height: 1.6;"><strong>Service Status:</strong> Operational</p>
          </div>
        `
      });

      console.log('[SUCCESS] Email configuration test successful:', testResult.data?.id);
      return testResult.data?.id ? { success: true, message: 'Email service is properly configured', id: testResult.data.id } : { success: true, message: 'Email service is properly configured' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ERROR] Email configuration test failed:', errorMessage);
      throw new Error(`Email service configuration test failed: ${errorMessage}`);
    }
  }

  clearTemplateCache(): void {
    this.templateCache.clear();
    console.log('[INFO] Template cache cleared');
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      templatesLoaded: this.templateCache.size,
      fromEmail: this.fromEmail,
      adminEmail: this.adminEmail,
      replyToEmail: this.replyToEmail
    };
  }
}

const emailService = new EmailService();

export { EmailService };
export default emailService;