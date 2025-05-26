import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, d as renderComponent } from "../vendor-027e926a.js";
import "clsx";
import { $ as $$BaseLayout } from "../../renderers.mjs";
import { $ as $$AnimatedSection } from "../../pages/passive-income/guide.astro.mjs";
/* empty css                  */const $$Astro$1 = createAstro("https://nosytlabs.com");
const $$SkillsMatrix = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SkillsMatrix;
  const {
    skills,
    animateOnScroll = true,
    class: className = ""
  } = Astro2.props;
  function getSkillColor(level) {
    if (level >= 90)
      return "skill-expert";
    if (level >= 80)
      return "skill-advanced";
    if (level >= 70)
      return "skill-intermediate";
    return "skill-beginner";
  }
  function getSkillLevelText(level) {
    if (level >= 90)
      return "Expert";
    if (level >= 80)
      return "Advanced";
    if (level >= 70)
      return "Intermediate";
    return "Beginner";
  }
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["skills-matrix", className], "class:list")} data-astro-cid-sgs6tc4s> <div class="skills-grid" data-astro-cid-sgs6tc4s> ${Object.entries(skills).map(([category, categorySkills]) => renderTemplate`<div class="skill-category"${addAttribute(category, "data-category")} data-astro-cid-sgs6tc4s> <div class="category-header" data-astro-cid-sgs6tc4s> <h3 class="category-title" data-astro-cid-sgs6tc4s>${category}</h3> <div class="category-stats" data-astro-cid-sgs6tc4s> <span class="skill-count" data-astro-cid-sgs6tc4s>${categorySkills.length} skills</span> </div> </div> <div class="skills-list" data-astro-cid-sgs6tc4s> ${categorySkills.map((skill, index) => renderTemplate`<div class="skill-item"${addAttribute(skill.name, "data-skill")}${addAttribute(animateOnScroll ? `animation-delay: ${index * 0.1}s;` : "", "style")} data-astro-cid-sgs6tc4s> <div class="skill-info" data-astro-cid-sgs6tc4s> <div class="skill-name" data-astro-cid-sgs6tc4s>${skill.name}</div> <div class="skill-experience" data-astro-cid-sgs6tc4s>${skill.experience}</div> </div> <div class="skill-level" data-astro-cid-sgs6tc4s> <div class="skill-percentage" data-astro-cid-sgs6tc4s>${skill.level}%</div> <div class="skill-bar" data-astro-cid-sgs6tc4s> <div${addAttribute(["skill-progress", getSkillColor(skill.level)], "class:list")}${addAttribute(skill.level, "data-level")} style="width: 0%;" data-astro-cid-sgs6tc4s></div> </div> <div class="skill-label" data-astro-cid-sgs6tc4s>${getSkillLevelText(skill.level)}</div> </div> </div>`)} </div> </div>`)} </div> <!-- Skills Legend --> <div class="skills-legend" data-astro-cid-sgs6tc4s> <h4 class="legend-title" data-astro-cid-sgs6tc4s>Proficiency Levels</h4> <div class="legend-items" data-astro-cid-sgs6tc4s> <div class="legend-item" data-astro-cid-sgs6tc4s> <div class="legend-color skill-expert" data-astro-cid-sgs6tc4s></div> <span data-astro-cid-sgs6tc4s>Expert (90%+)</span> </div> <div class="legend-item" data-astro-cid-sgs6tc4s> <div class="legend-color skill-advanced" data-astro-cid-sgs6tc4s></div> <span data-astro-cid-sgs6tc4s>Advanced (80-89%)</span> </div> <div class="legend-item" data-astro-cid-sgs6tc4s> <div class="legend-color skill-intermediate" data-astro-cid-sgs6tc4s></div> <span data-astro-cid-sgs6tc4s>Intermediate (70-79%)</span> </div> <div class="legend-item" data-astro-cid-sgs6tc4s> <div class="legend-color skill-beginner" data-astro-cid-sgs6tc4s></div> <span data-astro-cid-sgs6tc4s>Beginner (60-69%)</span> </div> </div> </div> </div>  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/SkillsMatrix.astro", void 0);
const $$Astro = createAstro("https://nosytlabs.com");
const $$Skills = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Skills;
  const pageTitle = "Skills & Expertise - NosytLabs";
  const pageDescription = "Explore our technical skills and expertise in web development, AI tools, 3D printing, content creation, and more.";
  const skillsData = {
    "Web Development": [
      { name: "JavaScript", level: 95, experience: "5+ years" },
      { name: "TypeScript", level: 90, experience: "3+ years" },
      { name: "React", level: 88, experience: "4+ years" },
      { name: "Astro", level: 92, experience: "2+ years" },
      { name: "Node.js", level: 85, experience: "4+ years" },
      { name: "HTML/CSS", level: 98, experience: "6+ years" },
      { name: "Tailwind CSS", level: 90, experience: "3+ years" }
    ],
    "AI & Development Tools": [
      { name: "Cursor AI", level: 95, experience: "Expert" },
      { name: "Trae AI", level: 88, experience: "Advanced" },
      { name: "Roo Code Windsurf", level: 85, experience: "Advanced" },
      { name: "GitHub Copilot", level: 80, experience: "Proficient" },
      { name: "ChatGPT Integration", level: 90, experience: "Expert" }
    ],
    "3D Printing & Design": [
      { name: "Creality Printers", level: 92, experience: "Expert" },
      { name: "Fusion 360", level: 78, experience: "Intermediate" },
      { name: "Blender", level: 75, experience: "Intermediate" },
      { name: "STL Optimization", level: 88, experience: "Advanced" },
      { name: "Print Quality Control", level: 95, experience: "Expert" }
    ],
    "Content Creation": [
      { name: "YouTube Production", level: 85, experience: "4+ years" },
      { name: "Live Streaming", level: 90, experience: "3+ years" },
      { name: "Video Editing", level: 80, experience: "3+ years" },
      { name: "SEO Optimization", level: 88, experience: "Advanced" },
      { name: "Social Media", level: 85, experience: "Advanced" }
    ],
    "Backend & Database": [
      { name: "Python", level: 82, experience: "3+ years" },
      { name: "MongoDB", level: 78, experience: "2+ years" },
      { name: "PostgreSQL", level: 75, experience: "2+ years" },
      { name: "API Development", level: 85, experience: "3+ years" },
      { name: "Server Management", level: 80, experience: "2+ years" }
    ]
  };
  const certifications = [
    {
      name: "AI-Powered Development Certification",
      issuer: "Tech Institute",
      date: "2024",
      description: "Advanced certification in AI-assisted development workflows"
    },
    {
      name: "3D Printing Professional",
      issuer: "Creality Academy",
      date: "2023",
      description: "Professional certification in 3D printing technologies and optimization"
    },
    {
      name: "Content Creator Certification",
      issuer: "YouTube Creator Academy",
      date: "2023",
      description: "Certification in professional content creation and audience engagement"
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-xahix5fp": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="bg-gradient-to-br from-primary-dark to-primary-main text-white py-20" data-astro-cid-xahix5fp> <div class="container mx-auto px-4" data-astro-cid-xahix5fp> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-xahix5fp": true }, { "default": ($$result3) => renderTemplate` <div class="text-center" data-astro-cid-xahix5fp> <h1 class="text-4xl md:text-5xl font-bold mb-6" data-astro-cid-xahix5fp>
Skills & Expertise
</h1> <p class="text-xl mb-8 max-w-3xl mx-auto" data-astro-cid-xahix5fp>
Comprehensive technical skills across web development, AI tools, 3D printing, 
            and content creation, backed by years of hands-on experience.
</p> </div> ` })} </div> </section>  <section class="py-20 bg-gray-50 dark:bg-gray-900" data-astro-cid-xahix5fp> <div class="container mx-auto px-4" data-astro-cid-xahix5fp> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-xahix5fp": true }, { "default": ($$result3) => renderTemplate` <div class="text-center mb-16" data-astro-cid-xahix5fp> <h2 class="text-3xl font-bold mb-4" data-astro-cid-xahix5fp>Technical Proficiency</h2> <p class="text-lg text-gray-600 dark:text-gray-300" data-astro-cid-xahix5fp>
Interactive skills matrix showing expertise levels across different technologies
</p> </div> ${renderComponent($$result3, "SkillsMatrix", $$SkillsMatrix, { "skills": skillsData, "data-astro-cid-xahix5fp": true })} ` })} </div> </section>  <section class="py-20" data-astro-cid-xahix5fp> <div class="container mx-auto px-4" data-astro-cid-xahix5fp> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-xahix5fp": true }, { "default": ($$result3) => renderTemplate` <div class="text-center mb-16" data-astro-cid-xahix5fp> <h2 class="text-3xl font-bold mb-4" data-astro-cid-xahix5fp>Certifications & Achievements</h2> <p class="text-lg text-gray-600 dark:text-gray-300" data-astro-cid-xahix5fp>
Professional certifications and industry recognition
</p> </div> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-xahix5fp> ${certifications.map((cert) => renderTemplate`<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow" data-astro-cid-xahix5fp> <div class="flex items-center mb-4" data-astro-cid-xahix5fp> <div class="w-12 h-12 bg-primary-main rounded-lg flex items-center justify-center mr-4" data-astro-cid-xahix5fp> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-xahix5fp> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" data-astro-cid-xahix5fp></path> </svg> </div> <div data-astro-cid-xahix5fp> <h3 class="font-bold text-lg" data-astro-cid-xahix5fp>${cert.name}</h3> <p class="text-sm text-gray-600 dark:text-gray-400" data-astro-cid-xahix5fp>${cert.issuer} • ${cert.date}</p> </div> </div> <p class="text-gray-700 dark:text-gray-300" data-astro-cid-xahix5fp>${cert.description}</p> </div>`)} </div> ` })} </div> </section>  <section class="py-20 bg-primary-main text-white" data-astro-cid-xahix5fp> <div class="container mx-auto px-4 text-center" data-astro-cid-xahix5fp> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "data-astro-cid-xahix5fp": true }, { "default": ($$result3) => renderTemplate` <h2 class="text-3xl font-bold mb-6" data-astro-cid-xahix5fp>Ready to Work Together?</h2> <p class="text-xl mb-8 max-w-2xl mx-auto" data-astro-cid-xahix5fp>
Let's discuss how our expertise can help bring your project to life.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center" data-astro-cid-xahix5fp> <a href="/contact" class="bg-white text-primary-main px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors" data-astro-cid-xahix5fp>
Get In Touch
</a> <a href="/projects" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-main transition-colors" data-astro-cid-xahix5fp>
View Projects
</a> </div> ` })} </div> </section> ` })}  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/skills.astro", void 0);
const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/skills.astro";
const $$url = "/skills.html";
export {
  $$Skills as default,
  $$file as file,
  $$url as url
};
