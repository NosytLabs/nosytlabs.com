import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedSubscribeButton } from "@/components/forms/animated-subscribe-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/ui/icon";

function EnhancedContactForm() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    service: 'Web Development'
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters long';
        }
        return '';
      
      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        return '';
      
      case 'subject':
        if (!value.trim()) {
          return 'Subject is required';
        }
        if (value.trim().length < 3) {
          return 'Subject must be at least 3 characters long';
        }
        return '';
      
      case 'message':
        if (!value.trim()) {
          return 'Message is required';
        }
        if (value.trim().length < 10) {
          return 'Message must be at least 10 characters long';
        }
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'service') { // Service is not required
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) {
          errors[key] = error;
        }
      }
    });
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (!validateForm()) {
        // Announce validation error to screen readers
        if (typeof window.announceToScreenReader === 'function') {
          window.announceToScreenReader('Form contains validation errors. Please review and correct the highlighted fields.');
        }
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Failed to submit form');
      }

      const result = await response.json();
      if (result.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          service: 'Web Development'
        });

        // Announce success to screen readers
        if (typeof window.announceToScreenReader === 'function') {
          window.announceToScreenReader('Contact form submitted successfully. Thank you for your message! We will get back to you soon.');
        }
      } else {
        throw new Error(result.error ?? 'Failed to submit form');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      setSubmitError(errorMessage);

      // Announce error to screen readers
      if (typeof window.announceToScreenReader === 'function') {
        window.announceToScreenReader(`Error submitting form: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }

    // Real-time validation (debounced)
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
      
      // Field validation completed (validFields state removed)
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Field validation completed (validFields state removed)
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    
    // Clear any previous submit error when user focuses on a field
    if (submitError) {
      setSubmitError(null);
    }

    // Clear field error when user focuses back on the field
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center">
            <Icon name="checkCircle" size={20} className="text-green-600 mr-2" />
            <span className="text-green-800 dark:text-green-200">
              Thank you! Your message has been sent successfully. We'll get back to you soon.
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center">
            <Icon name="xCircle" size={20} className="text-red-600 mr-2" />
            <span className="text-red-800 dark:text-red-200">
              {submitError}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            id="name"
            name="name"
            type="text"
            label="Name *"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            required
            size="lg"
            placeholder="Your full name"
            aria-label="Full Name"
            aria-required="true"
            error={touchedFields.name ? (fieldErrors.name || '') : ''}
            aria-describedby={touchedFields.name && fieldErrors.name ? 'name-error' : undefined}
            aria-invalid={touchedFields.name && fieldErrors.name ? 'true' : 'false'}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email *"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            required
            size="lg"
            placeholder="your@email.com"
            aria-label="Email Address"
            aria-required="true"
            error={touchedFields.email ? (fieldErrors.email || '') : ''}
            aria-describedby={touchedFields.email && fieldErrors.email ? 'email-error' : undefined}
            aria-invalid={touchedFields.email && fieldErrors.email ? 'true' : 'false'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="service" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Service Interest
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="Web Development">Web Development</option>
            <option value="AI Integration">AI Integration</option>
            <option value="Mobile Apps">Mobile Apps</option>
            <option value="Consulting">Consulting</option>
            <option value="3D Printing">3D Printing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          id="subject"
          name="subject"
          type="text"
          label="Subject *"
          value={formData.subject}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          required
          size="lg"
          placeholder="Brief description of your project"
          aria-label="Subject"
          aria-required="true"
          error={touchedFields.subject ? (fieldErrors.subject || '') : ''}
          aria-describedby={touchedFields.subject && fieldErrors.subject ? 'subject-error' : undefined}
          aria-invalid={touchedFields.subject && fieldErrors.subject ? 'true' : 'false'}
        />

        <Textarea
          id="message"
          name="message"
          label="Message *"
          value={formData.message}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          required
          size="lg"
          placeholder="Tell us about your project requirements..."
          aria-label="Project Message"
          aria-required="true"
          rows={5}
          error={touchedFields.message ? (fieldErrors.message || '') : ''}
          aria-describedby={touchedFields.message && fieldErrors.message ? 'message-error' : undefined}
          aria-invalid={touchedFields.message && fieldErrors.message ? 'true' : 'false'}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icon name="loader" size={16} className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Icon name="send" size={16} className="mr-2" />
                Send Message
              </>
            )}
          </Button>
          
          <AnimatedSubscribeButton
            subscribeStatus={isSubscribed}
            onClick={() => setIsSubscribed(!isSubscribed)}
            className="flex-1"
          >
            <span className="flex items-center">
              <Icon name="messageCircle" size={16} className="mr-2" />
              Subscribe to Updates
            </span>
            <span className="flex items-center">
              <Icon name="messageCircle" size={16} className="mr-2" />
              Subscribed!
            </span>
          </AnimatedSubscribeButton>
        </div>
      </form>
    </div>
  );
}

export { EnhancedContactForm };
