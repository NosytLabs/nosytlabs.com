/**
 * Unified Form Hook
 * 
 * Provides a standardized form handling solution that works with both React and Astro components.
 * Combines React Hook Form with Zod validation for type-safe, accessible form management.
 */

import { useForm, type UseFormProps, type FieldValues, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document === 'undefined') return; // SSR safety
  
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

export interface UnifiedFormOptions<T extends FieldValues> extends UseFormProps<T> {
  schema?: z.ZodSchema<T> | undefined;
  onSubmit: (data: T) => Promise<void> | void;
  onError?: ((errors: Record<string, string>) => void) | undefined;
  enableAccessibility?: boolean | undefined;
  announceErrors?: boolean | undefined;
}

export interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
  lastSubmitTime?: Date;
}

/**
 * Unified form hook that provides consistent form handling across the application
 */
export function useUnifiedForm<T extends FieldValues>({
  schema,
  onSubmit,
  onError,
  enableAccessibility = true,
  announceErrors = true,
  ...formOptions
}: UnifiedFormOptions<T>) {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSubmitted: false,
    submitCount: 0,
  });

  const form = useForm<T>({
    resolver: schema ? zodResolver(schema as any) : undefined,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    ...(formOptions as any),
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError,
    reset,
  } = form;

  /**
   * Enhanced submit handler with error handling and accessibility
   */
  const onSubmitHandler = useCallback(
    async (data: T) => {
      setFormState(prev => ({
        ...prev,
        isSubmitting: true,
        submitCount: prev.submitCount + 1,
      }));

      try {
        await onSubmit(data);
        
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
          lastSubmitTime: new Date(),
        }));

        // Announce success to screen readers
        if (enableAccessibility && announceErrors) {
          announceToScreenReader('Form submitted successfully');
        }

        logger.info('Form submitted successfully', { formData: data });
      } catch (error) {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
        }));

        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        
        // Set form-level error
        setError('root' as Path<T>, {
          type: 'submit',
          message: errorMessage,
        });

        // Call custom error handler
        if (onError) {
          const errorMap: Record<string, string> = {};
          Object.entries(errors).forEach(([key, error]) => {
            if (error && typeof error === 'object' && 'message' in error) {
              const message = typeof error.message === 'string' ? error.message : 'Invalid value';
              errorMap[key] = message;
            } else {
              errorMap[key] = 'Invalid value';
            }
          });
          onError(errorMap);
        }

        // Announce error to screen readers
        if (enableAccessibility && announceErrors) {
          announceToScreenReader(`Form submission failed: ${errorMessage}`);
        }

        logger.error('Form submission failed', { error, formData: data });
      }
    },
    [onSubmit, onError, enableAccessibility, announceErrors, setError, errors]
  );

  /**
   * Get field error message
   */
  const getFieldError = useCallback(
    (fieldName: Path<T>): string | undefined => {
      const error = errors[fieldName];
      return typeof error?.message === 'string' ? error.message : undefined;
    },
    [errors]
  );

  /**
   * Check if field has error
   */
  const hasFieldError = useCallback(
    (fieldName: Path<T>): boolean => {
      return !!errors[fieldName];
    },
    [errors]
  );

  /**
   * Get field validation state
   */
  const getFieldState = useCallback(
    (fieldName: Path<T>) => {
      const hasError = hasFieldError(fieldName);
      const fieldState = form.getFieldState(fieldName);
      
      return {
        hasError,
        errorMessage: getFieldError(fieldName),
        isDirty: fieldState.isDirty,
        isTouched: fieldState.isTouched,
        isValid: !hasError && fieldState.isTouched,
      };
    },
    [form, hasFieldError, getFieldError]
  );

  /**
   * Reset form with accessibility announcement
   */
  const resetForm = useCallback(
    (values?: T) => {
      reset(values);
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        submitCount: 0,
      });
      
      if (enableAccessibility && announceErrors) {
        announceToScreenReader('Form has been reset');
      }
    },
    [reset, enableAccessibility, announceErrors]
  );

  return {
    // Form instance
    ...form,
    
    // Enhanced handlers
    handleSubmit: handleSubmit(onSubmitHandler as any),
    resetForm,
    
    // Field utilities
    getFieldError,
    hasFieldError,
    getFieldState,
    
    // Form state
    formState: {
      ...form.formState,
      ...formState,
    },
    
    // Validation state
    isValid,
    isDirty,
    hasErrors: Object.keys(errors).length > 0,
  };
}



/**
 * Create form field props for consistent styling and behavior
 */
export function createFieldProps<T extends FieldValues>(
  form: ReturnType<typeof useUnifiedForm<T>>,
  fieldName: Path<T>,
  options: {
    label?: string;
    helperText?: string;
    required?: boolean;
    showRequiredIndicator?: boolean;
  } = {}
) {
  const fieldState = form.getFieldState(fieldName);
  const { register } = form;
  
  return {
    ...register(fieldName),
    id: `field-${fieldName}`,
    'aria-invalid': fieldState.hasError,
    'aria-describedby': fieldState.hasError ? `${fieldName}-error` : undefined,
    label: options.label,
    helperText: options.helperText,
    errorMessage: fieldState.errorMessage,
    successMessage: fieldState.isValid ? undefined : undefined,
    required: options.required,
    showRequiredIndicator: options.showRequiredIndicator,
  };
}