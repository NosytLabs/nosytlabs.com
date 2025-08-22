import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { sendContactForm, sendProjectInquiry, type ContactFormData } from '../../services/contact';

// Enhanced validation schemas for different form types
const baseContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-\(\)]*[\d\s\-\(\)]{7,15}$/;
    return phoneRegex.test(val.replace(/\s/g, ''));
  }, 'Please enter a valid phone number'),
  company: z.string().optional(),
});

const generalContactSchema = baseContactSchema.extend({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject is too long'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000, 'Message is too long'),
  serviceInterest: z.enum(['web-development', 'ai-integration', 'consulting', 'other']).optional(),
  budget: z.enum(['under-5k', '5k-15k', '15k-50k', '50k-plus', 'not-sure']).optional(),
  timeline: z.enum(['asap', '1-month', '2-3-months', '3-6-months', 'flexible']).optional(),
});

const projectInquirySchema = baseContactSchema.extend({
  projectType: z.enum(['website', 'web-app', 'ai-integration', 'consulting', 'other']),
  projectDescription: z.string().min(50, 'Please provide a detailed project description (at least 50 characters)').max(3000, 'Description is too long'),
  budget: z.enum(['under-5k', '5k-15k', '15k-50k', '50k-plus', 'not-sure']),
  timeline: z.enum(['asap', '1-month', '2-3-months', '3-6-months', 'flexible']),
  currentWebsite: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  additionalRequirements: z.string().max(1000, 'Additional requirements are too long').optional(),
});

const consultationSchema = baseContactSchema.extend({
  consultationType: z.enum(['strategy', 'technical-audit', 'ai-readiness', 'digital-transformation', 'other']),
  businessSize: z.enum(['startup', 'small-business', 'medium-business', 'enterprise']),
  currentChallenges: z.string().min(30, 'Please describe your current challenges (at least 30 characters)').max(2000, 'Description is too long'),
  goals: z.string().min(20, 'Please describe your goals (at least 20 characters)').max(2000, 'Goals description is too long'),
  preferredMeetingType: z.enum(['video-call', 'phone-call', 'in-person', 'email']),
});

type FormType = 'general' | 'project' | 'consultation';

// Create a unified form data type that includes all possible fields
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
  budget?: 'under-5k' | '5k-15k' | '15k-50k' | '50k-plus' | 'not-sure';
  timeline?: 'asap' | '1-month' | '2-3-months' | '3-6-months' | 'flexible';
  // Project inquiry fields
  projectType?: 'website' | 'web-app' | 'ai-integration' | 'consulting' | 'other';
  projectDescription?: string;
  currentWebsite?: string;
  additionalRequirements?: string;
  // Consultation fields
  consultationType?: 'strategy' | 'technical-audit' | 'ai-readiness' | 'digital-transformation' | 'other';
  businessSize?: 'startup' | 'small-business' | 'medium-business' | 'enterprise';
  currentChallenges?: string;
  goals?: string;
  preferredMeetingType?: 'video-call' | 'phone-call' | 'in-person' | 'email';
};

interface AdvancedContactFormProps {
  initialFormType?: FormType;
  className?: string;
}

export const AdvancedContactForm: React.FC<AdvancedContactFormProps> = ({ 
  initialFormType = 'general',
  className = ''
}) => {
  const [formType, setFormType] = useState<FormType>(initialFormType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Get the appropriate schema based on form type
  const getSchema = () => {
    switch (formType) {
      case 'project':
        return projectInquirySchema;
      case 'consultation':
        return consultationSchema;
      default:
        return generalContactSchema;
    }
  };

  const {    register,    handleSubmit,    formState: { errors },    reset  } = useForm<UnifiedFormData>({    resolver: zodResolver(getSchema() as any),    mode: 'onBlur'  });

  const onSubmit = async (data: UnifiedFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare contact data
      const contactData: ContactFormData = {
        ...data,
        formType,
      };

      // Use appropriate service based on form type
      const result = formType === 'project' 
        ? await sendProjectInquiry(contactData)
        : await sendContactForm(contactData);

      if (result.success) {
        setSubmitStatus('success');
        toast.success(
          result.message || 'Thank you for your message! We\'ll get back to you soon.',
          {
            duration: 5000,
            position: 'top-center'
          }
        );
        reset();
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Something went wrong. Please try again later.',
        {
          duration: 5000,
          position: 'top-center'
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormTypeChange = (newType: FormType) => {
    setFormType(newType);
    reset(); // Clear form when switching types
    setSubmitStatus('idle');
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Form Type Selector */}
      <div className="flex flex-wrap gap-2 p-1 bg-background-soft/50 rounded-xl border border-border/30">
        {[
          { type: 'general' as FormType, label: 'General Contact', icon: '💬' },
          { type: 'project' as FormType, label: 'Project Inquiry', icon: '🚀' },
          { type: 'consultation' as FormType, label: 'Consultation', icon: '🎯' }
        ].map(({ type, label, icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => handleFormTypeChange(type)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              formType === type
                ? 'bg-primary text-on-primary shadow-lg transform scale-105'
                : 'text-text-muted hover:text-text hover:bg-background-soft/70'
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <form id="contact-form" role="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Base Contact Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-text">
              Full Name *
            </label>
            <Input
              {...register('name')}
              type="text"
              id="name"
              required
              variant={errors.name ? 'error' : 'default'}
              {...(errors.name?.message ? {
                errorMessage: errors.name.message!
              } : {})}
              placeholder="Your full name"
            />

          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-text">
              Email Address *
            </label>
            <Input
              {...register('email')}
              type="email"
              id="email"
              required
              variant={errors.email ? 'error' : 'default'}
              {...(errors.email?.message ? {
                errorMessage: errors.email.message!
              } : {})}
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-text">
              Phone Number
            </label>
            <Input
              {...register('phone')}
              type="tel"
              id="phone"
              variant={errors.phone ? 'error' : 'default'}
              {...(errors.phone?.message ? {
                errorMessage: errors.phone.message!
              } : {})}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="block text-sm font-semibold text-text">
              Company/Organization
            </label>
            <Input
              {...register('company')}
              type="text"
              id="company"
              placeholder="Your company name"
            />
          </div>
        </div>

        {/* Form-specific fields */}
        {formType === 'general' && (
          <GeneralContactFields register={register} errors={errors} />
        )}

        {formType === 'project' && (
          <ProjectInquiryFields register={register} errors={errors} />
        )}

        {formType === 'consultation' && (
          <ConsultationFields register={register} errors={errors} />
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
              isSubmitting
                ? 'bg-text-muted text-background cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-primary-hover text-on-primary hover:shadow-xl hover:scale-105 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Send Message
                <span className="text-xl">📤</span>
              </span>
            )}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-success/10 border border-success/30 rounded-xl">
            <p className="text-success font-medium flex items-center gap-2">
              <span className="text-xl">✅</span>
              Message sent successfully! We'll get back to you within 24 hours.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-error/10 border border-error/30 rounded-xl">
            <p className="text-error font-medium flex items-center gap-2">
              <span className="text-xl">❌</span>
              Failed to send message. Please try again or contact us directly.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

// Component interfaces
interface FieldComponentProps {
  register: any; // UseFormRegister<UnifiedFormData> - keeping as any for now to avoid complex typing
  errors: any; // FieldErrors<UnifiedFormData> - keeping as any for now to avoid complex typing
}

// Component for General Contact form fields
const GeneralContactFields: React.FC<FieldComponentProps> = ({ register, errors }) => (
  <>
    <div className="space-y-2">
      <label htmlFor="subject" className="block text-sm font-semibold text-text">
        Subject *
      </label>
      <Input
            {...register('subject')}
            type="text"
            id="subject"
            variant={errors.subject ? 'error' : 'default'}
            {...(errors.subject?.message ? {
              errorMessage: errors.subject.message!
            } : {})}
            placeholder="What can we help you with?"
          />
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="serviceInterest" className="block text-sm font-semibold text-text">
          Service Interest
        </label>
        <Select
          {...register('serviceInterest')}
          id="serviceInterest"
          options={[
            { value: 'web-development', label: 'Web Development' },
            { value: 'ai-integration', label: 'AI Integration' },
            { value: 'consulting', label: 'Technical Consulting' },
            { value: 'other', label: 'Other' }
          ]}
          placeholder="Select a service"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="budget" className="block text-sm font-semibold text-text">
          Budget Range
        </label>
        <Select
          {...register('budget')}
          id="budget"
          options={[
            { value: 'under-5k', label: 'Under $5,000' },
            { value: '5k-15k', label: '$5,000 - $15,000' },
            { value: '15k-50k', label: '$15,000 - $50,000' },
            { value: '50k-plus', label: '$50,000+' },
            { value: 'not-sure', label: 'Not sure yet' }
          ]}
          placeholder="Select budget range"
        />
      </div>
    </div>

    <div className="space-y-2">
      <label htmlFor="message" className="block text-sm font-semibold text-text">
        Message *
      </label>
      <Textarea
          {...register('message')}
          id="message"
          rows={6}
          variant={errors.message ? 'error' : 'default'}
          {...(errors.message?.message ? {
            errorMessage: errors.message.message!
          } : {})}
          placeholder="Tell us about your project, goals, or how we can help you..."
        />
    </div>
  </>
);

// Component for Project Inquiry form fields
const ProjectInquiryFields: React.FC<FieldComponentProps> = ({ register, errors }) => (
  <>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="projectType" className="block text-sm font-semibold text-text">
          Project Type *
        </label>
        <Select
          {...register('projectType')}
          id="projectType"
          variant={errors.projectType ? 'error' : 'default'}
          options={[
            { value: 'website', label: 'Website Development' },
            { value: 'web-app', label: 'Web Application' },
            { value: 'ai-integration', label: 'AI Integration' },
            { value: 'consulting', label: 'Technical Consulting' },
            { value: 'other', label: 'Other' }
          ]}
          placeholder="Select project type"
        />
        {errors.projectType && (
          <p className="text-sm text-error flex items-center gap-1">
            <span>⚠️</span> {errors.projectType.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="budget" className="block text-sm font-semibold text-text">
          Budget Range *
        </label>
        <Select
          {...register('budget')}
          id="budget"
          variant={errors.budget ? 'error' : 'default'}
          options={[
            { value: 'under-5k', label: 'Under $5,000' },
            { value: '5k-15k', label: '$5,000 - $15,000' },
            { value: '15k-50k', label: '$15,000 - $50,000' },
            { value: '50k-plus', label: '$50,000+' },
            { value: 'not-sure', label: 'Not sure yet' }
          ]}
          placeholder="Select budget range"
        />
        {errors.budget && (
          <p className="text-sm text-error flex items-center gap-1">
            <span>⚠️</span> {errors.budget.message}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-2">
      <label htmlFor="timeline" className="block text-sm font-semibold text-text">
        Timeline *
      </label>
      <Select
        {...register('timeline')}
        id="timeline"
        variant={errors.timeline ? 'error' : 'default'}
        options={[
          { value: 'asap', label: 'ASAP' },
          { value: '1-month', label: 'Within 1 month' },
          { value: '2-3-months', label: '2-3 months' },
          { value: '3-6-months', label: '3-6 months' },
          { value: 'flexible', label: 'Flexible' }
        ]}
        placeholder="Select timeline"
      />
      {errors.timeline && (
        <p className="text-sm text-error flex items-center gap-1">
          <span>⚠️</span> {errors.timeline.message}
        </p>
      )}
    </div>

    <div className="space-y-2">
      <label htmlFor="currentWebsite" className="block text-sm font-semibold text-text">
        Current Website (if any)
      </label>
      <Input
          {...register('currentWebsite')}
          type="url"
          id="currentWebsite"
          variant={errors.currentWebsite ? 'error' : 'default'}
          {...(errors.currentWebsite?.message ? {
            errorMessage: errors.currentWebsite.message!
          } : {})}
          placeholder="https://your-current-website.com"
        />
    </div>

    <div className="space-y-2">
      <label htmlFor="projectDescription" className="block text-sm font-semibold text-text">
        Project Description *
      </label>
      <Textarea
          {...register('projectDescription')}
          id="projectDescription"
          rows={6}
          variant={errors.projectDescription ? 'error' : 'default'}
          {...(errors.projectDescription?.message ? {
            errorMessage: errors.projectDescription.message!
          } : {})}
          placeholder="Please provide a detailed description of your project, including goals, target audience, key features, and any specific requirements..."
        />
    </div>

    <div className="space-y-2">
      <label htmlFor="additionalRequirements" className="block text-sm font-semibold text-text">
        Additional Requirements
      </label>
      <Textarea
        {...register('additionalRequirements')}
        id="additionalRequirements"
        rows={4}
        placeholder="Any additional requirements, integrations, or special considerations..."
      />
    </div>
  </>
);

// Component for Consultation form fields
const ConsultationFields: React.FC<FieldComponentProps> = ({ register, errors }) => (
  <>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="consultationType" className="block text-sm font-semibold text-text">
          Consultation Type *
        </label>
        <Select
          {...register('consultationType')}
          id="consultationType"
          variant={errors.consultationType ? 'error' : 'default'}
          options={[
            { value: 'strategy', label: 'Digital Strategy' },
            { value: 'technical-audit', label: 'Technical Audit' },
            { value: 'ai-readiness', label: 'AI Readiness Assessment' },
            { value: 'digital-transformation', label: 'Digital Transformation' },
            { value: 'other', label: 'Other' }
          ]}
          placeholder="Select consultation type"
        />
        {errors.consultationType && (
          <p className="text-sm text-error flex items-center gap-1">
            <span>⚠️</span> {errors.consultationType.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="businessSize" className="block text-sm font-semibold text-text">
          Business Size *
        </label>
        <Select
          {...register('businessSize')}
          id="businessSize"
          variant={errors.businessSize ? 'error' : 'default'}
          options={[
            { value: 'startup', label: 'Startup (1-10 employees)' },
            { value: 'small-business', label: 'Small Business (11-50 employees)' },
            { value: 'medium-business', label: 'Medium Business (51-200 employees)' },
            { value: 'enterprise', label: 'Enterprise (200+ employees)' }
          ]}
          placeholder="Select business size"
        />
        {errors.businessSize && (
          <p className="text-sm text-error flex items-center gap-1">
            <span>⚠️</span> {errors.businessSize.message}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-2">
      <label htmlFor="preferredMeetingType" className="block text-sm font-semibold text-text">
        Preferred Meeting Type *
      </label>
      <Select
        {...register('preferredMeetingType')}
        id="preferredMeetingType"
        variant={errors.preferredMeetingType ? 'error' : 'default'}
        options={[
          { value: 'video-call', label: 'Video Call (Zoom/Teams)' },
          { value: 'phone-call', label: 'Phone Call' },
          { value: 'in-person', label: 'In-Person Meeting' },
          { value: 'email', label: 'Email Discussion' }
        ]}
        placeholder="Select meeting type"
      />
      {errors.preferredMeetingType && (
        <p className="text-sm text-error flex items-center gap-1">
          <span>⚠️</span> {errors.preferredMeetingType.message}
        </p>
      )}
    </div>

    <div className="space-y-2">
      <label htmlFor="currentChallenges" className="block text-sm font-semibold text-text">
        Current Challenges *
      </label>
      <Textarea
          {...register('currentChallenges')}
          id="currentChallenges"
          rows={5}
          variant={errors.currentChallenges ? 'error' : 'default'}
          {...(errors.currentChallenges?.message ? {
            errorMessage: errors.currentChallenges.message!
          } : {})}
          placeholder="Describe the current challenges your business is facing that you'd like to address..."
       />
    </div>

    <div className="space-y-2">
      <label htmlFor="goals" className="block text-sm font-semibold text-text">
        Goals & Objectives *
      </label>
      <Textarea
          {...register('goals')}
          id="goals"
          rows={5}
          variant={errors.goals ? 'error' : 'default'}
          {...(errors.goals?.message ? {
            errorMessage: errors.goals.message!
          } : {})}
          placeholder="What are your main goals and what would you like to achieve through this consultation?..."
       />
    </div>
  </>
);

export default AdvancedContactForm;