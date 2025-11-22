import React from "react";
import type { BaseComponentProps } from "@/types";

interface BlogCalloutProps extends BaseComponentProps {
  type?: "info" | "warning" | "success" | "error" | "tip";
  title?: string;
  children: React.ReactNode;
}

export default function BlogCallout({
  type = "info",
  title,
  children,
  className = "",
}: BlogCalloutProps) {
  const getCalloutStyles = () => {
    switch (type) {
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-900 dark:text-yellow-100";
      case "success":
        return "border-green-500/20 bg-green-500/10 text-green-900 dark:text-green-100";
      case "error":
        return "border-red-500/20 bg-red-500/10 text-red-900 dark:text-red-100";
      case "tip":
        return "border-purple-500/20 bg-purple-500/10 text-purple-900 dark:text-purple-100";
      default:
        return "border-blue-500/20 bg-blue-500/10 text-blue-900 dark:text-blue-100";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return (
          <svg
            className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            className="w-5 h-5 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "tip":
        return (
          <svg
            className="w-5 h-5 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`card-base border-l-4 ${getCalloutStyles()} ${className}`}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-2 text-current">{title}</h4>
          )}
          <div className="text-current [&>*:last-child]:mb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
