// Testimonials Component - Critical Missing Element for Trust Building
import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/icon';
import { getFeaturedTestimonials } from '@/config/conversion-config';
import type { ConversionTestimonial } from '@/config/conversion-config';

export default function TestimonialsSection() {
  console.log('🔴 CRITICAL DEBUG: TestimonialsSection function CALLED - Component is executing!');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Move testimonials initialization inside the component
  let testimonials: ConversionTestimonial[] = [];
  
  try {
    testimonials = getFeaturedTestimonials();
    console.log('DEBUG: TestimonialsSection - Successfully loaded testimonials:', testimonials?.length || 0);
    console.log('DEBUG: TestimonialsSection - First testimonial:', testimonials?.[0]?.author || 'No testimonials');
  } catch (error) {
    console.error('DEBUG: TestimonialsSection - Error loading testimonials:', error);
    testimonials = [];
  }

  useEffect(() => {
    // Add onerror to testimonial images
    // This is a temporary fix to ensure images load correctly.
    // In a real scenario, these images should be properly managed and optimized.
    // This script will be removed after the audit.
    const testimonialImages = document.querySelectorAll('.testimonial-image');
    testimonialImages.forEach(img => {
      const imageElement = img as HTMLImageElement;
      imageElement.onerror = () => {
        imageElement.src = '/images/fallback-image.svg';
        imageElement.onerror = null;
      };
    });
  }, []);

  // Safety checks
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Client Testimonials
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Loading testimonials...
          </p>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[activeTestimonial] || testimonials[0];
  if (!currentTestimonial) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Client Testimonials
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            No testimonials available.
          </p>
        </div>
      </section>
    );
  }

  // DEBUG: Log current testimonial data
  console.log('DEBUG: TestimonialsSection - Current testimonial:', currentTestimonial?.author || 'No current testimonial');

  return (
    <section className="section-standard bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16" data-scroll-animate data-animation-type="fade-in-up">
          <div className="inline-flex items-center gap-2 gradient-primary text-inverse px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Icon name="checkCircle" size={16} />
            <span>Client Success Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            What Our Clients Say
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how we've helped businesses achieve remarkable results with our AI-enhanced development services.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12" data-stagger data-stagger-delay="200">
            {/* Testimonial Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl relative nosyt-card-hover stagger-item">
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                <Icon name="messageCircle" size={16} className="text-white" />
              </div>              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {Array.from({ length: currentTestimonial?.rating || 5 }, (_, i) => (
                  <Icon key={`star-${currentTestimonial?.id || 0}-${i}`} name="star" size={20} className="text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{currentTestimonial.quote}"
              </p>

              {/* Results Badge */}
              {currentTestimonial.results && currentTestimonial.results.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentTestimonial.results.map((result, index) => (
                    <div key={index} className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                      <Icon name="checkCircle" size={16} />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Client Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-inverse font-bold text-lg mr-4">
                  {currentTestimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {currentTestimonial.author}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Type & Navigation */}
            <div className="stagger-item">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6 nosyt-card-hover">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Service Type</h3>
                <span className="inline-flex items-center gap-2 gradient-primary text-inverse px-3 py-1 rounded-full text-sm font-semibold">
                  {currentTestimonial.serviceType}
                </span>
              </div>

              {/* Testimonial Navigation */}
              <ul className="grid grid-cols-2 gap-3" role="list">
                {testimonials.map((testimonial, index) => (
                  <li key={testimonial.id}>
                    <button
                      onClick={() => setActiveTestimonial(index)}
                      className={`p-4 rounded-xl text-left transition-all duration-300 nosyt-button-hover ${
                        index === activeTestimonial
                          ? 'gradient-primary text-inverse'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className={`w-8 h-8 rounded-full object-cover mr-3 testimonial-image ${
                            index === activeTestimonial ? 'border-2 border-white' : ''
                          }`}
                          onError={(e) => {
                            e.currentTarget.src = '/images/fallback-image.svg';
                            e.currentTarget.onerror = null;
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm">{testimonial.author}</p>
                          <p className="text-xs opacity-80">{testimonial.company}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust Indicators - Professional Credentials */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg nosyt-card-hover" data-scroll-animate data-animation-type="fade-in-up">
            <ul className="grid md:grid-cols-3 gap-8 text-center" role="list" data-stagger data-stagger-delay="150">
              <li className="stagger-item">
                <div className="text-3xl font-bold text-brand-blue-500 mb-2">100%</div>
                <div className="text-gray-600 dark:text-gray-400">Project Success Rate</div>
              </li>
              <li className="stagger-item">
                <div className="text-3xl font-bold text-brand-green-500 mb-2">24/7</div>
                <div className="text-gray-600 dark:text-gray-400">Support Available</div>
              </li>
              <li className="stagger-item">
                <div className="text-3xl font-bold text-brand-blue-500 mb-2">5⭐</div>
                <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12" data-scroll-animate data-animation-type="fade-in-up">
          <a
            href="/contact"
            className="nosyt-btn-primary nosyt-button-hover inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
          >
            <span>Join Our Success Stories</span>
            <Icon name="arrowRight" size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
