
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

export interface FormInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  // Input props
  className?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  variant?: 'default' | 'error' | 'success';
  size?: 'default' | 'sm' | 'lg' | 'xl';
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  showRequiredIndicator?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  min?: number;
  max?: number;
}

export function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  description,
  className,
  ...props
}: FormInputProps<T>) {
  const error = form.formState.errors[name];
  const fieldProps = form.register(name);

  return (
    <div className={cn('grid w-full items-center gap-1.5', className)}>
      {label && <label htmlFor={name}>{label}</label>}
      <Input
        id={name}
        aria-invalid={!!error}
        {...fieldProps}
        {...props}
      />
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error?.message && (
        <p className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}

/**
 * Validated Form Input
 */
export interface ValidatedFormInputProps<T extends FieldValues> extends FormInputProps<T> {
  validationRules?: any;
}

export function ValidatedFormInput<T extends FieldValues>({
  form,
  name,
  validationRules,
  ...props
}: ValidatedFormInputProps<T>) {
  // Create a modified form object with validation rules
  const modifiedForm = {
    ...form,
    register: (fieldName: Path<T>) => form.register(fieldName, validationRules)
  } as UseFormReturn<T>;

  return (
    <FormInput
      form={modifiedForm}
      name={name}
      {...props}
    />
  );
}

/**
 * Email Input
 */
export function EmailFormInput<T extends FieldValues>(props: FormInputProps<T>) {
  const validatedProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value !== undefined)
  ) as unknown as FormInputProps<T>;

  return (
    <ValidatedFormInput
      type="email"
      validationRules={{
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
        },
      }}
      {...validatedProps}
    />
  );
}

/**
 * Phone Input
 */
export function PhoneFormInput<T extends FieldValues>(props: FormInputProps<T>) {
  const validatedProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value !== undefined)
  ) as unknown as FormInputProps<T>;

  return (
    <ValidatedFormInput
      type="tel"
      validationRules={{
        pattern: {
          value: /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im,
          message: 'Invalid phone number',
        },
      }}
      {...validatedProps}
    />
  );
}

/**
 * URL Input
 */
export function UrlFormInput<T extends FieldValues>(props: FormInputProps<T>) {
  const validatedProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value !== undefined)
  ) as unknown as FormInputProps<T>;

  return (
    <ValidatedFormInput
      type="url"
      validationRules={{
        pattern: {
          value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
          message: 'Invalid URL',
        },
      }}
      {...validatedProps}
    />
  );
}

/**
 * Number Input
 */
export interface NumberFormInputProps<T extends FieldValues> extends FormInputProps<T> {
  min?: number;
  max?: number;
}

export function NumberFormInput<T extends FieldValues>({
  min,
  max,
  ...props
}: NumberFormInputProps<T>) {
  const validationRules: any = {
    valueAsNumber: true,
  };

  if (min !== undefined) {
    validationRules.min = { value: min, message: `Minimum value is ${min}` };
  }

  if (max !== undefined) {
    validationRules.max = { value: max, message: `Maximum value is ${max}` };
  }

  const validatedProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value !== undefined)
  ) as unknown as FormInputProps<T>;

  return (
    <ValidatedFormInput
      type="number"
      {...(min !== undefined && { min })}
      {...(max !== undefined && { max })}
      validationRules={validationRules}
      {...validatedProps}
    />
  );
}