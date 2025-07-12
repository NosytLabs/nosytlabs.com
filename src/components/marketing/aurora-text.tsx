import React from "react";
import { cn } from "@/lib/utils";

interface AuroraTextProps {
  className?: string;
  children: React.ReactNode;
  colors?: string[];
  speed?: number;
}

export const AuroraText: React.FC<AuroraTextProps> = ({
  className,
  children,
  colors = ["#7c3aed", "#a855f7", "#c084fc", "#ddd6fe"], // Purple theme for NosytLabs
  speed = 1,
}) => {
  const gradientId = React.useId();

  return (
    <div
      className={cn(
        "relative inline-block text-transparent bg-clip-text",
        className,
      )}
      style={{
        backgroundImage: `url(#${gradientId})`,
      }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor={colors[0]}>
              <animate
                attributeName="stop-color"
                values={`${colors[0]};${colors[1]};${colors[2]};${colors[3]};${colors[0]}`}
                dur={`${4 / speed}s`}
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="25%" stopColor={colors[1]}>
              <animate
                attributeName="stop-color"
                values={`${colors[1]};${colors[2]};${colors[3]};${colors[0]};${colors[1]}`}
                dur={`${4 / speed}s`}
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor={colors[2]}>
              <animate
                attributeName="stop-color"
                values={`${colors[2]};${colors[3]};${colors[0]};${colors[1]};${colors[2]}`}
                dur={`${4 / speed}s`}
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="75%" stopColor={colors[3]}>
              <animate
                attributeName="stop-color"
                values={`${colors[3]};${colors[0]};${colors[1]};${colors[2]};${colors[3]}`}
                dur={`${4 / speed}s`}
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor={colors[0]}>
              <animate
                attributeName="stop-color"
                values={`${colors[0]};${colors[1]};${colors[2]};${colors[3]};${colors[0]}`}
                dur={`${4 / speed}s`}
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
      </svg>
      <span
        className="relative z-10 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
          backgroundSize: "400% 100%",
          animation: `aurora-shift ${4 / speed}s ease-in-out infinite`,
        }}
      >
        {children}
      </span>
    </div>
  );
};
