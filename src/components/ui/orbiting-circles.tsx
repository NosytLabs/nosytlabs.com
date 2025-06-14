import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export default function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 10,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
}: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <circle
            className="stroke-purple-300/20 stroke-1 dark:stroke-purple-500/20"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}

      <div
        style={
          {
            "--duration": duration,
            "--radius": radius,
            "--delay": -delay,
            "--speed": speed,
          } as React.CSSProperties
        }
        className={cn(
          "absolute flex h-full w-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-purple-50/10 [animation-delay:calc(var(--delay)*1s)] dark:bg-purple-900/10",
          { "[animation-direction:reverse]": reverse },
          className,
        )}
      >
        <div
          className={cn(
            "flex h-full w-full transform-gpu items-center justify-center rounded-full border border-purple-200/20 bg-white/80 backdrop-blur-sm dark:border-purple-700/20 dark:bg-purple-950/80",
            `h-[${iconSize}px] w-[${iconSize}px]`,
          )}
          style={{
            transform: `rotate(calc(var(--speed) * var(--duration) * -360deg))`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
