import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ReCAPTCHA } from '../security';
import { InteractiveCalendar } from './InteractiveCalendar';
import { validateFormData, bookingInquirySchema } from '../../utils/unified-validation';
import { sendBookingEmail } from '../../services/simple-contact';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  Building2,
  Globe,
  MessageSquare,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Star,
  Zap,
  Shield,
  Rocket,
  Users,
  TrendingUp,
  Settings,
  Code,
  Smartphone,
  Palette,
  Search,
  BarChart,
  Lock,
  Video,
  PhoneCall,
  MapPin,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { UnifiedErrorBoundary } from '../error/UnifiedErrorBoundary';
import PageTransition from '../ui/page-transition';

// Enhanced validation schema using unified validation system
const enhancedBookingSchema = bookingInquirySchema.extend({
  // Extended consultation details
  consultationType: z.enum([
    'performance-optimization',
    'security-audit', 
    'architecture-review',
    'code-review',
    'technical-consultation',
    'project-planning',
    'technology-selection',
    'scalability-assessment',
    'custom-consultation'
  ], { required_error: 'Please select a consultation type' }),
  
  businessSize: z.enum([
    'startup',
    'small-business', 
    'medium-business',
    'enterprise',
    'non-profit',
    'government',
    'individual'
  ], { required_error: 'Please select your business size' }),
  
  currentChallenges: z.array(z.string()).min(1, 'Please select at least one challenge'),
  projectGoals: z.array(z.string()).min(1, 'Please select at least one goal'),
  
  budgetRange: z.enum([
    'under-5k',
    '5k-15k', 
    '15k-50k',
    '50k-100k',
    'over-100k',
    'not-sure'
  ], { required_error: 'Please select a budget range' }),
  
  // Additional fields for enhanced booking
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  referralSource: z.enum(['website', 'social-media', 'referral', 'search', 'other']).optional(),
  previousExperience: z.boolean().optional(),
  
  // Override some fields for better UX
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  
  // Additional fields
  additionalNotes: z.string().max(1000, 'Additional notes must not exceed 1000 characters').optional(),
  
  // Review step fields
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions to proceed'
  }),
});

// Form data type
type BookingFormData = z.infer<typeof enhancedBookingSchema>;

interface BookingWizardProps {
  className?: string;
  onComplete?: (data: BookingFormData) => void;
}

// Enhanced step configuration with better UX
const STEPS = [
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Let\'s get to know you',
    icon: User,
    fields: ['name', 'email', 'phone', 'company', 'timezone'] as const,
    estimatedTime: '2 min',
    progress: 25,
  },
  {
    id: 'consultation',
    title: 'Consultation Details', 
    description: 'Tell us about your project',
    icon: Target,
    fields: ['serviceType', 'consultationType', 'businessSize', 'currentChallenges', 'projectGoals', 'budgetRange', 'urgency'] as const,
    estimatedTime: '4 min',
    progress: 50,
  },
  {
    id: 'scheduling',
    title: 'Schedule Meeting',
    description: 'Choose your preferred time',
    icon: Calendar,
    fields: ['preferredDate', 'preferredTime', 'meetingType', 'duration', 'agenda', 'referralSource'] as const,
    estimatedTime: '3 min', 
    progress: 75,
  },
  {
    id: 'review',
    title: 'Review & Confirm',
    description: 'Review your booking details and confirm',
    icon: CheckCircle,
    fields: ['termsAccepted'] as const,
    estimatedTime: '1 min',
    progress: 100,
  },
];

// Enhanced timezone options with better organization
const timezoneOptions = [
  { value: 'America/New_York', label: 'New York (EST/EDT)', region: 'Americas' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', region: 'Americas' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', region: 'Americas' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', region: 'Americas' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)', region: 'Americas' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', region: 'Americas' },
  { value: 'Europe/London', label: 'London (GMT/BST)', region: 'Europe' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', region: 'Europe' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', region: 'Europe' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', region: 'Europe' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', region: 'Asia' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', region: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', region: 'Asia' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', region: 'Asia' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', region: 'Oceania' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)', region: 'Oceania' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', region: 'UTC' },
];

const consultationTypes = [
  {
    value: 'strategy',
    label: 'Business Strategy Session',
    description: 'Strategic planning and business growth consultation',
    icon: Target,
    duration: '60-90 min',
  },
  {
    value: 'technical-audit',
    label: 'Technical Architecture Audit',
    description: 'Comprehensive review of your technical infrastructure',
    icon: Building2,
    duration: '90-120 min',
  },
  {
    value: 'ai-readiness',
    label: 'AI Integration Readiness',
    description: 'Assessment for AI implementation opportunities',
    icon: Sparkles,
    duration: '60-90 min',
  },
  {
    value: 'digital-transformation',
    label: 'Digital Transformation Planning',
    description: 'Roadmap for digital modernization initiatives',
    icon: Globe,
    duration: '90-120 min',
  },
  {
    value: 'mvp-development',
    label: 'MVP Development Planning',
    description: 'Planning and scoping for minimum viable product',
    icon: CheckCircle,
    duration: '60-90 min',
  },
  {
    value: 'performance-optimization',
    label: 'Performance Optimization Review',
    description: 'Analysis and improvement of system performance',
    icon: ArrowRight,
    duration: '60-90 min',
  },
  {
    value: 'security-audit',
    label: 'Security & Compliance Audit',
    description: 'Security assessment and compliance review',
    icon: AlertCircle,
    duration: '90-120 min',
  },
  {
    value: 'other',
    label: 'Custom Consultation',
    description: 'Tailored consultation for specific needs',
    icon: User,
    duration: 'Variable',
  },
];

const meetingTypeOptions = [
  {
    value: 'video-call',
    label: 'Video Call',
    description: 'Zoom, Teams, or Google Meet',
    icon: Video,
    popular: true,
  },
  {
    value: 'phone-call',
    label: 'Phone Call',
    description: 'Traditional phone conversation',
    icon: Phone,
    popular: false,
  },
  {
    value: 'in-person',
    label: 'In-Person Meeting',
    description: 'Face-to-face meeting (location dependent)',
    icon: MapPin,
    popular: false,
  },
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  className = '',
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'validating' | 'sending' | 'success' | 'error'>('idle');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isValidatingStep, setIsValidatingStep] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'checking' | 'available' | 'unavailable' | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [stepProgress, setStepProgress] = useState<Record<number, number>>({});
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  // Removed CSRF token dependency for simplified email service

  const currentStepConfig = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
  } = useForm<BookingFormData>({
    resolver: zodResolver(enhancedBookingSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      // Contact Information
      name: '',
      email: '',
      phone: '',
      company: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      
      // Consultation Details
      serviceType: '',
      consultationType: '',
      businessSize: '',
      currentChallenges: [],
      projectGoals: [],
      budgetRange: '',
      urgency: 'medium',
      
      // Scheduling
      preferredDate: '',
      preferredTime: '',
      meetingType: 'video-call',
      duration: '60',
      agenda: '',
      referralSource: 'website',
      previousExperience: false,
      
      // Review
      termsAccepted: false,
    },
  });

  const watchedValues = watch();

  // Auto-detect user's timezone
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTimezone && timezoneOptions.some(tz => tz.value === detectedTimezone)) {
      setValue('timezone', detectedTimezone);
    }
  }, [setValue]);

  // Real-time availability checking
  useEffect(() => {
    if (watchedValues.preferredDate && watchedValues.preferredTime) {
      checkAvailability(watchedValues.preferredDate, watchedValues.preferredTime);
    }
  }, [watchedValues.preferredDate, watchedValues.preferredTime]);

  const checkAvailability = async (date: string, time: string) => {
    setAvailabilityStatus('checking');
    try {
      // Simulate API call for availability checking
      await new Promise(resolve => { setTimeout(resolve, 1000); });
      // For demo purposes, assume most times are available
      const isAvailable = Math.random() > 0.2;
      setAvailabilityStatus(isAvailable ? 'available' : 'unavailable');
    } catch (error) {
      setAvailabilityStatus('unavailable');
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    setIsValidatingStep(true);
    const currentStepConfig = STEPS[currentStep];
    
    try {
      const formData = getValues();
      const stepData = Object.fromEntries(
        currentStepConfig.fields.map(field => [field, formData[field]])
      );
      
      // Validate using enhanced schema
      const result = await validateFormData(stepData, enhancedBookingSchema);
      
      if (!result.isValid) {
        // Set field-specific errors with better UX
        const newErrors: Record<string, string> = {};
        Object.entries(result.errors).forEach(([field, error]) => {
          setError(field as keyof z.infer<typeof enhancedBookingSchema>, {
            type: 'validation',
            message: error,
          });
          newErrors[field] = error;
        });
        setValidationErrors(prev => ({ ...prev, ...newErrors }));
        
        // Show toast for validation errors
        toast.error(`Please fix the errors in ${currentStepConfig.title}`);
        return false;
      }
      
      // Clear errors and update progress
      currentStepConfig.fields.forEach(field => {
        clearErrors(field);
      });
      setValidationErrors(prev => {
        const updated = { ...prev };
        currentStepConfig.fields.forEach(field => {
          delete updated[field];
        });
        return updated;
      });
      
      // Update step progress
      setStepProgress(prev => ({ ...prev, [currentStep]: 100 }));
      setCompletedSteps(prev => new Set(Array.from(prev).concat(currentStep)));
      
      return true;
    } catch (error) {
      console.error('Step validation error:', error);
      toast.error('Validation failed. Please try again.');
      return false;
    } finally {
      setIsValidatingStep(false);
    }
  };

  const getStepFields = (step: number): (keyof BookingFormData)[] => {
    switch (step) {
      case 0:
        return ['name', 'email', 'phone', 'company', 'timezone'];
      case 1:
        return ['consultationType', 'businessSize', 'currentChallenges', 'projectGoals', 'budgetRange'];
      case 2:
        return ['preferredDate', 'preferredTime', 'meetingType', 'duration', 'additionalNotes'];
      default:
        return [];
    }
  };

  // Enhanced navigation with smooth transitions and auto-save
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length - 1) {
      // Auto-save progress
      if (autoSaveEnabled) {
        try {
          const formData = getValues();
          localStorage.setItem('booking-wizard-progress', JSON.stringify({
            step: currentStep + 1,
            data: formData,
            timestamp: Date.now(),
          }));
        } catch (error) {
          console.warn('Auto-save failed:', error);
        }
      }
      
      setCurrentStep(prev => prev + 1);
      
      // Show progress feedback
      const nextStep = STEPS[currentStep + 1];
      toast.success(`Moving to ${nextStep.title}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      
      // Update progress
      setStepProgress(prev => ({ ...prev, [currentStep]: 0 }));
    }
  };
  
  // Auto-save functionality
  const autoSaveProgress = useMemo(() => {
    if (!autoSaveEnabled) return;
    
    const timeoutId = setTimeout(() => {
      try {
        const formData = getValues();
        localStorage.setItem('booking-wizard-draft', JSON.stringify({
          data: formData,
          step: currentStep,
          timestamp: Date.now(),
        }));
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [getValues, currentStep, autoSaveEnabled]);

  const handleReCaptchaChange = useCallback((token: string | null) => {
    setRecaptchaToken(token);
  }, []);

  const onSubmit = async (data: z.infer<typeof enhancedBookingSchema>) => {
    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA verification');
      return;
    }

    if (availabilityStatus === 'unavailable') {
      toast.error('The selected time slot is no longer available. Please choose a different time.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('validating');
    setSubmitProgress(0);

    try {
      // Progress: Initial validation (0-15%)
      setSubmitProgress(5);
      
      // Final comprehensive validation
      const validationResult = await validateFormData(data, enhancedBookingSchema);
      
      if (!validationResult.isValid) {
        setSubmitStatus('error');
        const newErrors: Record<string, string> = {};
        Object.entries(validationResult.errors).forEach(([field, error]) => {
          setError(field as keyof z.infer<typeof enhancedBookingSchema>, {
            type: 'validation',
            message: error,
          });
          newErrors[field] = error;
        });
        setValidationErrors(newErrors);
        toast.error('Please fix the validation errors before submitting');
        return;
      }
      
      setSubmitProgress(15);
      setSubmitStatus('sending');

      // Progress: Availability verification (15-35%)
      if (data.preferredDate && data.preferredTime) {
        setAvailabilityStatus('checking');
        setSubmitProgress(20);
        
        // Enhanced availability check with retry logic
        let availabilityAttempts = 0;
        const maxAttempts = 3;
        
        while (availabilityAttempts < maxAttempts) {
          try {
            // Simulate availability API call
            await new Promise((resolve) => { setTimeout(resolve, 800); });
            setAvailabilityStatus('available');
            break;
          } catch (error) {
            availabilityAttempts++;
            if (availabilityAttempts === maxAttempts) {
              setAvailabilityStatus('error');
              throw new Error('Unable to verify availability. Please try again.');
            }
          }
        }
      }
      
      setSubmitProgress(35);

      // Progress: Data preparation (35-50%)
      const enhancedEmailData = {
        ...data,
        recaptchaToken,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        sessionId: crypto.randomUUID(),
        formVersion: '2.0',
        validationPassed: true,
      };
      
      setSubmitProgress(50);

      // Progress: Email service communication (50-85%)
      const response = await fetch('/api/contact/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Form-Version': '2.0',
        },
        body: JSON.stringify(enhancedEmailData),
      });
      
      setSubmitProgress(70);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: 'Network error occurred',
          code: response.status 
        }));
        throw new Error(errorData.message || `Server error (${response.status})`);
      }
      
      setSubmitProgress(85);
      
      // Progress: Response processing (85-100%)
      const result = await response.json();
      
      setSubmitProgress(95);
      setSubmitStatus('success');
      
      // Cleanup and success handling
      localStorage.removeItem('booking-wizard-progress');
      localStorage.removeItem('booking-wizard-draft');
      setValidationErrors({});
      
      setSubmitProgress(100);
      
      toast.success('🎉 Booking request submitted successfully! We\'ll be in touch soon.');
      
      // Enhanced completion with better UX
      setTimeout(() => {
        onComplete?.({
          ...result,
          submissionId: result.id || crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        });
      }, 2000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setSubmitProgress(0);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit booking request. Please try again.';
      
      toast.error(errorMessage);
      
      // Reset availability status on error
      setAvailabilityStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setValue('preferredDate', date);
    trigger('preferredDate');
  };

  const handleTimeSelect = (time: string) => {
    setValue('preferredTime', time);
    trigger('preferredTime');
  };

  const renderStepIndicator = () => {
    const overallProgress = ((currentStep + 1) / STEPS.length) * 100;
    
    return (
      <div className="mb-8">
        {/* Overall Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(overallProgress)}% Complete
            </span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-2 bg-gray-100"
          />
        </div>
        
        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(index);
            const isAccessible = index <= currentStep || isCompleted;
            const currentStepProgress = stepProgress[index] || 0;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center relative">
                  {/* Step Circle */}
                  <motion.button
                    type="button"
                    onClick={() => isAccessible && setCurrentStep(index)}
                    disabled={!isAccessible}
                    className={cn(
                      'relative w-14 h-14 rounded-full flex items-center justify-center text-sm font-medium',
                      'transition-all duration-500 transform hover:scale-110 focus:outline-none focus:ring-4',
                      {
                        'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl focus:ring-blue-200': isActive,
                        'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg focus:ring-green-200': isCompleted,
                        'bg-white border-2 border-gray-300 text-gray-400 shadow-sm focus:ring-gray-200': !isActive && !isCompleted,
                        'cursor-pointer': isAccessible,
                        'cursor-not-allowed opacity-50': !isAccessible,
                        'animate-pulse': isActive,
                      }
                    )}
                    whileHover={isAccessible ? { scale: 1.1 } : {}}
                    whileTap={isAccessible ? { scale: 0.95 } : {}}
                  >
                    {/* Progress Ring for Active Step */}
                    {isActive && currentStepProgress > 0 && (
                      <div className="absolute inset-0 rounded-full">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-blue-200"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-white"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${currentStepProgress}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                      </div>
                    )}
                    
                    {/* Icon */}
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 relative z-10" />
                    ) : (
                      <step.icon className="w-6 h-6 relative z-10" />
                    )}
                  </motion.button>
                  
                  {/* Step Info */}
                  <div className="mt-3 text-center max-w-24">
                    <div className={cn(
                      'text-sm font-semibold transition-colors duration-300',
                      {
                        'text-blue-600': isActive,
                        'text-green-600': isCompleted,
                        'text-gray-500': !isActive && !isCompleted,
                      }
                    )}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {step.estimatedTime}
                    </div>
                    {isActive && (
                      <div className="text-xs text-blue-500 mt-1 font-medium">
                        Current
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-4 relative">
                    <div className={cn(
                      'h-1 rounded-full transition-all duration-500',
                      isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-200'
                    )}>
                      {isActive && (
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000"
                          style={{ width: `${currentStepProgress}%` }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContactStep = () => {
    const contactErrors = Object.keys(validationErrors).filter(key => 
      STEPS[0].fields.includes(key as any)
    );
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* Step Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Let's Get to Know You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your contact information so we can personalize your consultation experience and stay in touch.
          </p>
          {contactErrors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">
                Please fix {contactErrors.length} error{contactErrors.length > 1 ? 's' : ''} below
              </p>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="lg:col-span-1">
              <Input
                {...register('name')}
                label="Full Name"
                placeholder="Enter your full name"
                required
                error={errors.name?.message}
                icon={<User className="w-5 h-5" />}
                className="transition-all duration-300"
              />
            </div>

            {/* Email */}
            <div className="lg:col-span-1">
              <Input
                {...register('email')}
                type="email"
                label="Email Address"
                placeholder="your.email@company.com"
                required
                error={errors.email?.message}
                icon={<Mail className="w-5 h-5" />}
                helperText="We'll use this to send you meeting details"
              />
            </div>

            {/* Phone */}
            <div className="lg:col-span-1">
              <Input
                {...register('phone')}
                type="tel"
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                error={errors.phone?.message}
                icon={<Phone className="w-5 h-5" />}
                helperText="Optional - for urgent communications"
              />
            </div>

            {/* Company */}
            <div className="lg:col-span-1">
              <Input
                {...register('company')}
                label="Company/Organization"
                placeholder="Your company name"
                error={errors.company?.message}
                icon={<Building className="w-5 h-5" />}
                helperText="Help us understand your business context"
              />
            </div>

            {/* Timezone */}
            <div className="lg:col-span-2">
              <Select
                value={watchedValues.timezone || ''}
                onChange={(value) => setValue('timezone', value)}
                label="Timezone"
                required
                error={errors.timezone?.message}
                helperText="This helps us schedule at the right time for you"
                options={timezoneOptions.map(tz => ({
                  value: tz.value,
                  label: `${tz.label} (${tz.region})`,
                }))}
              />
            </div>
          </div>

          {/* Auto-save Indicator */}
          {autoSaveEnabled && (
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-2" />
              Your progress is automatically saved
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderConsultationStep = () => {
    const consultationErrors = Object.keys(validationErrors).filter(key => 
      STEPS[1].fields.includes(key as any)
    );
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* Step Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Tell Us About Your Project
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your project details so we can provide the most relevant consultation and prepare for our discussion.
          </p>
          {consultationErrors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">
                Please fix {consultationErrors.length} error{consultationErrors.length > 1 ? 's' : ''} below
              </p>
            </div>
          )}
        </div>

        {/* Consultation Form */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-text-primary">
              Consultation Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultationTypes.map((type) => {
                const isSelected = watchedValues.consultationType === type.value;
                const Icon = type.icon;
                
                return (
                  <motion.div
                    key={type.value}
                    className={cn(
                      'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                      {
                        'border-primary bg-primary/5': isSelected,
                        'border-border-muted hover:border-primary/50 hover:bg-surface-secondary': !isSelected,
                      }
                    )}
                    onClick={() => setValue('consultationType', type.value as any)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={cn('w-6 h-6 mt-1', isSelected ? 'text-primary' : 'text-text-secondary')} />
                      <div className="flex-1">
                        <h4 className={cn('font-semibold', isSelected ? 'text-primary' : 'text-text-primary')}>
                          {type.label}
                        </h4>
                        <p className="text-sm text-text-secondary mt-1">{type.description}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {type.duration}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {errors.consultationType && (
              <p className="text-sm text-error-600">{errors.consultationType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="businessSize" className="block text-sm font-semibold text-text-primary">
              Business Size *
            </label>
            <Select
              value={watchedValues.businessSize || ''}
              onChange={(value) => setValue('businessSize', value as any)}
              options={[
                { value: 'startup', label: 'Startup (1-10 employees)' },
                { value: 'small-business', label: 'Small Business (11-50 employees)' },
                { value: 'medium-business', label: 'Medium Business (51-250 employees)' },
                { value: 'enterprise', label: 'Enterprise (250+ employees)' },
              ]}
              placeholder="Select your business size"
              variant={errors.businessSize ? 'error' : 'default'}
            />
            {errors.businessSize && (
              <p className="text-sm text-error-600 mt-1">{errors.businessSize.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-semibold text-text-primary">
              Project Budget Range *
            </label>
            <Select
              value={watchedValues.budget || ''}
              onChange={(value) => setValue('budget', value as any)}
              options={[
                { value: 'under-10k', label: 'Under $10,000' },
                { value: '10k-25k', label: '$10,000 - $25,000' },
                { value: '25k-50k', label: '$25,000 - $50,000' },
                { value: '50k-100k', label: '$50,000 - $100,000' },
                { value: 'over-100k', label: 'Over $100,000' },
                { value: 'discuss', label: 'Prefer to discuss' },
              ]}
              placeholder="Select budget range"
              variant={errors.budget ? 'error' : 'default'}
            />
            {errors.budget && (
              <p className="text-sm text-error-600 mt-1">{errors.budget.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="currentChallenges" className="block text-sm font-semibold text-text-primary">
                Current Challenges *
              </label>
              <Textarea
                {...register('currentChallenges')}
                id="currentChallenges"
                placeholder="Describe the main challenges you're facing..."
                rows={4}
                error={errors.currentChallenges?.message}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="goals" className="block text-sm font-semibold text-text-primary">
                Goals & Objectives *
              </label>
              <Textarea
                {...register('goals')}
                id="goals"
                placeholder="What do you hope to achieve..."
                rows={4}
                error={errors.goals?.message}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSchedulingStep = () => {
    const schedulingErrors = Object.keys(validationErrors).filter(key => 
      STEPS[2].fields.includes(key as any)
    );
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* Step Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Schedule Your Consultation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your preferred date and time. We'll send you a calendar invitation with all the details.
          </p>
          {schedulingErrors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">
                Please complete all required fields to continue
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-text-primary">
                Meeting Type *
              </label>
              <div className="space-y-3">
                {meetingTypeOptions.map((option) => {
                  const isSelected = watchedValues.meetingType === option.value;
                  const Icon = option.icon;
                  
                  return (
                    <motion.div
                      key={option.value}
                      className={cn(
                        'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 relative',
                        {
                          'border-primary bg-primary/5': isSelected,
                          'border-border-muted hover:border-primary/50 hover:bg-surface-secondary': !isSelected,
                        }
                      )}
                      onClick={() => setValue('meetingType', option.value as any)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.popular && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-secondary text-white">
                          Popular
                        </Badge>
                      )}
                      <div className="flex items-center gap-3">
                        <Icon className={cn('w-5 h-5', isSelected ? 'text-primary' : 'text-text-secondary')} />
                        <div>
                          <h4 className={cn('font-semibold', isSelected ? 'text-primary' : 'text-text-primary')}>
                            {option.label}
                          </h4>
                          <p className="text-sm text-text-secondary">{option.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {errors.meetingType && (
                <p className="text-sm text-error-600">{errors.meetingType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-semibold text-text-primary">
                Meeting Duration *
              </label>
              <Select
                value={watchedValues.duration || ''}
                onChange={(value) => setValue('duration', value as any)}
                options={[
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 hour' },
                  { value: '90', label: '1.5 hours' },
                ]}
                placeholder="Select duration"
                variant={errors.duration ? 'error' : 'default'}
              />
              {errors.duration && (
                <p className="text-sm text-error-600 mt-1">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="additionalNotes" className="block text-sm font-semibold text-text-primary">
                Additional Notes
              </label>
              <Textarea
                {...register('additionalNotes')}
                id="additionalNotes"
                placeholder="Any specific topics you'd like to discuss or special requirements..."
                rows={3}
                error={errors.additionalNotes?.message}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Select Date & Time</h3>
            </div>
            
            <InteractiveCalendar
              selectedDate={watchedValues.preferredDate}
              selectedTime={watchedValues.preferredTime}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
              timezone={watchedValues.timezone}
              className="border-2 border-border-muted"
            />
            
            {availabilityStatus && watchedValues.preferredDate && watchedValues.preferredTime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'p-3 rounded-lg border flex items-center gap-2 text-sm',
                  {
                    'border-yellow-200 bg-yellow-50 text-yellow-800': availabilityStatus === 'checking',
                    'border-green-200 bg-green-50 text-green-800': availabilityStatus === 'available',
                    'border-red-200 bg-red-50 text-red-800': availabilityStatus === 'unavailable',
                  }
                )}
              >
                {availabilityStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin" />}
                {availabilityStatus === 'available' && <CheckCircle className="w-4 h-4" />}
                {availabilityStatus === 'unavailable' && <AlertCircle className="w-4 h-4" />}
                
                {availabilityStatus === 'checking' && 'Checking availability...'}
                {availabilityStatus === 'available' && 'Time slot is available!'}
                {availabilityStatus === 'unavailable' && 'This time slot is no longer available. Please select another time.'}
              </motion.div>
            )}
            
            {errors.preferredDate && (
              <p className="text-sm text-error-600">{errors.preferredDate.message}</p>
            )}
            {errors.preferredTime && (
              <p className="text-sm text-error-600">{errors.preferredTime.message}</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderContactStep();
      case 1:
        return renderConsultationStep();
      case 2:
        return renderSchedulingStep();
      case 3:
        return renderReviewStep();
      default:
        return null;
    }
  };

  const renderReviewStep = () => {
    const formData = getValues();
    const stepErrors = Object.keys(errors).filter(key => 
      currentStepConfig.fields.includes(key as any)
    );

    return (
      <motion.div
        key="review"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        {/* Step Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Final Step
          </div>
          <p className="text-text-secondary">
            Please review your booking details before confirming
          </p>
        </div>

        {/* Error Message */}
        {stepErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-error-50 border border-error-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-error-800">Please review the following:</p>
              <ul className="mt-1 text-sm text-error-700 list-disc list-inside">
                {stepErrors.map(field => (
                  <li key={field}>{errors[field as keyof typeof errors]?.message}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Review Cards */}
        <div className="grid gap-6">
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-text-primary">Contact Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Name:</span>
                <p className="font-medium">{formData.name || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Email:</span>
                <p className="font-medium">{formData.email || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Phone:</span>
                <p className="font-medium">{formData.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Company:</span>
                <p className="font-medium">{formData.company || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-text-primary">Consultation Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Service Type:</span>
                <p className="font-medium">{formData.serviceType || 'Not selected'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Business Size:</span>
                <p className="font-medium">{formData.businessSize || 'Not selected'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Budget Range:</span>
                <p className="font-medium">{formData.budgetRange || 'Not selected'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Urgency:</span>
                <p className="font-medium capitalize">{formData.urgency || 'Medium'}</p>
              </div>
            </div>
          </div>

          {/* Scheduling Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-text-primary">Meeting Schedule</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Date:</span>
                <p className="font-medium">{formData.preferredDate || 'Not selected'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Time:</span>
                <p className="font-medium">{formData.preferredTime || 'Not selected'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Meeting Type:</span>
                <p className="font-medium capitalize">{formData.meetingType?.replace('-', ' ') || 'Video Call'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Duration:</span>
                <p className="font-medium">{formData.duration || '60'} minutes</p>
              </div>
            </div>
            {formData.agenda && (
              <div className="mt-4">
                <span className="text-text-secondary">Agenda:</span>
                <p className="font-medium mt-1">{formData.agenda}</p>
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white border border-border-muted rounded-lg p-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="termsAccepted"
              {...register('termsAccepted')}
              className="mt-1 w-4 h-4 text-primary border-border-muted rounded focus:ring-primary focus:ring-2"
            />
            <div className="flex-1">
              <label htmlFor="termsAccepted" className="text-sm text-text-primary cursor-pointer">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                . I understand that this consultation booking is subject to availability confirmation.
              </label>
              {errors.termsAccepted && (
                <p className="mt-1 text-sm text-error-600">{errors.termsAccepted.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text-primary">What happens next?</h3>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              You'll receive a confirmation email within 5 minutes
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              We'll send calendar invites for your selected time slot
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              A preparation guide will be shared 24 hours before the meeting
            </li>
          </ul>
        </div>
      </motion.div>
    );
  };

  return (
    <UnifiedErrorBoundary level="component" name="BookingWizard">
      <PageTransition loading={isSubmitting && submitStatus === 'validating'} variant="fade">
        <div className={cn('max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg', className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold mb-4',
            `bg-gradient-to-r ${currentStepConfig.color}`
          )}
        >
          <currentStepConfig.icon className="w-5 h-5" />
          Step {currentStep + 1} of {STEPS.length}
        </motion.div>
        
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-text-primary mb-2"
        >
          {currentStepConfig.title}
        </motion.h2>
        
        <motion.p
          key={`${currentStep}-desc`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-text-secondary"
        >
          {currentStepConfig.description}
        </motion.p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>

        {/* Progress Indicator - Only show when submitting */}
        {isSubmitting && isLastStep && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {submitStatus === 'validating' && 'Validating booking details...'}
                {submitStatus === 'sending' && 'Sending booking request...'}
                {submitStatus === 'success' && 'Booking request sent successfully!'}
                {submitStatus === 'error' && 'Error occurred during submission'}
              </span>
              <span>{submitProgress}%</span>
            </div>
            <Progress 
              value={submitProgress} 
              className="h-2"
              variant={submitStatus === 'error' ? 'error' : submitStatus === 'success' ? 'success' : 'default'}
            />
          </motion.div>
        )}

        {/* reCAPTCHA - Only show on last step */}
        {isLastStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <ReCAPTCHA onChange={handleReCaptchaChange} />
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border-muted">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep || isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>{currentStep + 1} of {STEPS.length}</span>
          </div>

          {!isLastStep ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isValidatingStep}
              className="flex items-center gap-2"
            >
              {isValidatingStep ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || !recaptchaToken || availabilityStatus === 'unavailable'}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  {submitStatus === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : submitStatus === 'error' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <span>
                    {submitStatus === 'validating' && 'Validating...'}
                    {submitStatus === 'sending' && 'Booking...'}
                    {submitStatus === 'success' && 'Booked!'}
                    {submitStatus === 'error' && 'Try Again'}
                  </span>
                </div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Book Consultation
                </>
              )}
            </Button>
          )}
        </div>
        </form>
        </div>
      </PageTransition>
    </UnifiedErrorBoundary>
  );
};

export default BookingWizard;