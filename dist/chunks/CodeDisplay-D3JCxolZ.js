import {c as createAstro,a as createComponent,m as maybeRenderHead,b as addAttribute,r as renderTemplate}from'./astro/server-CSpupoyF.js';import'kleur/colors';import'clsx';/* empty css                                          */const $$Astro = createAstro("https://nosytlabs.com");
const $$CodeDisplay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CodeDisplay;
  const {
    title = "main.js",
    language = "javascript",
    code = "",
    dark = true,
    showLineNumbers = true,
    terminalMode = false,
    expandable = false,
    theme = "default"
  } = Astro2.props;
  function addLineNumbers(code2) {
    return code2.split("\n").map(
      (line, i) => `<span class="line-number">${i + 1}</span>${line}`
    ).join("\n");
  }
  let themeClasses = "";
  if (theme === "professional") {
    themeClasses = "theme-professional";
  } else if (theme === "tech") {
    themeClasses = "theme-tech";
  } else if (theme === "minimal") {
    themeClasses = "theme-minimal";
  }
  const editorClass = terminalMode ? "terminal-editor" : "code-display";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`${editorClass} ${themeClasses} rounded-lg overflow-hidden shadow-lg ${dark ? "bg-gray-900" : "bg-white"} ${expandable ? "expandable" : ""}`, "class")} data-astro-cid-gqdrpsfm> <!-- Code Editor Header --> <div${addAttribute(`editor-header px-4 py-2 flex items-center justify-between ${dark ? "bg-gray-800" : "bg-gray-100"}`, "class")} data-astro-cid-gqdrpsfm> <div class="flex items-center space-x-2" data-astro-cid-gqdrpsfm> <div class="w-3 h-3 rounded-full bg-red-500 window-button close-button" data-astro-cid-gqdrpsfm></div> <div class="w-3 h-3 rounded-full bg-yellow-500 window-button minimize-button" data-astro-cid-gqdrpsfm></div> <div class="w-3 h-3 rounded-full bg-green-500 window-button maximize-button" data-astro-cid-gqdrpsfm></div> </div> <div${addAttribute(`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`, "class")} data-astro-cid-gqdrpsfm> ${title} </div> <div class="flex items-center space-x-2" data-astro-cid-gqdrpsfm> ${expandable && renderTemplate`<button class="expand-button text-xs px-2 py-1 rounded bg-gray-700 bg-opacity-20 hover:bg-opacity-30 transition-colors" aria-label="Expand code" data-astro-cid-gqdrpsfm> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-gqdrpsfm> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" data-astro-cid-gqdrpsfm></path> </svg> </button>`} <button class="copy-button text-xs px-2 py-1 rounded bg-gray-700 bg-opacity-20 hover:bg-opacity-30 transition-colors" aria-label="Copy code" data-astro-cid-gqdrpsfm> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-gqdrpsfm> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" data-astro-cid-gqdrpsfm></path> </svg> </button> </div> </div> <!-- Code Editor Content --> <div class="editor-content p-4 overflow-auto max-h-[500px]" data-astro-cid-gqdrpsfm> ${code && renderTemplate`<div class="code-container relative" data-astro-cid-gqdrpsfm> ${terminalMode && renderTemplate`<div class="terminal-prompt" data-astro-cid-gqdrpsfm>$&nbsp;</div>`} <pre${addAttribute(`code-block font-mono text-sm ${showLineNumbers ? "with-line-numbers" : ""} ${dark ? "text-gray-300" : "text-gray-800"}`, "class")} data-astro-cid-gqdrpsfm>          <code${addAttribute(`language-${language}`, "class")}${addAttribute(language, "data-language")} data-astro-cid-gqdrpsfm>
            ${showLineNumbers ? addLineNumbers(code) : code}
          </code>
        </pre> <div class="copy-notification" data-astro-cid-gqdrpsfm>Copied!</div> </div>`} </div> </div>  `;
}, "/mnt/persist/workspace/src/components/CodeDisplay.astro", void 0);export{$$CodeDisplay as $};