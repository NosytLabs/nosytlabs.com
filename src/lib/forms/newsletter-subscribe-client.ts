import { isValidEmail } from '@/lib/core/validation';
import { submitNewsletterSubscription } from '@/lib/forms/form-service.ts';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletter-form') as HTMLFormElement | null;
  if (!form) return;

  const emailInput = form.querySelector("input[type='email']") as HTMLInputElement;
  const submitButton = form.querySelector('button') as HTMLButtonElement;
  const statusMessage = document.createElement('p');
  statusMessage.className = 'mt-2 text-sm';
  statusMessage.setAttribute('role', 'status');
  statusMessage.setAttribute('aria-live', 'polite');
  statusMessage.setAttribute('aria-atomic', 'true');
  form.parentElement?.appendChild(statusMessage);

  const showError = (message: string) => {
    statusMessage.textContent = message;
    statusMessage.className = 'mt-2 text-sm text-destructive';
  };

  const clearError = () => {
    statusMessage.textContent = '';
    statusMessage.className = 'mt-2 text-sm';
  };

  const validateEmail = () => {
    const emailValue = emailInput.value.trim();

    if (!emailValue) {
      showError('Please enter your email address');
      return false;
    }

    const isValid = isValidEmail(emailValue);

    if (!isValid) {
      showError('Please enter a valid email address');
      return false;
    }

    clearError();
    return true;
  };

  const showStatus = (message: string, type: 'success' | 'error') => {
    statusMessage.textContent = message;
    statusMessage.className = `mt-2 text-sm ${type === 'success' ? 'text-success' : 'text-destructive'}`;
    statusMessage.setAttribute('role', 'status');
    statusMessage.setAttribute('aria-live', 'polite');
    setTimeout(() => {
      statusMessage.textContent = '';
    }, 2000); // Display for 2 seconds as per requirements
  };

  const setLoading = (isLoading: boolean) => {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Subscribing...' : 'Subscribe';
  };

  emailInput.addEventListener('input', validateEmail);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateEmail()) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await submitNewsletterSubscription(emailInput.value);

      if (result.success) {
        showStatus(result.message, 'success');
        form.reset();
      } else {
        showStatus(result.message, 'error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      showStatus('Network error. Please try again or contact us directly.', 'error');
    }

    setLoading(false);
  });
});
