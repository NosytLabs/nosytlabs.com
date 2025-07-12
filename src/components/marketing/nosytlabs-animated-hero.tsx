import React from "react";
import { BackgroundGradientAnimation } from "@/components/marketing/background-gradient-animation";
import { AuroraText } from "@/components/marketing/aurora-text";
import { AnimatedShinyText } from "@/components/marketing/animated-shiny-text";

export function NosytLabsAnimatedHero() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(45, 27, 105)" // Official NosytLabs Dark Purple
      gradientBackgroundEnd="rgb(124, 58, 237)" // Official NosytLabs Purple
      firstColor="124, 58, 237" // Official Purple
      secondColor="168, 85, 247" // Official Light Purple
      thirdColor="255, 107, 53" // Official Orange
      fourthColor="255, 140, 66" // Official Light Orange
      fifthColor="45, 27, 105" // Official Dark Purple
      pointerColor="255, 107, 53" // Official Orange for interaction
      containerClassName="min-h-screen"
    >
      <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-300/30 rounded-full px-4 py-2 text-sm font-medium">
          <span className="text-2xl">🤖</span>
          <span>AI-Enhanced Development</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-center mb-6">
          <span className="block text-xl md:text-2xl lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-nosyt-orange-light to-nosyt-orange mb-4">
            Notable Opportunities Shape Your Tomorrow
          </span>
          <AuroraText className="text-4xl md:text-6xl lg:text-8xl font-black drop-shadow-2xl">
            NosytLabs
          </AuroraText>
        </h1>

        {/* Description */}
        <p className="text-center text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto mb-12 bg-clip-text text-transparent bg-gradient-to-b from-white/80 to-white/60 leading-relaxed">
          Transform your business with innovative digital solutions. Expert web development, AI integration, and cutting-edge technology services.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
          <a
            href="/services"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-nosyt-orange to-nosyt-orange-light rounded-full hover:from-nosyt-orange-dark hover:to-nosyt-orange transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10">Start Your Project</span>
            <div className="absolute inset-0 bg-gradient-to-r from-nosyt-orange-light to-nosyt-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          
          <a
            href="/projects"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10">View Our Work</span>
          </a>
        </div>

        {/* Stats */}
        <ul className="flex flex-wrap justify-center gap-8 mt-16 text-center" role="list">
          <li>
            <div className="flex flex-col items-center">
              <AnimatedShinyText className="text-3xl md:text-4xl font-bold">
                50%
              </AnimatedShinyText>
              <div className="text-sm md:text-base text-white/70 mt-1">
                Faster Development
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col items-center">
              <AnimatedShinyText className="text-3xl md:text-4xl font-bold">
                100%
              </AnimatedShinyText>
              <div className="text-sm md:text-base text-white/70 mt-1">
                Client Satisfaction
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col items-center">
              <AnimatedShinyText className="text-3xl md:text-4xl font-bold">
                24/7
              </AnimatedShinyText>
              <div className="text-sm md:text-base text-white/70 mt-1">
                AI Support
              </div>
            </div>
          </li>
        </ul>
      </div>
    </BackgroundGradientAnimation>
  );
}
