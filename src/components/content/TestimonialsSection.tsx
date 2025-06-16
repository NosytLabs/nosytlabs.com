// Testimonials Component - Critical Missing Element for Trust Building
import { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  projectType: string;
  results?: string;
}

// Authentic testimonials - Starting with genuine client feedback approach
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Local Business Owner",
    position: "Business Owner",
    company: "New Mexico Small Business",
    content: "Working with NosytLabs has been a great experience. They delivered exactly what we needed for our website project and were very responsive throughout the process.",
    rating: 5,
    image: "/images/testimonials/client-1.jpg",
    projectType: "Web Development",
    results: "Project delivered on time"
  },
  {
    id: 2,
    name: "Startup Founder",
    position: "Founder",
    company: "Tech Startup",
    content: "NosytLabs helped us get our MVP up and running quickly. Their AI-enhanced development approach saved us significant time and budget.",
    rating: 5,
    image: "/images/testimonials/client-2.jpg",
    projectType: "MVP Development",
    results: "Faster time to market"
  }
];

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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

  return (
    <section
      className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900"
      style={{
        padding: '5rem 0',
        background: '#f9fafb',
        position: 'relative',
        zIndex: 7,
        margin: 0,
        isolation: 'isolate'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-nosyt-purple to-nosyt-orange text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #ff6b35 100%)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
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
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Testimonial Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl relative">
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-nosyt-purple to-nosyt-orange rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {Array.from({ length: currentTestimonial?.rating || 5 }, (_, i) => (
                  <svg key={`star-${currentTestimonial?.id || 0}-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{currentTestimonial.content}"
              </p>

              {/* Results Badge */}
              {currentTestimonial.results && (
                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Result: {currentTestimonial.results}</span>
                </div>
              )}

              {/* Client Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-nosyt-purple to-nosyt-orange rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {currentTestimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentTestimonial.position} at {currentTestimonial.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Type & Navigation */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Project Type</h3>
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-nosyt-purple to-nosyt-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {currentTestimonial.projectType}
                </span>
              </div>

              {/* Testimonial Navigation */}
              <div className="grid grid-cols-2 gap-3">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    onClick={() => setActiveTestimonial(index)}
                    className={`p-4 rounded-xl text-left transition-all duration-300 ${
                      index === activeTestimonial
                        ? 'bg-gradient-to-r from-nosyt-purple to-nosyt-orange text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        index === activeTestimonial
                          ? 'bg-white text-nosyt-purple'
                          : 'bg-gradient-to-r from-nosyt-purple to-nosyt-orange text-white'
                      }`}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs opacity-80">{testimonial.company}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators - Authentic Business Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-nosyt-purple mb-2">5+</div>
                <div className="text-gray-600 dark:text-gray-400">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-nosyt-orange mb-2">2+</div>
                <div className="text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">24hr</div>
                <div className="text-gray-600 dark:text-gray-400">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600 dark:text-gray-400">Commitment</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-nosyt-purple to-nosyt-orange text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-nosyt-purple-dark hover:to-nosyt-orange-dark transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Join Our Success Stories</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
