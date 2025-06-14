import { cn } from "@/lib/utils";

interface RetroGridProps {
  className?: string;
  angle?: number;
  cellSize?: number;
  opacity?: number;
  lightLineColor?: string;
  darkLineColor?: string;
}

export const RetroGrid: React.FC<RetroGridProps> = ({
  className,
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "#7c3aed", // Purple for NosytLabs
  darkLineColor = "#a855f7", // Light purple for dark mode
}) => {
  const gridStyle = {
    "--grid-angle": `${angle}deg`,
    "--grid-cell-size": `${cellSize}px`,
    "--grid-opacity": opacity,
    "--grid-light-line-color": lightLineColor,
    "--grid-dark-line-color": darkLineColor,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "[mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]",
        className,
      )}
      style={gridStyle}
    >
      <div
        className={cn(
          "absolute inset-0 [transform:skewY(var(--grid-angle))]",
          "[background-image:linear-gradient(to_right,var(--grid-light-line-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-light-line-color)_1px,transparent_1px)]",
          "[background-size:var(--grid-cell-size)_var(--grid-cell-size)]",
          "dark:[background-image:linear-gradient(to_right,var(--grid-dark-line-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-dark-line-color)_1px,transparent_1px)]",
          "animate-grid",
        )}
        style={{
          opacity: "var(--grid-opacity)",
        }}
      />
    </div>
  );
};
