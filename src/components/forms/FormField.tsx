import * as React from "react";
import { cn } from "@/lib/core/utils";

interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
  "aria-required"?: boolean;
  autoComplete?: string;
}

const FormField = ({
  label,
  error,
  helperText,
  children,
  id,
  className,
  "aria-required": ariaRequired,
  autoComplete,
}: FormFieldProps) => {
  const inputId = id || React.useId();
  const errorId = error ? `${inputId}-error` : undefined;
  const helperTextId = helperText ? `${inputId}-helper` : undefined;

  const describedBy =
    [errorId, helperTextId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {ariaRequired && (
            <span className="text-destructive ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {React.cloneElement(children as React.ReactElement, {
        id: inputId,
        "aria-describedby": describedBy,
        "aria-invalid": !!error,
        "aria-required": ariaRequired,
        autoComplete,
      })}
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperTextId} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};

FormField.displayName = "FormField";

export { FormField };
