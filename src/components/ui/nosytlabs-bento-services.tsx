import React from "react";
import { BentoCard, BentoGrid } from "./bento-grid.tsx";
import { ShimmerButton } from "./consolidated-button.tsx";
import { 
  Globe, 
  Zap, 
  Bot, 
  Lightbulb, 
  Smartphone, 
  Settings,
  ArrowRight,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";

const services = [
  {
    name: "AI-Enhanced Web Development",
    description: "Lightning-fast websites built with AI assistance - 50% faster delivery than traditional development.",
    href: "/services/web-development",
    cta: "Start Project",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-60" />
    ),
    Icon: Globe,
    features: ["AI-Accelerated Development", "Mobile-First Design", "Lightning-Fast Performance"],
    price: "From $1,200",
    timeline: "1-3 weeks",
    popular: true
  },
  {
    name: "Rapid MVP Development",
    description: "AI-powered prototypes and MVPs in days, not months. Perfect for startups and quick validation.",
    href: "/services/mvp",
    cta: "Build MVP",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 opacity-60" />
    ),
    Icon: Zap,
    features: ["3-5 Day Delivery", "User Testing Ready"],
    price: "From $800",
    timeline: "3-7 days"
  },
  {
    name: "AI Integration & Automation",
    description: "Smart automation and AI chatbots that work 24/7 to improve efficiency and customer service.",
    href: "/services/ai-integration",
    cta: "Automate Now",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-teal-500/20 to-blue-500/20 opacity-60" />
    ),
    Icon: Bot,
    features: ["24/7 AI Support", "Workflow Automation"],
    price: "From $2,200",
    timeline: "2-4 weeks"
  },
  {
    name: "Tech Consulting & SEO Audits",
    description: "Professional audits and strategic guidance at competitive freelancer rates with quick turnaround.",
    href: "/services/consulting",
    cta: "Get Audit",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 opacity-60" />
    ),
    Icon: Lightbulb,
    features: ["SEO Audits", "Performance Analysis", "Tech Recommendations"],
    price: "From $300",
    timeline: "3-5 days"
  },
  {
    name: "Mobile App Development",
    description: "Cross-platform mobile apps with AI-accelerated development for iOS and Android.",
    href: "/services/mobile-apps",
    cta: "Build App",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20 opacity-60" />
    ),
    Icon: Smartphone,
    features: ["Cross-Platform", "Native Performance", "App Store Ready"],
    price: "From $2,800",
    timeline: "3-6 weeks"
  },
  {
    name: "3D Printing Services",
    description: "Professional prototyping and custom parts at competitive rates with fast turnaround.",
    href: "/services/3d-printing",
    cta: "Print Now",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 via-slate-500/20 to-zinc-500/20 opacity-60" />
    ),
    Icon: Settings,
    features: ["24-48hr Turnaround", "Multiple Materials"],
    price: "From $15",
    timeline: "1-3 days"
  }
];

export function NosytLabsBentoServices() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              Our Services
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Professional Development Solutions
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              From AI-enhanced web development to mobile apps, consulting, and 3D printing - we offer comprehensive digital solutions to help your business thrive.
            </p>
        </div>

        {/* Bento Grid */}
        <div className="animate-fade-in-delay-1">
          <BentoGrid className="auto-rows-[20rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((service) => (
              <BentoCard
                key={service.name}
                name={service.name}
                className={service.className}
                background={
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    {service.background}
                    
                    {/* Popular Badge */}
                    {service.popular && (
                      <div className="flex justify-end">
                        <div className="inline-flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          <Star className="w-3 h-3" />
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {service.price}
                        </div>
                        <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold">
                          <Clock className="w-4 h-4" />
                          {service.timeline}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                }
                Icon={service.Icon}
                description={service.description}
                href={service.href}
                cta={service.cta}
              />
            ))}
          </BentoGrid>
        </div>

        {/* Footer CTA */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-fade-in-delay-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Need something custom?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              We'd love to discuss your specific requirements and create a tailored solution for your business.
            </p>
            <ShimmerButton
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              onClick={() => window.location.href = '/contact'}
            >
              <span className="flex items-center gap-2">
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </span>
            </ShimmerButton>
        </div>
      </div>
    </section>
  );
}
