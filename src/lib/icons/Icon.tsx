import React from 'react';
import type { BaseComponentProps } from '@/types';

export interface IconProps extends BaseComponentProps {
  size?: number;
  color?: string;
  paths?: string[];
  svg?: string;
}

// SVG sanitization function to prevent XSS attacks
function sanitizeSvg(svg: string): string {
  // Remove potentially dangerous attributes and elements
  return svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/style\s*=\s*["'][^"']*expression\([^"']*\)["']/gi, '')
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
}

const Icon: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  className, 
  paths = [], 
  svg 
}) => {
  // If we have a complete SVG string, render it directly
  if (svg) {
    // Sanitize the SVG first to prevent XSS
    const sanitizedSvg = sanitizeSvg(svg);
    
    // Create a modified SVG with the correct size and color
    const modifiedSvg = sanitizedSvg
      .replace(/width="[^"]*"/, `width="${size}"`)
      .replace(/height="[^"]*"/, `height="${size}"`)
      .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
      .replace(/class="[^"]*"/g, className ? `class="${className}"` : '');
    
    return (
      <div 
        className={className}
        style={{ 
          width: size, 
          height: size, 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        dangerouslySetInnerHTML={{ __html: modifiedSvg }}
      />
    );
  }

  // Fallback to the original path-based rendering
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.isArray(paths) && paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
};

export default Icon;
