import { useCallback } from 'react';

interface ReCAPTCHAProps {
  onVerify: (token: string | null) => void;
  siteKey?: string;
}

export function ReCAPTCHA({ onVerify }: ReCAPTCHAProps) {
  const handleVerify = useCallback(() => {
    // Placeholder implementation - in a real app, this would integrate with Google reCAPTCHA
    // For now, we'll simulate a successful verification
    const mockToken = 'mock-recaptcha-token-' + Date.now();
    onVerify(mockToken);
  }, [onVerify]);

  const handleReset = useCallback(() => {
    onVerify(null);
  }, [onVerify]);

  return (
    <div className="recaptcha-container">
      <div className="recaptcha-placeholder" style={{
        border: '1px solid var(--color-neutral-300)',
        padding: '16px',
        borderRadius: 'var(--border-radius-base)',
        backgroundColor: 'var(--color-neutral-50)',
        textAlign: 'center',
        margin: '8px 0'
      }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--color-neutral-600)' }}>
          reCAPTCHA Placeholder (Development)
        </p>
        <button
          type="button"
          onClick={handleVerify}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            backgroundColor: 'var(--color-success-500)',
            color: 'var(--color-neutral-0)',
            border: 'none',
            borderRadius: 'var(--border-radius-base)',
            cursor: 'pointer'
          }}
        >
          Verify
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--color-error-500)',
            color: 'var(--color-neutral-0)',
            border: 'none',
            borderRadius: 'var(--border-radius-base)',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default ReCAPTCHA;