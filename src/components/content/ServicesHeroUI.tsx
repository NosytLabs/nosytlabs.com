import { HeroUIServiceCard } from "../ui/HeroUIServiceCard";
import { HeroUIButton } from "../ui/HeroUIButton";

interface Service {
  slug: string;
  data: {
    title: string;
    description: string;
    features?: string[];
    price?: string;
    icon?: string;
  };
}

interface ServicesHeroUIProps {
  services: Service[];
}

/**
 * Services section using HeroUI components
 * Replaces the custom Services.astro with HeroUI-based implementation
 */
export function ServicesHeroUI({ services }: ServicesHeroUIProps) {
  // Show all services, sorted by priority
  const coreServices = services
    .sort((a, b) => {
      // Sort by priority order
      const priority: Record<string, number> = {
        'professional-web-development': 1,
        'ai-integration-automation': 2,
        'mobile-app-development': 3,
        'rapid-prototype-development': 4,
        'tech-consulting-seo-audits': 5,
        '3d-printing-services': 6
      };
      return (priority[a.slug] || 99) - (priority[b.slug] || 99);
    });

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-2">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          What We Offer
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Our Core <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Services</span>
        </h2>
        
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
          We specialize in web development, AI integration, mobile apps, and rapid prototyping. 
          Each service is designed to deliver measurable results for your business.
        </p>
      </div>

      {/* Enhanced Services Grid - Professional layout */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
        {coreServices.map((service, index) => (
          <div
            key={service.slug}
            className="h-full animate-fade-in w-full"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <HeroUIServiceCard
              title={service.data.title}
              description={service.data.description}
              features={service.data.features || []}
              price={service.data.price}
              icon={service.data.icon}
              href={`/services/${service.slug}`}
            />
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center pt-6 md:pt-8">
        <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
          <HeroUIButton
            href="/services"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-2 hover:bg-muted/50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            View All Services
          </HeroUIButton>
          <HeroUIButton
            href="/contact"
            variant="gradient"
            size="lg"
            className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get a Quote
          </HeroUIButton>
        </div>
        
        <p className="mt-6 text-sm text-muted-foreground">
          Not sure which service is right for you? <a href="/contact" className="text-primary hover:underline font-medium">Contact us</a> for a free consultation.
        </p>
      </div>
    </div>
  );
}

export default ServicesHeroUI;
