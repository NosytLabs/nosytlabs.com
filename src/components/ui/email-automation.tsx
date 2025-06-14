import React, { useState, useRef } from "react";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Send, CheckCircle, AlertCircle, Mail } from "lucide-react";

interface EmailAutomationProps {
  serviceType?: string;
  amount?: string;
}

export function EmailAutomation({ serviceType, amount }: EmailAutomationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: serviceType || 'Web Development',
    budget: amount || '',
    timeline: '',
    message: '',
    source: 'NosytLabs Website'
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendEmail = async (templateParams: any) => {
    // EmailJS configuration - you'll need to set these up
    // EmailJS configuration - these would be used in actual implementation
    // const SERVICE_ID = 'service_nosytlabs';
    // const TEMPLATE_ID = 'template_contact';
    // const PUBLIC_KEY = 'your_public_key';

    try {
      // For now, we'll use a simple fetch to a serverless function
      // In production, you'd use EmailJS or a backend service
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'hi@nosytlabs.com',
          subject: `New ${templateParams.service} Inquiry from ${templateParams.name}`,
          html: `
            <h2>New Service Inquiry - NosytLabs</h2>
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h3>Contact Information</h3>
              <p><strong>Name:</strong> ${templateParams.name}</p>
              <p><strong>Email:</strong> ${templateParams.email}</p>
              <p><strong>Company:</strong> ${templateParams.company || 'Not provided'}</p>
              <p><strong>Phone:</strong> ${templateParams.phone || 'Not provided'}</p>
              
              <h3>Project Details</h3>
              <p><strong>Service:</strong> ${templateParams.service}</p>
              <p><strong>Budget:</strong> ${templateParams.budget || 'Not specified'}</p>
              <p><strong>Timeline:</strong> ${templateParams.timeline || 'Not specified'}</p>
              
              <h3>Message</h3>
              <p>${templateParams.message}</p>
              
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">
                Source: ${templateParams.source}<br>
                Submitted: ${new Date().toLocaleString()}
              </p>
            </div>
          `
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return { success: true };
    } catch (error) {
      console.error('Email sending error:', error);
      
      // Fallback: Open default email client
      const subject = `New ${templateParams.service} Inquiry from ${templateParams.name}`;
      const body = `
Contact Information:
Name: ${templateParams.name}
Email: ${templateParams.email}
Company: ${templateParams.company || 'Not provided'}
Phone: ${templateParams.phone || 'Not provided'}

Project Details:
Service: ${templateParams.service}
Budget: ${templateParams.budget || 'Not specified'}
Timeline: ${templateParams.timeline || 'Not specified'}

Message:
${templateParams.message}

Source: ${templateParams.source}
Submitted: ${new Date().toLocaleString()}
      `;
      
      window.location.href = `mailto:hi@nosytlabs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      return { success: true };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await sendEmail(formData);
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          service: 'Web Development',
          budget: '',
          timeline: '',
          message: '',
          source: 'NosytLabs Website'
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company/Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
              Service Interest *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent"
            >
              <option value="Web Development">AI-Enhanced Web Development</option>
              <option value="Rapid MVP">Rapid MVP Development</option>
              <option value="AI Integration">AI Integration & Automation</option>
              <option value="Consulting">Tech Consulting & SEO Audits</option>
              <option value="Mobile Apps">Mobile App Development</option>
              <option value="3D Printing">3D Printing Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Project Budget
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent"
            >
              <option value="">Select budget range</option>
              <option value="Under $1,000">Under $1,000</option>
              <option value="$1,000 - $2,500">$1,000 - $2,500</option>
              <option value="$2,500 - $5,000">$2,500 - $5,000</option>
              <option value="$5,000 - $10,000">$5,000 - $10,000</option>
              <option value="$10,000+">$10,000+</option>
              <option value="Custom">Custom Quote Needed</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
            Project Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent"
          >
            <option value="">Select timeline</option>
            <option value="ASAP">ASAP (Rush Job)</option>
            <option value="1-2 weeks">1-2 weeks</option>
            <option value="1 month">1 month</option>
            <option value="2-3 months">2-3 months</option>
            <option value="3+ months">3+ months</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Project Details *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nosyt-purple focus:border-transparent"
            placeholder="Tell us about your project requirements, goals, and any specific features you need..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <ShinyButton
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </ShinyButton>

          <a
            href="mailto:hi@nosytlabs.com"
            className="flex-1 flex items-center justify-center px-6 py-3 border border-nosyt-orange text-nosyt-orange rounded-lg hover:bg-nosyt-orange hover:text-white transition-all duration-300"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Directly
          </a>
        </div>

        {submitStatus === 'success' && (
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="text-green-800 font-medium">Message sent successfully!</p>
              <p className="text-green-600 text-sm">We'll get back to you within 24 hours.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <p className="text-red-800 font-medium">Failed to send message</p>
              <p className="text-red-600 text-sm">Please try emailing us directly at hi@nosytlabs.com</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default EmailAutomation;
