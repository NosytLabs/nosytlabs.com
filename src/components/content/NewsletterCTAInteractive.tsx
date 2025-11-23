import React, { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/newsletter-service';

export function NewsletterCTAInteractive() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const result = await subscribeToNewsletter(email);
    
    setIsLoading(false);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });

    if (result.success) {
      setEmail('');
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 rounded-2xl py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-6">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">
          Stay Updated with Web Development & AI Trends
        </h3>
        <p className="text-muted-foreground text-center mb-8 leading-relaxed">
          Get weekly insights on modern web development, AI integration strategies, and latest tools. 
          Join 1000+ developers building smarter applications.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !email}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <p className={`text-center mt-4 text-sm font-medium ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {message.text}
          </p>
        )}

        <p className="text-xs text-muted-foreground text-center mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
