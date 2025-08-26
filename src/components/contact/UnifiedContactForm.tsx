import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { ReCAPTCHA } from '../security';
import { BookingWizard } from '../booking/BookingWizard';
// Removed EmailJS simple-contact import
// import { sendContactEmail, validateContactForm, type ContactFormData } from '../../services/simple-contact';
import { Calendar, MessageSquare, Rocket, User, Mail, Phone, Building, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { UnifiedErrorBoundary } from '../error/UnifiedErrorBoundary';
import { Progress } from '../ui/progress';
import PageTransition from '../ui/page-transition';
import useCSRFToken from '../../hooks/useCSRFToken';
import { sendContactEmail, validateEmailJSConfig } from '../../services/emailjs';
// Enhanced validation schemas
const baseContactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  phone: z.string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-\(\)]*[\d\s\-\(\)]{7,15}$/;
      return phoneRegex.test(val.replace(/\s/g, ''));
    }, 'Please enter a valid phone number'),
  company: z.string().max(100, 'Company name must not exceed 100 characters').optional(),
});

const generalContactSchema = baseContactSchema.extend({
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
  serviceInterest: z.enum(['web-development', 'ai-integration', 'consulting', 'other']).optional(),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

const projectInquirySchema = baseContactSchema.extend({
  projectType: z.enum(['website', 'web-app', 'ai-integration', 'consulting', 'other']),
  projectDescription: z.string()
    .min(50, 'Please provide a detailed project description (at least 50 characters)')
    .max(3000, 'Description must not exceed 3000 characters'),
  aiRequirements: z.string()
    .max(1000, 'AI requirements must not exceed 1000 characters')
    .optional(),
  
  budget: z.enum(['under-5k', '5k-15k', '15k-50k', '50k-plus', 'not-sure']),
  timeline: z.enum(['asap', '1-month', '2-3-months', '3-6-months', 'flexible']),
  currentWebsite: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  additionalRequirements: z.string()
    .max(1000, 'Additional requirements must not exceed 1000 characters')
    .optional(),
  hasExistingTeam: z.boolean().optional(),
  preferredTechStack: z.string().max(200, 'Tech stack preferences must not exceed 200 characters').optional(),
});

const bookingInquirySchema = baseContactSchema.extend({
  consultationType: z.enum(['strategy', 'technical-audit', 'ai-readiness', 'digital-transformation', 'mvp-development', 'performance-optimization', 'security-audit', 'other']),
      businessSize: z.enum(['startup', 'small-business', 'medium-business', 'enterprise']),
      currentChallenges: z.string()
        .min(30, 'Please describe your current challenges (at least 30 characters)')
        .max(2000, 'Description must not exceed 2000 characters'),
      goals: z.string()
        .min(20, 'Please describe your goals (at least 20 characters)')
        .max(2000, 'Goals description must not exceed 2000 characters'),
      preferredMeetingType: z.enum(['video-call', 'phone-call', 'in-person', 'email']),
      preferredTimeframe: z.enum(['this-week', 'next-week', '2-weeks', 'this-month', 'flexible']),
      meetingDuration: z.enum(['30-min', '45-min', '60-min', '90-min', '2-hours']),
      timezone: z.string().optional()
        .refine((val) => {
          if (!val) return true;
          const timezoneRegex = /^[A-Z][a-z]+\/[A-Z][a-z_]+$/;
          return timezoneRegex.test(val);
        }, 'Please select a valid timezone'),
});

type FormType = 'general' | 'project' | 'booking';

type UnifiedFormData = {
  // Base fields
  name: string;
  email: string;
  phone?: string;
  company?: string;
  // General contact fields
  subject?: string;
  message?: string;
  serviceInterest?: 'web-development' | 'ai-integration' | 'consulting' | 'other';
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  // Project inquiry fields
  projectType?: 'website' | 'web-app' | 'ai-integration' | 'consulting' | 'other';
  projectDescription?: string;
  budget?: 'under-5k' | '5k-15k' | '15k-50k' | '50k-plus' | 'not-sure';
  timeline?: 'asap' | '1-month' | '2-3-months' | '3-6-months' | 'flexible';
  currentWebsite?: string;
  additionalRequirements?: string;
  hasExistingTeam?: boolean;
  preferredTechStack?: string;
  aiRequirements?: string;
  // Booking inquiry fields
  consultationType?: 'strategy' | 'technical-audit' | 'ai-readiness' | 'digital-transformation' | 'other';
  businessSize?: 'startup' | 'small-business' | 'medium-business' | 'enterprise';
  currentChallenges?: string;
  goals?: string;
  preferredMeetingType?: 'video-call' | 'phone-call' | 'in-person' | 'email';
  preferredTimeframe?: 'this-week' | 'next-week' | '2-weeks' | 'flexible';
  meetingDuration?: '30-min' | '60-min' | '90-min' | '2-hours';
  timezone?: string;
};

interface UnifiedContactFormProps {
  initialFormType?: FormType;
  className?: string;
  showFormTypeSelector?: boolean;
}

const formTypeConfig = {
  general: {
    label: 'General Contact',
    icon: MessageSquare,
    description: 'General inquiries and questions',
    schema: generalContactSchema,
  },
  project: {
    label: 'Project Inquiry',
    icon: Rocket,
    description: 'Detailed project requirements',
    schema: projectInquirySchema,
  },
  booking: {
    label: 'Book Consultation',
    icon: Calendar,
    description: 'Schedule a consultation meeting',
    schema: bookingInquirySchema,
  },
};



export const UnifiedContactForm: React.FC<UnifiedContactFormProps> = ({
  initialFormType = 'general',
  className = '',
  showFormTypeSelector = true,
}) => {
  const [formType, setFormType] = useState<FormType>(initialFormType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'validating' | 'sending' | 'success' | 'error'>('idle');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { csrfToken, isLoading: csrfLoading, error: csrfError, refreshToken: refreshCsrf } = useCSRFToken();

  const currentConfig = formTypeConfig[formType];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<UnifiedFormData>({
    resolver: zodResolver(currentConfig.schema as any),
    mode: 'onBlur',
  });

  // Consent state (kept outside of zod schema to avoid schema divergence with backend)
  const [consentChecked, setConsentChecked] = useState(false);

  // Map frontend serviceInterest values to backend-supported "service" enum
  const mapServiceInterest = (val?: UnifiedFormData['serviceInterest']):
    'web-development' | 'mobile-development' | 'ui-ux-design' | 'consulting' | 'maintenance' | 'other' | undefined => {
    if (!val) return undefined;
    switch (val) {
      case 'web-development':
        return 'web-development';
      case 'ai-integration':
        // Map AI integration inquiries under consulting for backend schema compatibility
        return 'consulting';
      case 'consulting':
        return 'consulting';
      default:
        return 'other';
    }
  };

  const onSubmit = async (data: UnifiedFormData) => {
    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA verification.');
      return;
    }

    if (!consentChecked) {
      toast.error('Please agree to the Privacy Policy and Terms to continue.');
      return;
    }

    // Only require CSRF for backend-submitted forms (general, booking)
    if (formType !== 'project') {
      if (!csrfToken) {
        await refreshCsrf();
        if (!csrfToken) {
          toast.error('Security token missing. Please try again.');
          return;
        }
      }
    }

    setIsSubmitting(true);
    setSubmitStatus('validating');
    setSubmitProgress(10);

    try {
      // Simulate brief validation step for UX
      await new Promise((resolve) => { setTimeout(resolve, 300); });
      setSubmitProgress(30);
      setSubmitStatus('sending');

      // If project inquiry, use EmailJS directly to simplify flow
      if (formType === 'project') {
        setSubmitProgress(60);

        const { isValid, errors } = validateEmailJSConfig();
        if (!isValid) {
          throw new Error(`Email setup error: ${errors.join('; ')}`);
        }

        const result = await sendContactEmail({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          formType: 'project',
          subject: getEmailSubject('project', data),
          // Pass through project fields so the EmailJS formatter can include details
          projectType: data.projectType,
          projectDescription: data.projectDescription,
          budget: data.budget,
          timeline: data.timeline,
          currentWebsite: data.currentWebsite,
          additionalRequirements: data.additionalRequirements,
          preferredTechStack: data.preferredTechStack,
          aiRequirements: data.aiRequirements,
        });

        setSubmitProgress(80);

        if (!result.success) {
          throw new Error(result.message || 'Failed to submit form');
        }
      } else {
        // Build payload based on form type (general or booking) and submit to backend
        const basePayload: Record<string, any> = {
          name: data.name,
          email: data.email,
          // Security fields common to all forms
          _token: csrfToken,
          consent: true,
        };
        if (data.phone) basePayload.phone = data.phone;
        if (data.company) basePayload.company = data.company;

        let endpoint = '/api/contact/form';
        let payload: Record<string, any> = { ...basePayload };

        if (formType === 'general') {
          payload = {
            ...basePayload,
            subject: data.subject,
            message: data.message,
            service: mapServiceInterest(data.serviceInterest),
            // Honeypot field (should be empty)
            website: '',
          };
          endpoint = '/api/contact/form';
        } else if (formType === 'booking') {
          payload = {
            ...basePayload,
            consultationType: data.consultationType,
            businessSize: data.businessSize,
            currentChallenges: data.currentChallenges,
            goals: data.goals,
            preferredMeetingType: data.preferredMeetingType,
            preferredTimeframe: data.preferredTimeframe,
            meetingDuration: data.meetingDuration,
            timezone: data.timezone,
            // Honeypot field (should be empty)
            honeypot: '',
          };
          endpoint = '/api/contact/booking';
        }

        // Attach reCAPTCHA token
        payload['g-recaptcha-response'] = recaptchaToken;

        setSubmitProgress(60);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken || '',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        });

        setSubmitProgress(80);

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `Request failed with status ${res.status}`);
        }

        const result = await res.json().catch(() => ({}));
        if (!result || result.success !== true) {
          throw new Error(result?.message || 'Failed to submit form');
        }
      }

      setSubmitProgress(95);

      setSubmitStatus('success');
      setSubmitProgress(100);

      toast.success(
        'Your message has been sent successfully! We\'ll get back to you soon.',
        {
          duration: 5000,
          position: 'top-center',
          icon: <CheckCircle className="w-5 h-5" />
        }
      );

      // Reset form after success animation
      setTimeout(() => {
        reset();
        setRecaptchaToken(null);
        setSubmitStatus('idle');
        setSubmitProgress(0);
        setIsSubmitting(false);
        setConsentChecked(false);
      }, 1200);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitProgress(0);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again later.',
        {
          duration: 5000,
          position: 'top-center',
          icon: <AlertCircle className="w-5 h-5" />
        }
      );
    } finally {
      if (submitStatus !== 'success') {
        setIsSubmitting(false);
      }
    }
  };

  const handleFormTypeChange = (newType: FormType) => {
    setFormType(newType);
    reset();
    setRecaptchaToken(null);
    setSubmitStatus('idle');
    setSubmitProgress(0);
    setConsentChecked(false);
  };

  const handleReCaptchaChange = useCallback((token: string | null) => {
    setRecaptchaToken(token);
  }, []);

  const getSuccessMessage = (type: FormType): string => {
    switch (type) {
      case 'project':
        return 'Thank you for your project inquiry! We\'ll review your requirements and get back to you within 24 hours.';
      case 'booking':
        return 'Your consultation request has been received! We\'ll contact you shortly to confirm your preferred time slot.';
      default:
        return 'Thank you for your message! We\'ll get back to you soon.';
    }
  };

  return (
    <UnifiedErrorBoundary level="component" name="UnifiedContactForm">
      <PageTransition loading={isSubmitting && submitStatus === 'validating'} variant="fade">
        <div className={`space-y-8 ${className}`}>
      {/* Form Type Selector */}
      {showFormTypeSelector && (
        <div className="flex flex-wrap gap-2 p-1 bg-surface-secondary/50 rounded-xl border border-border-muted">
          {Object.entries(formTypeConfig).map(([type, config]) => {
            const IconComponent = config.icon;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleFormTypeChange(type as FormType)}
                className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  formType === type
                    ? 'bg-primary text-white shadow-lg transform scale-105'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary/70'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Form Description */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">{currentConfig.label}</h3>
        <p className="text-text-secondary">{currentConfig.description}</p>
      </div>

      {/* Form */}
      <form
        id="unified-contact-form"
        role="form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Hidden honeypot inputs */}
        <div className="hidden" aria-hidden="true">
          <input type="text" name="website" autoComplete="off" tabIndex={-1} />
          <input type="text" name="honeypot" autoComplete="off" tabIndex={-1} />
        </div>

        {/* Base Contact Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <User className="w-4 h-4" />
              Full Name *
            </label>
            <Input
              {...register('name')}
              type="text"
              id="name"
              required
              variant={errors.name ? 'error' : 'default'}
              placeholder="Your full name"
              error={errors.name?.message || ''}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Mail className="w-4 h-4" />
              Email Address *
            </label>
            <Input
              {...register('email')}
              type="email"
              id="email"
              required
              variant={errors.email ? 'error' : 'default'}
              placeholder="your.email@example.com"
              error={errors.email?.message || ''}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <Input
              {...register('phone')}
              type="tel"
              id="phone"
              variant={errors.phone ? 'error' : 'default'}
              placeholder="(555) 123-4567"
              error={errors.phone?.message || ''}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Building className="w-4 h-4" />
              Company
            </label>
            <Input
              {...register('company')}
              type="text"
              id="company"
              variant={errors.company ? 'error' : 'default'}
              placeholder="Your company name"
              error={errors.company?.message || ''}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Form-specific fields */}
        {formType === 'general' && (
          <>
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-semibold text-text-primary">
                Subject *
              </label>
              <Input
                {...register('subject')}
                type="text"
                id="subject"
                required
                variant={errors.subject ? 'error' : 'default'}
                placeholder="Brief description of your inquiry"
                error={errors.subject?.message || ''}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
              <label htmlFor="serviceInterest" className="block text-sm font-semibold text-text-primary">
                Service Interest
              </label>
              <Controller
                name="serviceInterest"
                control={control}
                render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ''}
                      options={[
                        { value: 'web-development', label: 'Web Development' },
                        { value: 'ai-integration', label: 'AI Integration' },
                        { value: 'consulting', label: 'Consulting' },
                        { value: 'other', label: 'Other' },
                      ]}
                      placeholder="What service interests you?"
                      variant={errors.serviceInterest ? 'error' : 'default'}
                      onChange={(value) => field.onChange(value)}
                    />
                )}
              />
            </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Urgency Level
                </label>
                <Controller
                  name="urgency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ''}
                      options={[
                        { value: 'low', label: 'Low - General inquiry' },
                        { value: 'medium', label: 'Medium - Planning phase' },
                        { value: 'high', label: 'High - Ready to start' },
                        { value: 'urgent', label: 'Urgent - ASAP' },
                      ]}
                      placeholder="Select urgency level"
                      variant={errors.urgency ? 'error' : 'default'}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-text-primary">
                Message *
              </label>
              <Textarea
                {...register('message')}
                id="message"
                name="message"
                rows={4}
                required
                variant={errors.message ? 'error' : 'default'}
                placeholder="Tell us about your inquiry or how we can help you..."
                errorMessage={errors.message?.message || ''}
              />
            </div>
          </>
        )}

        {formType === 'project' && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Project Type *
                </label>
                <Controller
                  name="projectType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ''}
                      options={[
                        { value: 'website', label: 'Website Development' },
                        { value: 'web-app', label: 'Web Application' },
                        { value: 'ai-integration', label: 'AI Integration' },
                        { value: 'consulting', label: 'Technical Consulting' },
                        { value: 'other', label: 'Other' },
                      ]}
                      placeholder="Select project type"
                      variant={errors.projectType ? 'error' : 'default'}
                      required
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">
                  Budget Range *
                </label>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ''}
                      options={[
                        { value: 'under-5k', label: 'Under $5,000' },
                        { value: '5k-15k', label: '$5,000 - $15,000' },
                        { value: '15k-50k', label: '$15,000 - $50,000' },
                        { value: '50k-plus', label: '$50,000+' },
                        { value: 'not-sure', label: 'Not sure yet' },
                      ]}
                      placeholder="Select budget range"
                      variant={errors.budget ? 'error' : 'default'}
                      required
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Timeline *
              </label>
              <Controller
                name="timeline"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    options={[
                      { value: 'asap', label: 'ASAP' },
                      { value: '1-month', label: 'Within 1 month' },
                      { value: '2-3-months', label: '2-3 months' },
                      { value: '3-6-months', label: '3-6 months' },
                      { value: 'flexible', label: 'Flexible timeline' },
                    ]}
                    placeholder="Select timeline"
                    variant={errors.timeline ? 'error' : 'default'}
                    required
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="projectDescription" className="block text-sm font-semibold text-text-primary">
                Project Description *
              </label>
              <div className="relative">
                <Textarea
                  {...register('projectDescription')}
                  id="projectDescription"
                  rows={5}
                  required
                  variant={errors.projectDescription ? 'error' : 'default'}
                  placeholder="Provide a detailed description of your project, including goals, target audience, key features, and any specific requirements..."
                  errorMessage={errors.projectDescription?.message || ''}
                />
                <div className="absolute bottom-2 right-2 text-sm text-text-muted">
                  {watch('projectDescription')?.length || 0}/3000
                </div>
              </div>
            </div>
            {watch('projectType') === 'ai-integration' && (
              <div className="space-y-2">
                <label htmlFor="aiRequirements" className="block text-sm font-semibold text-text-primary">
                  AI-Specific Requirements
                </label>
                <Textarea
                  {...register('aiRequirements')}
                  id="aiRequirements"
                  rows={3}
                  variant={errors.aiRequirements ? 'error' : 'default'}
                  placeholder="Specify any AI-related requirements, such as model types, data needs, or integration points..."
                  errorMessage={errors.aiRequirements?.message || ''}
                />
              </div>
            )}
            

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="currentWebsite" className="block text-sm font-semibold text-text-primary">
                  Current Website (if any)
                </label>
                <Input
                  {...register('currentWebsite')}
                  type="url"
                  id="currentWebsite"
                  variant={errors.currentWebsite ? 'error' : 'default'}
                  placeholder="https://your-current-website.com"
                  error={errors.currentWebsite?.message || ''}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="preferredTechStack" className="block text-sm font-semibold text-text-primary">
                  Preferred Tech Stack
                </label>
                <Input
                  {...register('preferredTechStack')}
                  type="text"
                  id="preferredTechStack"
                  variant={errors.preferredTechStack ? 'error' : 'default'}
                  placeholder="React, Node.js, etc. (optional)"
                  error={errors.preferredTechStack?.message || ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="additionalRequirements" className="block text-sm font-semibold text-text-primary">
                Additional Requirements
              </label>
              <Textarea
                {...register('additionalRequirements')}
                id="additionalRequirements"
                rows={3}
                variant={errors.additionalRequirements ? 'error' : 'default'}
                placeholder="Any additional requirements, integrations, or special considerations..."
                errorMessage={errors.additionalRequirements?.message || ''}
              />
            </div>
          </>
        )}

        {formType === 'booking' && (
          <div className="-mx-4 sm:-mx-6 md:-mx-8">
            <BookingWizard className="bg-transparent border-0 shadow-none" />
          </div>
        )}

        {/* reCAPTCHA */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <ReCAPTCHA
              siteKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ''}
              onVerify={handleReCaptchaChange}

            />
            {!recaptchaToken && (
              <Button
                type="button"
                onClick={() => {
                  // Simulate reCAPTCHA verification for testing
                  setRecaptchaToken('test-token');
                }}
                className="w-full mt-4"
                size="lg"
                variant="secondary"
              >
                Verify
              </Button>
            )}
          </div>
        </div>

        {/* Consent checkbox */}
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border-muted"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            aria-required="true"
          />
          <label htmlFor="consent" className="text-sm text-text-secondary">
            I agree to the
            {' '}<a href="/privacy" className="text-primary hover:text-primary-hover underline">Privacy Policy</a>
            {' '}and{' '}
            <a href="/terms" className="text-primary hover:text-primary-hover underline">Terms of Service</a>.
          </label>
        </div>

        {/* Progress Indicator */}
        {isSubmitting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {submitStatus === 'validating' && 'Validating form...'}
                {submitStatus === 'sending' && 'Sending message...'}
                {submitStatus === 'success' && 'Message sent successfully!'}
                {submitStatus === 'error' && 'Error occurred'}
              </span>
              <span>{submitProgress}%</span>
            </div>
            <Progress 
              value={submitProgress} 
              className="h-2"
              variant={submitStatus === 'error' ? 'error' : submitStatus === 'success' ? 'success' : 'default'}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            disabled={isSubmitting || !recaptchaToken || !consentChecked}
            className="w-full md:w-auto px-8 py-3"
            size="lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : submitStatus === 'error' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span>
                  {submitStatus === 'validating' && 'Validating...'}
                  {submitStatus === 'sending' && 'Sending...'}
                  {submitStatus === 'success' && 'Sent!'}
                  {submitStatus === 'error' && 'Try Again'}
                </span>
              </div>
            ) : (
              getSubmitButtonText(formType)
            )}
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-text-secondary">
          <p>
            By submitting this form, you agree to our{' '}
            <a href="/privacy" className="text-primary hover:text-primary-hover underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/terms" className="text-primary hover:text-primary-hover underline">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </form>
        </div>
      </PageTransition>
    </UnifiedErrorBoundary>
  );
};

function getSubmitButtonText(formType: FormType): string {
  switch (formType) {
    case 'project':
      return 'Submit Project Inquiry';
    case 'booking':
      return 'Request Consultation';
    default:
      return 'Send Message';
  }
}

// Helper function to generate email subject based on form type
function getEmailSubject(formType: FormType, data: UnifiedFormData): string {
  switch (formType) {
    case 'project':
      return `Project Inquiry - ${data.projectType || 'General'} (${data.name})`;
    case 'booking':
      return `Consultation Request - ${data.consultationType || 'General'} (${data.name})`;
    case 'general':
    default:
      return data.subject || `Contact Form Submission from ${data.name}`;
  }
}

// Helper function to format message content based on form type
function formatFormMessage(formType: FormType, data: UnifiedFormData): string {
  let message = '';

  switch (formType) {
    case 'general':
      message = data.message || '';
      if (data.serviceInterest) {
        message += `\n\nService Interest: ${data.serviceInterest}`;
      }
      if (data.urgency) {
        message += `\nUrgency Level: ${data.urgency}`;
      }
      break;

    case 'project':
      message = `Project Type: ${data.projectType}\n`;
      message += `Budget Range: ${data.budget}\n`;
      message += `Timeline: ${data.timeline}\n\n`;
      message += `Project Description:\n${data.projectDescription}\n`;
      
      if (data.aiRequirements) {
        message += `\nAI Requirements:\n${data.aiRequirements}\n`;
      }
      if (data.currentWebsite) {
        message += `\nCurrent Website: ${data.currentWebsite}\n`;
      }
      if (data.preferredTechStack) {
        message += `\nPreferred Tech Stack: ${data.preferredTechStack}\n`;
      }
      if (data.additionalRequirements) {
        message += `\nAdditional Requirements:\n${data.additionalRequirements}\n`;
      }
      break;

    case 'booking':
      message = `Consultation Type: ${data.consultationType}\n`;
      message += `Business Size: ${data.businessSize}\n`;
      message += `Preferred Meeting Type: ${data.preferredMeetingType}\n`;
      message += `Preferred Timeframe: ${data.preferredTimeframe}\n`;
      message += `Meeting Duration: ${data.meetingDuration}\n`;
      
      if (data.timezone) {
        message += `Timezone: ${data.timezone}\n`;
      }
      
      message += `\nCurrent Challenges:\n${data.currentChallenges}\n`;
      message += `\nGoals:\n${data.goals}\n`;
      break;

    default:
      message = data.message || 'No message provided';
  }

  return message;
}

export default UnifiedContactForm;