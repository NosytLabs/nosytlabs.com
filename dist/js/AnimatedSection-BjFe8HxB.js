import { c as createComponent, a as createAstro, e as renderTemplate, g as defineScriptVars, h as renderSlot, b as addAttribute, m as maybeRenderHead } from "./vendor-DUem_BGh.js";
/* empty css                 */
var d = Object.freeze, S = Object.defineProperty;
var c = (a, n) => d(S(a, "raw", { value: d(n || a.slice()) }));
var g;
const l = createAstro("https://nosytlabs.com"), m = createComponent((a, n, s) => {
  const i = a.createAstro(l, n, s);
  i.self = m;
  const { animation: o = "fade-in", delay: $ = 0, duration: y = 0.8, threshold: h = 0.1, once: f = true, stagger: p = false, staggerDelay: u = 0.1, class: b = "", id: A } = i.props, r = A || `animated-section-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate(g || (g = c(["", "<section", "", "", "", "", "", "", "", "", " data-astro-cid-cch7oa3t> ", " </section>  <script>(function(){", `
  document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const animation = section.dataset.animation || 'fade-in';
    const delay = parseFloat(section.dataset.delay || '0');
    const duration = parseFloat(section.dataset.duration || '0.8');
    const threshold = parseFloat(section.dataset.threshold || '0.1');
    const once = section.dataset.once === 'true';
    const stagger = section.dataset.stagger === 'true';
    const staggerDelay = parseFloat(section.dataset.staggerDelay || '0.1');
    
    // Apply animation class
    section.classList.add(\`animate-\${animation}\`);
    
    // Set animation duration and delay
    section.style.animationDuration = \`\${duration}s\`;
    section.style.animationDelay = \`\${delay}s\`;
    section.style.animationFillMode = 'forwards';
    
    // If staggered, prepare child elements
    if (stagger) {
      const children = Array.from(section.children);
      children.forEach((child, index) => {
        child.classList.add('staggered-child');
        child.style.animationName = animation;
        child.style.animationDuration = \`\${duration}s\`;
        child.style.animationDelay = \`\${delay + (index * staggerDelay)}s\`;
        child.style.animationFillMode = 'forwards';
      });
    }
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate the section
          section.style.opacity = '1';
          
          // If staggered, animate children
          if (stagger) {
            const children = Array.from(section.children);
            children.forEach((child, index) => {
              setTimeout(() => {
                child.style.opacity = '1';
              }, index * (staggerDelay * 1000));
            });
          }
          
          // Unobserve if only animating once
          if (once) {
            observer.unobserve(section);
          }
        } else if (!once) {
          // Reset animation if not once
          section.style.opacity = '0';
          
          if (stagger) {
            const children = Array.from(section.children);
            children.forEach(child => {
              child.style.opacity = '0';
            });
          }
        }
      });
    }, { threshold });
    
    // Start observing
    observer.observe(section);
  });
})();<\/script>`], ["", "<section", "", "", "", "", "", "", "", "", " data-astro-cid-cch7oa3t> ", " </section>  <script>(function(){", `
  document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const animation = section.dataset.animation || 'fade-in';
    const delay = parseFloat(section.dataset.delay || '0');
    const duration = parseFloat(section.dataset.duration || '0.8');
    const threshold = parseFloat(section.dataset.threshold || '0.1');
    const once = section.dataset.once === 'true';
    const stagger = section.dataset.stagger === 'true';
    const staggerDelay = parseFloat(section.dataset.staggerDelay || '0.1');
    
    // Apply animation class
    section.classList.add(\\\`animate-\\\${animation}\\\`);
    
    // Set animation duration and delay
    section.style.animationDuration = \\\`\\\${duration}s\\\`;
    section.style.animationDelay = \\\`\\\${delay}s\\\`;
    section.style.animationFillMode = 'forwards';
    
    // If staggered, prepare child elements
    if (stagger) {
      const children = Array.from(section.children);
      children.forEach((child, index) => {
        child.classList.add('staggered-child');
        child.style.animationName = animation;
        child.style.animationDuration = \\\`\\\${duration}s\\\`;
        child.style.animationDelay = \\\`\\\${delay + (index * staggerDelay)}s\\\`;
        child.style.animationFillMode = 'forwards';
      });
    }
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate the section
          section.style.opacity = '1';
          
          // If staggered, animate children
          if (stagger) {
            const children = Array.from(section.children);
            children.forEach((child, index) => {
              setTimeout(() => {
                child.style.opacity = '1';
              }, index * (staggerDelay * 1000));
            });
          }
          
          // Unobserve if only animating once
          if (once) {
            observer.unobserve(section);
          }
        } else if (!once) {
          // Reset animation if not once
          section.style.opacity = '0';
          
          if (stagger) {
            const children = Array.from(section.children);
            children.forEach(child => {
              child.style.opacity = '0';
            });
          }
        }
      });
    }, { threshold });
    
    // Start observing
    observer.observe(section);
  });
})();<\/script>`])), maybeRenderHead(), addAttribute(r, "id"), addAttribute(`animated-section ${b}`, "class"), addAttribute(o, "data-animation"), addAttribute($, "data-delay"), addAttribute(y, "data-duration"), addAttribute(h, "data-threshold"), addAttribute(f, "data-once"), addAttribute(p, "data-stagger"), addAttribute(u, "data-stagger-delay"), renderSlot(a, s.default), defineScriptVars({ sectionId: r }));
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/animations/AnimatedSection.astro", void 0);
export {
  m
};
