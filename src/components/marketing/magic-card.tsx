"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#7c3aed", // Purple color for NosytLabs
  gradientOpacity = 0.8,
  gradientFrom = "#7c3aed", // Purple
  gradientTo = "#a855f7", // Light purple
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (divRef.current) {
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        divRef.current.style.setProperty("--x", `${x}px`);
        divRef.current.style.setProperty("--y", `${y}px`);
      }
    },
    [],
  );

  const handleMouseEnter = useCallback(() => {
    if (divRef.current) {
      divRef.current.style.setProperty("--opacity", gradientOpacity.toString());
    }
  }, [gradientOpacity]);

  const handleMouseLeave = useCallback(() => {
    if (divRef.current) {
      divRef.current.style.setProperty("--opacity", "0");
    }
  }, []);

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.addEventListener("mousemove", handleMouseMove);
      div.addEventListener("mouseenter", handleMouseEnter);
      div.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        div.removeEventListener("mousemove", handleMouseMove);
        div.removeEventListener("mouseenter", handleMouseEnter);
        div.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
    return () => {}; // Add explicit return for when div is null
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.setProperty("--size", `${gradientSize}px`);
      divRef.current.style.setProperty("--color", gradientColor);
      divRef.current.style.setProperty("--opacity", "0");
      divRef.current.style.setProperty("--from", gradientFrom);
      divRef.current.style.setProperty("--to", gradientTo);
    }
  }, [gradientSize, gradientColor, gradientFrom, gradientTo]);

  return (
    <div
      ref={divRef}
      className={cn(
        "relative overflow-hidden rounded-xl border border-purple-200/20 bg-white/80 backdrop-blur-sm dark:border-purple-700/20 dark:bg-purple-950/80",
        "before:absolute before:inset-0 before:rounded-xl before:p-px before:opacity-0 before:transition-opacity before:duration-500",
        "before:bg-[radial-gradient(var(--size)_circle_at_var(--x)_var(--y),var(--from),var(--to),transparent_70%)]",
        "before:[mask:linear-gradient(white,white)_content-box,linear-gradient(white,white)]",
        "before:[mask-composite:xor]",
        "hover:before:opacity-100",
        className,
      )}
      style={
        {
          "--x": "0px",
          "--y": "0px",
          "--opacity": "0",
          "--size": `${gradientSize}px`,
          "--color": gradientColor,
          "--from": gradientFrom,
          "--to": gradientTo,
        } as React.CSSProperties
      }
    >
      <div className="relative z-10">{children}</div>
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(var(--size) circle at var(--x) var(--y), var(--color), transparent 70%)`,
          opacity: "var(--opacity)",
        }}
      />
    </div>
  );
};
