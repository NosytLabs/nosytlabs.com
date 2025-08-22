import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

interface ToasterProps {
  theme?: 'light' | 'dark' | 'system';
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  expand?: boolean;
  richColors?: boolean;
  closeButton?: boolean;
}

export const Toaster: React.FC<ToasterProps> = ({
  theme = 'system',
  position = 'top-right',
  expand = false,
  richColors = true,
  closeButton = true
}) => {
  return (
    <SonnerToaster
      theme={theme}
      position={position}
      expand={expand}
      richColors={richColors}
      closeButton={closeButton}
      toastOptions={{
        style: {
          background: 'var(--color-background)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
        },
        className: 'toaster-toast',
        descriptionClassName: 'toaster-description',
      }}
    />
  );
};

export default Toaster;