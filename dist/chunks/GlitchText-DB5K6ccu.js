import {c as createAstro,a as createComponent,e as renderComponent,r as renderTemplate}from'./astro/server-CSpupoyF.js';import'kleur/colors';/* empty css                           */const $$Astro = createAstro("https://nosytlabs.com");
const $$GlitchText = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$GlitchText;
  const {
    text,
    tag = "h2",
    color = "text-white",
    size = "text-3xl md:text-4xl",
    weight = "font-bold",
    className = "",
    glitchOnHover = false
  } = Astro2.props;
  const Tag = tag;
  const effectClass = glitchOnHover ? "highlight-text-hover" : "highlight-text";
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "class": `${effectClass} ${color} ${size} ${weight} ${className}`, "data-astro-cid-274sirgd": true }, { "default": ($$result2) => renderTemplate`${text}` })} `;
}, "/mnt/persist/workspace/src/components/GlitchText.astro", void 0);export{$$GlitchText as $};