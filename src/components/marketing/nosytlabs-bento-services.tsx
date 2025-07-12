"use client";

import * as React from "react";
import { BentoCard, BentoGrid } from "./bento-grid";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { services } from "@/config/services";

// Background gradient mapping - Updated with vibrant brand colors
const backgroundMap: Record<string, React.ReactNode> = {
  "gradient-blue-purple": (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-500/20 via-brand-ethereal-500/20 to-brand-purple-500/20 opacity-60 pointer-events-none" />
  ),
  "gradient-orange-red": (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange-500/20 via-brand-red-500/20 to-brand-red-600/20 opacity-60 pointer-events-none" />
  ),
  "gradient-green-teal": (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-green-500/20 via-brand-ethereal-500/20 to-brand-blue-500/20 opacity-60 pointer-events-none" />
  ),
  "gradient-yellow-orange": (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange-400/20 via-brand-orange-500/20 to-brand-red-500/20 opacity-60 pointer-events-none" />
  ),
  "gradient-purple-pink": (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/20 via-brand-red-400/20 to-brand-red-500/20 opacity-60 pointer-events-none" />
  ),
  "gradient-gray-slate": (
    <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/20 via-neutral-600/20 to-neutral-700/20 opacity-60 pointer-events-none" />
  )
};


export function NosytLabsBentoServices() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-left mb-16 max-w-full mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-brand-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Icon name="zap" size={16} />
            Our Services
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Professional Development Solutions
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            From AI-enhanced web development to mobile apps, consulting, and 3D printing - we offer comprehensive digital solutions to help your business thrive.
          </p>
        </div>

        {/* Bento Grid with Staggered Animation */}
        <div className="animate-fade-in-delay-1" data-stagger data-stagger-delay="150">
          <BentoGrid className="auto-rows-[24rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((service) => {
              const iconName = service.icon;
              const backgroundElement = backgroundMap[service.background];
              
              const handleClick = () => {
                console.log('Service card clicked:', service.name, 'href:', service.href);
                window.location.href = service.href;
              };

              return (
                <BentoCard
                  key={service.name}
                  name={service.name}
                  className={`${service.className} stagger-item`}
                  background={
                    <>
                      {backgroundElement}
                      {service.popular && (
                          <div className="absolute top-4 right-4 z-10 pointer-events-none">
                            <div className="inline-flex items-center gap-1 bg-brand-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold pointer-events-none">
                               <Icon name="star" size={12} />
                               Most Popular
                             </div>
                           </div>
                       )}
                     </>
                   }
                   iconName={iconName}
                   description={service.description}
                   cta={service.cta}
                   price={service.price}
                   timeline={service.timeline}
                   features={service.features}
                   onClick={handleClick}
                 />
               );
             })}
           </BentoGrid>
         </div>
 
         {/* Enhanced Footer CTA with vibrant styling */}
         <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-fade-in-delay-2 nosyt-card-hover border border-brand-blue-100 dark:border-brand-blue-800 hover:border-brand-blue-300 dark:hover:border-brand-blue-600 group">
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300 group-hover:text-brand-blue-600 dark:group-hover:text-brand-blue-400">
               Need something custom?
             </h3>
             <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-200">
               We'd love to discuss your specific requirements and create a tailored solution for your business.
             </p>
             <a href="/contact" className="inline-block no-underline">
               <Button
                 variant="gradient"
                 className="nosyt-hover-lift-strong group/button"
               >
                 <span className="flex items-center gap-2">
                   Contact Us
                   <Icon name="arrowRight" size={16} className="transition-transform duration-300 group-hover/button:translate-x-1" />
                 </span>
               </Button>
             </a>
         </div>
       </div>
     </section>
   );
 }
