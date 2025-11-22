import React from "react";

interface ReactIconProps {
  name: string;
  className?: string;
}

const ReactIcon: React.FC<ReactIconProps> = ({ name, className = "" }) => {
  const iconPaths = {
    code: (
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    ),
    brain: (
      <>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </>
    ),
    star: (
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    ),
  };

  const iconPath =
    iconPaths[name as keyof typeof iconPaths] || iconPaths["star"];

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {iconPath}
    </svg>
  );
};

export default ReactIcon;

export { ReactIcon };
