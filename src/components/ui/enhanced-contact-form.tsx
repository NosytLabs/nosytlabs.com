import React, { useState } from "react";
import { ShinyButton } from "@/components/ui/shiny-button";
import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ValidationError, NetworkError } from "@/utils/error-handling";
import { Send, Mail, MessageCircle } from "lucide-react";

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

  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new ValidationError('Name is required', 'name');
    }
    if (!formData.email.trim()) {
      throw new ValidationError('Email is required', 'email');
    }
    if (!formData.message.trim()) {
      throw new ValidationError('Message is required', 'message');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new ValidationError('Please enter a valid email address', 'email');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      validateForm();

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new NetworkError(errorData.error ?? 'Failed to submit form', response.status);
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
      } else {
        throw new NetworkError(result.error ?? 'Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (error instanceof ValidationError || error instanceof NetworkError) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
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
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 dark:text-red-200">
              {submitError}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-nosyt-purple/20 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent dark:border-nosyt-purple/30 dark:bg-gray-800"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-nosyt-purple/20 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent dark:border-nosyt-purple/30 dark:bg-gray-800"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Service Interest
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-nosyt-purple/20 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent dark:border-nosyt-purple/30 dark:bg-gray-800"
          >
            <option value="Web Development">Web Development</option>
            <option value="AI Integration">AI Integration</option>
            <option value="Mobile Apps">Mobile Apps</option>
            <option value="Consulting">Consulting</option>
            <option value="3D Printing">3D Printing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-nosyt-purple/20 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent dark:border-nosyt-purple/30 dark:bg-gray-800"
            placeholder="Brief description of your project"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-4 py-3 border border-nosyt-purple/20 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent dark:border-nosyt-purple/30 dark:bg-gray-800"
            placeholder="Tell us about your project requirements..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <ShinyButton 
            type="submit" 
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </ShinyButton>
          
          <AnimatedSubscribeButton
            subscribeStatus={isSubscribed}
            onClick={() => setIsSubscribed(!isSubscribed)}
            className="flex-1"
          >
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Subscribe to Updates
            </span>
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Subscribed!
            </span>
          </AnimatedSubscribeButton>
        </div>
      </form>
    </div>
  );
}

// Export wrapped component with error boundary
export function EnhancedContactFormWithBoundary() {
  return (
    <ErrorBoundary
      fallback={(_error, _errorInfo, retry) => (
        <div className="max-w-2xl mx-auto p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Contact Form Error
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">
            We're experiencing technical difficulties with the contact form. 
            Please try refreshing the page or contact us directly at contact@nosytlabs.com
          </p>
          <button 
            onClick={retry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Contact form error:', error, errorInfo);
        // You could send this to an error reporting service
      }}
    >
      <EnhancedContactForm />
    </ErrorBoundary>
  );
}

// Keep the original export for backward compatibility
export { EnhancedContactForm };
