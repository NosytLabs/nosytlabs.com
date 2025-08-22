/**
 * Unified Form Select Component
 *
 * A select component that integrates with React Hook Form
 * and provides consistent form field behavior.
 */

import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { Select, type SelectOption } from '../ui/select';

export interface FormSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  helperText?: string;
  showRequiredIndicator?: boolean;
  className?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'error' | 'success';
  size?: 'default' | 'sm' | 'lg';
}

/**
 * Form select component with React Hook Form integration
 */
export function FormSelect<T extends FieldValues>({
  form,
  name,
  label,
  helperText,
  showRequiredIndicator,
  className,
  required,
  disabled,
  options,
  placeholder,
  variant,
  size
}: FormSelectProps<T>) {
  const error = form.formState.errors[name];
  const fieldProps = form.register(name, {
    required: required ? 'Please select an option' : false,
  });

  const fieldError = error?.message as string | undefined;
  const hasError = !!error;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            'block text-sm font-medium',
            hasError ? 'text-critical' : 'text-text-muted'
          )}
        >
          {label}
          {required && showRequiredIndicator && (
            <span
              className="ml-1 text-critical"
              aria-label="required"
              title="This field is required"
            >
              *
            </span>
          )}
        </label>
      )}
      <Select
        {...fieldProps}
        id={name}
        required={required}
        disabled={disabled || form.formState.isSubmitting}
        options={options}
        {...(placeholder && { placeholder })}
        aria-invalid={hasError}
        variant={hasError ? 'error' : (variant || 'default')}
        size={size}
      />
      {helperText && !hasError && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      {fieldError && (
        <p className="text-sm text-critical">{fieldError}</p>
      )}
    </div>
  );
}

/**
 * Form select with validation display
 */
export interface ValidatedFormSelectProps<T extends FieldValues> extends FormSelectProps<T> {
  validationRules?: {
    required?: boolean | string;
    validate?: (value: any) => boolean | string;
  };
}

export function ValidatedFormSelect<T extends FieldValues>({
  form,
  name,
  validationRules,
  ...props
}: ValidatedFormSelectProps<T>) {
  // Create a modified form object with validation rules
  const modifiedForm = {
    ...form,
    register: (fieldName: Path<T>) => form.register(fieldName, validationRules)
  } as UseFormReturn<T>;

  return (
    <FormSelect
      form={modifiedForm}
      name={name}
      {...props}
    />
  );
}