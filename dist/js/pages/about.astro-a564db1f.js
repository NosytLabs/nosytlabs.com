import { a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from "../vendor-027e926a.js";
import { $ as $$BaseLayout } from "../../renderers.mjs";
import { $ as $$AnimatedSection, a as $$ResponsiveImage } from "../../pages/passive-income/guide.astro.mjs";
/* empty css                 */const $$About = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "About NosytLabs - Notable Opportunities Shape Your Tomorrow";
  const pageDescription = "Learn about NosytLabs, our mission, values, and the story behind our innovative digital solutions and services.";
  const teamMembers = [
    {
      name: "Tycen",
      role: "Founder & Lead Developer",
      bio: "Passionate about creating innovative digital solutions and exploring the latest in AI technology. Former content creator turned full-stack developer with expertise in modern web technologies.",
      image: "/images/authors/tycen.webp",
      skills: ["Full-Stack Development", "AI Integration", "Content Creation", "3D Printing"],
      social: {
        youtube: "https://youtube.com/@TycenYT",
        kick: "https://kick.com/Tycen",
        github: "https://github.com/NosytLabs"
      }
    }
  ];
  const milestones = [
    {
      year: "2025",
      title: "NosytLabs Founded",
      description: "Established NosytLabs with the mission to provide innovative digital solutions and explore emerging technologies."
    },
    {
      year: "2024",
      title: "AI Tools Expertise",
      description: "Developed expertise in AI-powered development tools including Cursor AI, Trae AI, and Roo Code Windsurf."
    },
    {
      year: "2023",
      title: "Content Creation",
      description: "Built a strong presence in content creation with YouTube channel @TycenYT and live streaming on Kick.com."
    },
    {
      year: "2022",
      title: "3D Printing Services",
      description: "Launched professional 3D printing services with focus on quality and custom solutions."
    }
  ];
  const values = [
    {
      title: "Innovation",
      description: "We embrace cutting-edge technologies and continuously explore new possibilities in digital solutions.",
      icon: "🚀"
    },
    {
      title: "Quality",
      description: "Every project receives our full attention to detail, ensuring exceptional results and client satisfaction.",
      icon: "⭐"
    },
    {
      title: "Transparency",
      description: "We believe in honest communication and authentic content, building trust through genuine experiences.",
      icon: "🔍"
    },
    {
      title: "Growth",
      description: "We're committed to continuous learning and helping our clients achieve their goals and expand their reach.",
      icon: "📈"
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-kh7btl4r": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="bg-gradient-to-br from-primary-dark to-primary-main text-white py-20" data-astro-cid-kh7btl4r> <div class="container mx-auto px-4" data-astro-cid-kh7btl4r> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-kh7btl4r": true }, { "default": ($$result3) => renderTemplate` <div class="text-center" data-astro-cid-kh7btl4r> <h1 class="text-4xl md:text-5xl font-bold mb-6" data-astro-cid-kh7btl4r>
About NosytLabs
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto" data-astro-cid-kh7btl4r>
Notable Opportunities Shape Your Tomorrow - We're passionate about creating 
            innovative digital solutions that help businesses and individuals thrive in 
            the digital age.
</p> </div> ` })} </div> </section>  <section class="py-20" data-astro-cid-kh7btl4r> <div class="container mx-auto px-4" data-astro-cid-kh7btl4r> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-kh7btl4r": true }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto text-center" data-astro-cid-kh7btl4r> <h2 class="text-3xl font-bold mb-8" data-astro-cid-kh7btl4r>Our Mission</h2> <p class="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed" data-astro-cid-kh7btl4r>
At NosytLabs, we believe that technology should empower creativity and innovation. 
            Our mission is to provide cutting-edge digital solutions that help our clients 
            achieve their goals while exploring the endless possibilities of emerging technologies 
            like AI, 3D printing, and modern web development.
</p> <div class="bg-primary-light dark:bg-primary-dark p-8 rounded-lg" data-astro-cid-kh7btl4r> <h3 class="text-2xl font-bold mb-4 text-primary-dark dark:text-primary-light" data-astro-cid-kh7btl4r>
"Notable Opportunities Shape Your Tomorrow"
</h3> <p class="text-gray-700 dark:text-gray-300" data-astro-cid-kh7btl4r>
This isn't just our tagline - it's our philosophy. Every project is an opportunity 
              to create something remarkable that will positively impact the future.
</p> </div> </div> ` })} </div> </section>  <section class="py-20 bg-gray-50 dark:bg-gray-900" data-astro-cid-kh7btl4r> <div class="container mx-auto px-4" data-astro-cid-kh7btl4r> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-kh7btl4r": true }, { "default": ($$result3) => renderTemplate` <div class="text-center mb-16" data-astro-cid-kh7btl4r> <h2 class="text-3xl font-bold mb-4" data-astro-cid-kh7btl4r>Our Core Values</h2> <p class="text-lg text-gray-600 dark:text-gray-300" data-astro-cid-kh7btl4r>
The principles that guide everything we do
</p> </div> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-astro-cid-kh7btl4r> ${values.map((value) => renderTemplate`<div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-shadow" data-astro-cid-kh7btl4r> <div class="text-4xl mb-4" data-astro-cid-kh7btl4r>${value.icon}</div> <h3 class="text-xl font-bold mb-3" data-astro-cid-kh7btl4r>${value.title}</h3> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-kh7btl4r>${value.description}</p> </div>`)} </div> ` })} </div> </section>  <section class="py-20" data-astro-cid-kh7btl4r> <div class="container mx-auto px-4" data-astro-cid-kh7btl4r> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-kh7btl4r": true }, { "default": ($$result3) => renderTemplate` <div class="text-center mb-16" data-astro-cid-kh7btl4r> <h2 class="text-3xl font-bold mb-4" data-astro-cid-kh7btl4r>Meet the Team</h2> <p class="text-lg text-gray-600 dark:text-gray-300" data-astro-cid-kh7btl4r>
The passionate individuals behind NosytLabs
</p> </div> <div class="max-w-4xl mx-auto" data-astro-cid-kh7btl4r> ${teamMembers.map((member) => renderTemplate`<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" data-astro-cid-kh7btl4r> <div class="md:flex" data-astro-cid-kh7btl4r> <div class="md:w-1/3" data-astro-cid-kh7btl4r> ${renderComponent($$result3, "ResponsiveImage", $$ResponsiveImage, { "src": member.image, "alt": member.name, "width": 400, "height": 400, "class": "w-full h-64 md:h-full object-cover", "data-astro-cid-kh7btl4r": true })} </div> <div class="md:w-2/3 p-8" data-astro-cid-kh7btl4r> <h3 class="text-2xl font-bold mb-2" data-astro-cid-kh7btl4r>${member.name}</h3> <p class="text-primary-main font-semibold mb-4" data-astro-cid-kh7btl4r>${member.role}</p> <p class="text-gray-700 dark:text-gray-300 mb-6" data-astro-cid-kh7btl4r>${member.bio}</p> <div class="mb-6" data-astro-cid-kh7btl4r> <h4 class="font-semibold mb-2" data-astro-cid-kh7btl4r>Expertise:</h4> <div class="flex flex-wrap gap-2" data-astro-cid-kh7btl4r> ${member.skills.map((skill) => renderTemplate`<span class="bg-primary-light text-primary-dark px-3 py-1 rounded-full text-sm" data-astro-cid-kh7btl4r> ${skill} </span>`)} </div> </div> <div class="flex gap-4" data-astro-cid-kh7btl4r> <a${addAttribute(member.social.youtube, "href")} target="_blank" rel="noopener noreferrer" class="text-red-600 hover:text-red-700 transition-colors" data-astro-cid-kh7btl4r> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-kh7btl4r> <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" data-astro-cid-kh7btl4r></path> </svg> </a> <a${addAttribute(member.social.kick, "href")} target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-700 transition-colors" data-astro-cid-kh7btl4r> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-kh7btl4r> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" data-astro-cid-kh7btl4r></path> </svg> </a> <a${addAttribute(member.social.github, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-800 dark:text-gray-200 hover:text-gray-600 transition-colors" data-astro-cid-kh7btl4r> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-kh7btl4r> <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" data-astro-cid-kh7btl4r></path> </svg> </a> </div> </div> </div> </div>`)} </div> ` })} </div> </section>  <section class="py-20 bg-gray-50 dark:bg-gray-900" data-astro-cid-kh7btl4r> <div class="container mx-auto px-4" data-astro-cid-kh7btl4r> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-kh7btl4r": true }, { "default": ($$result3) => renderTemplate` <div class="text-center mb-16" data-astro-cid-kh7btl4r> <h2 class="text-3xl font-bold mb-4" data-astro-cid-kh7btl4r>Our Journey</h2> <p class="text-lg text-gray-600 dark:text-gray-300" data-astro-cid-kh7btl4r>
Key milestones in the NosytLabs story
</p> </div> <div class="max-w-4xl mx-auto" data-astro-cid-kh7btl4r> <div class="relative" data-astro-cid-kh7btl4r> <!-- Timeline line --> <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-main" data-astro-cid-kh7btl4r></div> ${milestones.map((milestone, index) => renderTemplate`<div class="relative flex items-start mb-12" data-astro-cid-kh7btl4r> <div class="flex-shrink-0 w-16 h-16 bg-primary-main rounded-full flex items-center justify-center text-white font-bold z-10" data-astro-cid-kh7btl4r> ${milestone.year} </div> <div class="ml-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg flex-1" data-astro-cid-kh7btl4r> <h3 class="text-xl font-bold mb-2" data-astro-cid-kh7btl4r>${milestone.title}</h3> <p class="text-gray-700 dark:text-gray-300" data-astro-cid-kh7btl4r>${milestone.description}</p> </div> </div>`)} </div> </div> ` })} </div> </section>  <section class="py-20 bg-primary-main text-white" data-astro-cid-kh7btl4r> <div class="container mx-auto px-4 text-center" data-astro-cid-kh7btl4r> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-kh7btl4r": true }, { "default": ($$result3) => renderTemplate` <h2 class="text-3xl font-bold mb-6" data-astro-cid-kh7btl4r>Ready to Shape Your Tomorrow?</h2> <p class="text-xl mb-8 max-w-2xl mx-auto" data-astro-cid-kh7btl4r>
Let's work together to create something amazing. Get in touch to discuss your project.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center" data-astro-cid-kh7btl4r> <a href="/contact" class="bg-white text-primary-main px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors" data-astro-cid-kh7btl4r>
Start a Project
</a> <a href="/services" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-main transition-colors" data-astro-cid-kh7btl4r>
Our Services
</a> </div> ` })} </div> </section> ` })} `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/about.astro", void 0);
const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/about.astro";
const $$url = "/about.html";
export {
  $$About as default,
  $$file as file,
  $$url as url
};
