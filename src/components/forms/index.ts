/**
 * Unified Form Components
 * 
 * Standardized form components that provide consistent styling, validation,
 * and accessibility features across React and Astro implementations.
 */

// Main form components
export {
  UnifiedForm,
  FormField,
  FormSection,
  FormActions,
  type UnifiedFormProps,
  type FormFieldProps,
  type FormSectionProps,
  type FormActionsProps,
  type UnifiedFormOptions
} from './UnifiedForm';

// Input components
export {
  FormInput,
  ValidatedFormInput,
  EmailFormInput,
  PhoneFormInput,
  UrlFormInput,
  NumberFormInput,
  type FormInputProps,
  type ValidatedFormInputProps,
  type NumberFormInputProps
} from './FormInput';

// Textarea components
export {
  FormTextarea,
  ValidatedFormTextarea,
  MessageFormTextarea,
  DescriptionFormTextarea,
  CommentsFormTextarea,
  type FormTextareaProps,
  type ValidatedFormTextareaProps
} from './FormTextarea';

// Select components
export {
  FormSelect,
  ValidatedFormSelect,
  type FormSelectProps,
  type ValidatedFormSelectProps
} from './FormSelect';

// Re-export the unified form hook
export {
  useUnifiedForm,
  type UnifiedFormOptions as UseUnifiedFormOptions
} from '../../hooks/useUnifiedForm';

// Re-export validation utilities
export {
  contactFormSchema,
  validateContactForm,
  type ContactFormData
} from '../../utils/validation';