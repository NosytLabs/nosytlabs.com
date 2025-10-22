import React from "react";
import { HeroUIProvider } from "@heroui/react";

interface Props {
  children: React.ReactNode;
}

/**
 * HeroUI Provider wrapper for the entire app
 * Provides HeroUI context to all components
 */
export function HeroUIWrapper({ children }: Props) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

export default HeroUIWrapper;
