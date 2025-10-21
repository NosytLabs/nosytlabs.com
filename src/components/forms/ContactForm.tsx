import React, { useState } from 'react';
import { Input } from '../ui/input';
import { validateContactForm, type ContactFormData } from '@/lib/forms/form-validator';
import { useToast } from '@/hooks/use-toast';
import type { BaseComponentProps } from '@/types';

interface ContactFormProps extends BaseComponentProps {
  onSubmit?: (data: ContactFormData) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    subject: '',
    service: ''
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Import and use the form service
      const { submitContactForm } = await import('@/lib/forms/form-service');
      const result = await submitContactForm(formData);

      if (result.success) {
        toast({
          title: "Message sent!",
          description: result.message,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
          subject: '',
          service: ''
        });
        
        onSubmit?.(formData);
      } else {
        toast({
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={errors.name}
          required
          placeholder="John Doe"
          autoComplete="name"
          aria-describedby="name-help name-error"
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          required
          placeholder="john@example.com"
          autoComplete="email"
          aria-describedby="email-help email-error"
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        
        <Input
          label="Subject"
          type="text"
          value={formData.subject}
          onChange={handleInputChange('subject')}
          error={errors.subject}
          required
          placeholder="Project inquiry"
          autoComplete="off"
          aria-describedby="subject-help subject-error"
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            Message <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <textarea
              id="message"
              value={formData.message}
              onChange={handleInputChange('message')}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg resize-vertical transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60 ${
                errors.message
                  ? 'border-destructive bg-destructive/5 text-destructive'
                  : 'border-input bg-background text-foreground'
              }`}
              placeholder="Tell us about your project, goals, and timeline..."
              required
              aria-describedby="message-help message-error message-counter"
              aria-invalid={!!errors.message}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {formData.message.length}/2000
            </div>
          </div>
          {errors.message && (
            <div id="message-error" className="flex items-center gap-2 text-sm text-destructive animate-fade-in" role="alert">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.message}
            </div>
          )}
          <p id="message-help" className="text-xs text-muted-foreground">
            Please provide at least 10 characters to help us understand your needs
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 min-h-[44px] px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isSubmitting
                ? 'bg-primary/70 text-primary-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]'
            }`}
            aria-describedby="submit-status"
            aria-label={isSubmitting ? 'Sending message...' : 'Send contact message'}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Send Message
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </span>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                message: '',
                subject: '',
                service: ''
              });
              setErrors({});
            }}
            disabled={isSubmitting}
            className="px-6 py-3 min-h-[44px] rounded-lg font-medium border border-border bg-background text-foreground hover:bg-muted/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Form
          </button>
        </div>
        
        <div id="submit-status" className="sr-only" aria-live="polite" aria-atomic="true">
          {isSubmitting ? 'Form is being submitted, please wait' : 'Form ready to submit'}
        </div>
      </div>
    </form>
  );
}
