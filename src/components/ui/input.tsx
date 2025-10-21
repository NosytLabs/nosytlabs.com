import * as React from "react"
import { cn } from "@/lib/core/utils"
import type { InputProps } from "@/types"
import { FormField } from "../forms/FormField";

interface EnhancedInputProps extends InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  autoComplete?: string;
}

const Input = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    type, 
    label,
    error,
    helperText,
    autoComplete,
    ...props 
  }, ref) => {
    return (
      <FormField
        label={label}
        error={error}
        helperText={helperText}
        id={props.id}
        aria-required={props["aria-required"]}
        autoComplete={autoComplete}
      >
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
      </FormField>
    )
  }
)
Input.displayName = "Input"

export { Input }
