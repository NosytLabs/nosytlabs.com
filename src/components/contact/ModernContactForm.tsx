import React, { useState, useCallback } from 'react';
// Removed unused form component imports
import { ReCAPTCHA } from '../security';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { useUnifiedForm } from '../../hooks/useUnifiedForm';
import { serviceOptions } from '../../config/services';
import { sendContactForm, type ContactFormData as ContactServiceData } from '../../services/contact';
import { z } from 'zod';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Type definition for form data
type ContactFormData = z.infer<typeof contactFormSchema>;

export function ModernContactForm() {
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const form = useUnifiedForm<ContactFormData>({
    schema: contactFormSchema,
    onSubmit: async (data) => {
      setSubmissionStatus('submitting');
      
      try {
        // Prepare contact data
        const contactData: ContactServiceData = {
          name: data.name,
          email: data.email,
          message: data.message,
          subject: `Service Inquiry: ${data.service}`,
          formType: 'general',
          serviceInterest: data.service,
          ...(data.phone && { phone: data.phone })
        };

        // Send contact form using Resend
        const result = await sendContactForm(contactData);

        if (!result.success) {
          throw new Error(result.message || 'Failed to send message');
        }

        setSubmissionStatus('success');
        form.resetForm();
        setRecaptchaToken(null);
      } catch (error) {
        console.error('Form submission error:', error);
        setSubmissionStatus('error');
      }
    },
  });

  // Form state is accessed via form.register() and form.getFieldState() methods

  const handleReCaptchaChange = useCallback((token: string | null) => {
    setRecaptchaToken(token);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      setSubmissionStatus('error');
      return;
    }

    await form.handleSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Input
              {...form.register('name')}
              type="text"
              label="Name *"
              placeholder="Your full name"
              {...(form.getFieldState('name').errorMessage ? {
                errorMessage: form.getFieldState('name').errorMessage!
              } : {})}
            />
          </div>
          <div>
            <Input
              {...form.register('email')}
              type="email"
              label="Email *"
              placeholder="your.email@example.com"
              {...(form.getFieldState('email').errorMessage ? {
                errorMessage: form.getFieldState('email').errorMessage!
              } : {})}
            />
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            {...form.register('phone')}
            type="tel"
            label="Phone"
            placeholder="(555) 123-4567"
            {...(form.getFieldState('phone').errorMessage ? {
              errorMessage: form.getFieldState('phone').errorMessage!
            } : {})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Service of Interest *
          </label>
          <Select
            {...form.register('service')}
            options={serviceOptions}
            placeholder="Select a service"
            variant={form.getFieldState('service').errorMessage ? 'error' : 'default'}
          />
          {form.getFieldState('service').errorMessage && (
            <p className="mt-1 text-sm text-critical">
              {form.getFieldState('service').errorMessage}
            </p>
          )}
        </div>
      </div>
      <div>
          <Textarea
            {...form.register('message')}
            rows={4}
            label="Message *"
            placeholder="Tell us about your project or how we can help you..."
            {...(form.getFieldState('message').errorMessage ? {
              errorMessage: form.getFieldState('message').errorMessage!
            } : {})}
          />
        </div>
      <div className="flex justify-center">
        <ReCAPTCHA onVerify={handleReCaptchaChange} />
      </div>
      {!recaptchaToken && (
        <p className="text-sm text-red-600 text-center">
          Please complete the reCAPTCHA.
        </p>
      )}
      <div className="text-center">
        <Button
          type="submit"
          disabled={submissionStatus === 'submitting' || !recaptchaToken}
          className="w-full md:w-auto"
        >
          {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
      {submissionStatus === 'success' && (
        <p className="text-sm text-success text-center">
          Message sent successfully!
        </p>
      )}
      {submissionStatus === 'error' && (
        <p className="text-sm text-danger text-center">
          Failed to send message. Please try again.
        </p>
      )}
    </form>
  );
}