/**
 * Unified Form Component
 * 
 * A standardized form component that provides consistent styling, validation,
 * and accessibility features across React and Astro implementations.
 */

import React from 'react';
import { type FieldValues, FormProvider, type UseFormReturn } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { useUnifiedForm, type UnifiedFormOptions } from '../../hooks/useUnifiedForm';
import { Button } from '../ui/button';

export interface UnifiedFormProps<T extends FieldValues> extends UnifiedFormOptions<T> {
  children: React.ReactNode;
  className?: string;
  submitButtonText?: string;
  submitButtonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'success' | 'danger' | 'warning' | 'gradient' | 'AI' | 'neural' | 'quantum' | 'glow' | 'neon' | 'glass';
  showSubmitButton?: boolean;
  formTitle?: string;
  formDescription?: string;
  resetOnSuccess?: boolean;
}

/**
 * Unified form component with built-in validation and accessibility
 */
export function UnifiedForm<T extends FieldValues>({
  children,
  className,
  submitButtonText = 'Submit',
  submitButtonVariant = 'primary',
  showSubmitButton = true,
  formTitle,
  formDescription,
  resetOnSuccess = false,
  schema,
  onSubmit,
  onError,
  ...formOptions
}: UnifiedFormProps<T>) {
  const form = useUnifiedForm<T>({
    schema,
    onSubmit: async (data) => {
      await onSubmit(data);
      if (resetOnSuccess) {
        form.resetForm();
      }
    },
    onError: onError || undefined,
    ...(formOptions as any),
  });

  const { handleSubmit, formState } = form;

  // Extract only the UseFormReturn properties for FormProvider
  const formProviderProps = {
    control: form.control,
    register: form.register,
    handleSubmit: form.handleSubmit,
    watch: form.watch,
    getValues: form.getValues,
    getFieldState: form.getFieldState,
    setError: form.setError,
    clearErrors: form.clearErrors,
    setValue: form.setValue,
    trigger: form.trigger,
    formState: form.formState,
    resetField: form.resetField,
    reset: form.reset,
    setFocus: form.setFocus,
    unregister: form.unregister,
  } as unknown as UseFormReturn<T>;

  return (
    <FormProvider {...formProviderProps}>
      <form
        onSubmit={handleSubmit}
        className={cn('space-y-6', className)}
        noValidate
        aria-label={formTitle || 'Form'}
      >
        {/* Form Header */}
        {(formTitle || formDescription) && (
          <div className="space-y-2">
            {formTitle && (
              <h2 className="text-2xl font-semibold text-text-primary">
                {formTitle}
              </h2>
            )}
            {formDescription && (
              <p className="text-text-muted">
                {formDescription}
              </p>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {children}
        </div>

        {/* Form-level Error */}
        {form.formState.errors.root && (
          <div
            className="rounded-md bg-critical/10 border border-critical/20 p-4"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-critical flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-critical font-medium">
                {form.formState.errors.root.message}
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {formState.isSubmitted && !formState.isSubmitting && !form.hasErrors && (
          <div
            className="rounded-md bg-success/10 border border-success/20 p-4"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-success flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.23a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-success font-medium">
                Form submitted successfully!
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {showSubmitButton && (
          <div className="flex justify-end">
            <Button
              type="submit"
              variant={submitButtonVariant}
              disabled={formState.isSubmitting || !form.isDirty}
              className="min-w-[120px]"
            >
              {formState.isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

/**
 * Form field wrapper component for consistent styling
 */
export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function FormField({ children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
}

/**
 * Form section component for grouping related fields
 */
export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-medium text-text-primary">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-text-muted">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * Form actions component for submit/cancel buttons
 */
export interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={cn('flex items-center gap-3 pt-6', alignmentClasses[align], className)}>
      {children}
    </div>
  );
}

export type { UnifiedFormOptions };