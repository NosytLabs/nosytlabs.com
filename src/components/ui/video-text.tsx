import React, { type ElementType } from "react";
import { cn } from "@/lib/utils";

interface VideoTextProps {
  src: string;
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "auto" | "metadata" | "none";
  fontSize?: string | number;
  fontWeight?: string | number;
  textAnchor?: string;
  dominantBaseline?: string;
  fontFamily?: string;
}

export const VideoText: React.FC<VideoTextProps> = ({
  src,
  as: Component = "div",
  children,
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = "120",
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
}) => {
  const maskId = React.useId();

  return (
    <Component
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
    >
      <video
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        preload={preload}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          maskImage: `url(#${maskId})`,
          WebkitMaskImage: `url(#${maskId})`,
        }}
      >
        <source src={src} type="video/webm" />
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              textAnchor={textAnchor}
              dominantBaseline={dominantBaseline}
              fontSize={fontSize}
              fontWeight={fontWeight}
              fontFamily={fontFamily}
              fill="white"
            >
              {children}
            </text>
          </mask>
        </defs>
      </svg>

      <div className="relative z-10 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
        <span
          style={{
            fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
            fontWeight,
            fontFamily,
          }}
          className="font-bold"
        >
          {children}
        </span>
      </div>
    </Component>
  );
};
