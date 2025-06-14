import React from "react";
import { ShinyButton } from "@/components/ui/shiny-button";
import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import { AuroraText } from "@/components/ui/aurora-text";
import { TweetCard } from "@/components/ui/tweet-card";
import { MagicCard } from "@/components/ui/magic-card";
import { Meteors } from "@/components/ui/meteors";
import BlurFade from "@/components/ui/blur-fade";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

export function EnhancedContactSection() {
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  return (
    <section className="relative py-24 bg-gradient-to-br from-purple-50 to-slate-100 dark:from-purple-950 dark:to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <Meteors number={15} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <AuroraText className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              Let's Build Something Amazing
            </AuroraText>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ready to transform your ideas into reality? Get in touch with our team and let's discuss your next project.
            </p>
          </div>
        </BlurFade>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <BlurFade delay={0.2}>
            <MagicCard className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Start Your Project
              </h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:border-purple-700 dark:bg-purple-950/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:border-purple-700 dark:bg-purple-950/50"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Type
                  </label>
                  <select className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:border-purple-700 dark:bg-purple-950/50">
                    <option>Web Development</option>
                    <option>AI Integration</option>
                    <option>Mobile App</option>
                    <option>Consulting</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:border-purple-700 dark:bg-purple-950/50"
                    placeholder="Tell us about your project..."
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <ShinyButton className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </ShinyButton>
                  
                  <AnimatedSubscribeButton
                    subscribeStatus={isSubscribed}
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className="flex-1"
                  >
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Subscribe to Updates
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Subscribed!
                    </span>
                  </AnimatedSubscribeButton>
                </div>
              </form>
            </MagicCard>
          </BlurFade>

          {/* Contact Info & Social Proof */}
          <div className="space-y-8">
            {/* Contact Info */}
            <BlurFade delay={0.3}>
              <MagicCard className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Get in Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-600 dark:text-gray-300">hello@nosytlabs.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-600 dark:text-gray-300">Available for consultation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-600 dark:text-gray-300">New Mexico, USA</span>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>

            {/* Tweet Card */}
            <BlurFade delay={0.4}>
              <TweetCard
                content="🚀 Just launched our new AI-enhanced development services! 50% faster delivery with cutting-edge technology. Ready to transform your business? Let's build something amazing together! #AI #WebDev #Innovation"
                timestamp="2h"
                verified={true}
                tweetUrl="https://twitter.com/NOSYTLABS"
              />
            </BlurFade>

            {/* Quick Stats */}
            <BlurFade delay={0.5}>
              <MagicCard className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Choose NosytLabs?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">50%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Faster Development</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">100%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">AI Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">1-3</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Week Delivery</div>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
