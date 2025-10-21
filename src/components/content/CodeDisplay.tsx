import CopyButton from "@/components/ui/CopyButton";
import type { BaseComponentProps } from "@/types";

interface CodeDisplayProps extends BaseComponentProps {
  code: string;
  language?: string;
  title?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export default function CodeDisplay({
  code,
  language = "javascript",
  title,
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className = "",
}: CodeDisplayProps) {
  const lines = code.split("\n");
  const displayTitle = title || filename;

  return (
    <div className={`card-base rounded-lg group overflow-hidden ${className}`}>
      {/* Header */}
      {(displayTitle || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <div className="flex items-center gap-2">
            {displayTitle && (
              <span className="text-sm font-medium text-foreground">
                {displayTitle}
              </span>
            )}
            {language && (
              <span className="badge-accent text-xs">{language}</span>
            )}
          </div>

          <CopyButton
            text={code}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 button-icon"
          />
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="block">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightLines.includes(lineNumber);

              return (
                <div
                  key={index}
                  className={`flex ${isHighlighted ? "bg-primary/10 -mx-4 px-4" : ""}`}
                >
                  {showLineNumbers && (
                    <span className="select-none text-muted-foreground mr-4 text-right w-8 flex-shrink-0">
                      {lineNumber}
                    </span>
                  )}
                  <span className="flex-1">{line || " "}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
