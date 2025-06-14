import React from "react";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-purple-600 to-purple-700 px-6 font-medium text-white transition-all duration-300 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 -top-[2px] mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute -inset-px rounded-md bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-30" />
    </button>
  );
};
