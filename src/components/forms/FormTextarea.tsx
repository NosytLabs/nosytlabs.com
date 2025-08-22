/**
 * Unified Form Textarea Component
 * 
 * A wrapper around the Textarea component that integrates with React Hook Form
 * and provides consistent form field behavior.
 */

import { type UseFormReturn, type FieldValues, type Path } from 'react-hook-form';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';

export interface FormTextareaProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  helperText?: string;
  showRequiredIndicator?: boolean;
  className?: string;
  minLength?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  cols?: number;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * Form textarea component with React Hook Form integration
 */
export function FormTextarea<T extends FieldValues>({
  form,
  name,
  label,
  helperText,
  showRequiredIndicator,
  className,
  required,
  disabled,
  minLength,
  maxLength,
  showCharacterCount = true,
  ...textareaProps
}: FormTextareaProps<T>) {
  const registerOptions: any = {};
  if (required) registerOptions.required = 'This field is required';
  if (minLength) registerOptions.minLength = {
    value: minLength,
    message: `Must be at least ${minLength} characters`
  };
  if (maxLength) registerOptions.maxLength = {
    value: maxLength,
    message: `Must be no more than ${maxLength} characters`
  };

  const fieldProps = form.register(name, Object.keys(registerOptions).length > 0 ? registerOptions : undefined);

  const fieldError = form.formState.errors[name]?.message as string | undefined;
  const hasError = !!fieldError;

  const ariaDescribedBy = [
    helperText ? `${name}-helper` : '',
    fieldError ? `${name}-error` : '',
    showCharacterCount && maxLength ? `${name}-count` : ''
  ].filter(Boolean).join(' ');

  const textareaPropsToPass = {
    ...fieldProps,
    ...textareaProps,
    ...(label !== undefined && { label }),
    ...(helperText !== undefined && { helperText }),
    ...(fieldError !== undefined && { errorMessage: fieldError }),
    ...(required !== undefined && { required }),
    disabled: disabled || form.formState.isSubmitting,
    ...(showRequiredIndicator !== undefined && { showRequiredIndicator }),
    ...(maxLength !== undefined && { maxLength }),
    showCharacterCount,
    'aria-invalid': hasError,
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy })
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Textarea {...textareaPropsToPass} />
    </div>
  );
}

/**
 * Form textarea with validation display
 */
export interface ValidatedFormTextareaProps<T extends FieldValues> extends FormTextareaProps<T> {
  validationRules?: {
    required?: boolean | string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    validate?: (value: any) => boolean | string;
  };
}

export function ValidatedFormTextarea<T extends FieldValues>({
  form,
  name,
  validationRules,
  ...props
}: ValidatedFormTextareaProps<T>) {
  // Create a modified form object with validation rules
  const modifiedForm = {
    ...form,
    register: (fieldName: Path<T>) => form.register(fieldName, validationRules)
  } as UseFormReturn<T>;

  return (
    <FormTextarea
      form={modifiedForm}
      name={name}
      {...props}
    />
  );
}

/**
 * Message textarea with built-in validation for contact forms
 */
export function MessageFormTextarea<T extends FieldValues>(props: Omit<FormTextareaProps<T>, 'rows' | 'minLength'>) {
  return (
    <ValidatedFormTextarea
      {...props}
      rows={4}
      minLength={10}
      maxLength={1000}
      validationRules={{
        required: props.required ? 'Message is required' : false,
        minLength: {
          value: 10,
          message: 'Message must be at least 10 characters'
        },
        maxLength: {
          value: 1000,
          message: 'Message must be no more than 1000 characters'
        }
      }}
    />
  );
}

/**
 * Description textarea with built-in validation
 */
export function DescriptionFormTextarea<T extends FieldValues>(props: Omit<FormTextareaProps<T>, 'rows' | 'maxLength'>) {
  return (
    <ValidatedFormTextarea
      {...props}
      rows={3}
      maxLength={500}
      validationRules={{
        required: props.required ? 'Description is required' : false,
        maxLength: {
          value: 500,
          message: 'Description must be no more than 500 characters'
        }
      }}
    />
  );
}

/**
 * Comments textarea with built-in validation
 */
export function CommentsFormTextarea<T extends FieldValues>(props: Omit<FormTextareaProps<T>, 'rows' | 'maxLength'>) {
  return (
    <ValidatedFormTextarea
      {...props}
      rows={6}
      maxLength={2000}
      validationRules={{
        required: props.required ? 'Comments are required' : false,
        maxLength: {
          value: 2000,
          message: 'Comments must be no more than 2000 characters'
        }
      }}
    />
  );
}