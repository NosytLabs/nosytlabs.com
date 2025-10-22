import { Button } from "@heroui/react";
import type { ButtonProps } from "@heroui/react";

interface HeroUIButtonProps extends Omit<ButtonProps, "variant" | "color"> {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "outline"
    | "ghost"
    | "destructive"
    | "gradient";
  href?: string;
  external?: boolean;
}

/**
 * HeroUI Button with NOSYT Labs design system variants
 * Maps custom variants to HeroUI's built-in variants
 */
export function HeroUIButton({
  variant = "primary",
  href,
  external = false,
  children,
  className,
  ...props
}: HeroUIButtonProps) {
  // Map design system variants to HeroUI
  const variantMap = {
    primary: { variant: "solid" as const, color: "primary" as const },
    secondary: { variant: "bordered" as const, color: "primary" as const },
    tertiary: { variant: "light" as const, color: "default" as const },
    outline: { variant: "bordered" as const, color: "default" as const },
    ghost: { variant: "light" as const, color: "default" as const },
    destructive: { variant: "solid" as const, color: "danger" as const },
    gradient: { variant: "shadow" as const, color: "primary" as const },
  };

  const { variant: heroVariant, color: heroColor } = variantMap[variant];

  // Render as link if href provided
  if (href) {
    return (
      <Button
        as="a"
        href={href}
        variant={heroVariant}
        color={heroColor}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      variant={heroVariant}
      color={heroColor}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}

export default HeroUIButton;
