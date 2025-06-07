import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, f as renderScript, e as renderTemplate } from "./vendor-DUem_BGh.js";
/* empty css                                         */
const m = createAstro("https://nosytlabs.com"), g = createComponent((r, $, f) => {
  const n = r.createAstro(m, $, f);
  n.self = g;
  const { title: u = "main.js", language: i = "javascript", code: o = "", dark: t = true, showLineNumbers: l = true, terminalMode: c = false, expandable: p = false, theme: d = "default" } = n.props;
  function b(h) {
    return h.split(`
`).map((y, x) => `<span class="line-number">${x + 1}</span>${y}`).join(`
`);
  }
  let a = "";
  d === "professional" ? a = "theme-professional" : d === "tech" ? a = "theme-tech" : d === "minimal" && (a = "theme-minimal");
  const v = c ? "terminal-editor" : "code-display";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`${v} ${a} rounded-lg overflow-hidden shadow-lg ${t ? "bg-gray-900" : "bg-white"} ${p ? "expandable" : ""}`, "class")} data-astro-cid-gqdrpsfm> <!-- Code Editor Header --> <div${addAttribute(`editor-header px-4 py-2 flex items-center justify-between ${t ? "bg-gray-800" : "bg-gray-100"}`, "class")} data-astro-cid-gqdrpsfm> <div class="flex items-center space-x-2" data-astro-cid-gqdrpsfm> <div class="w-3 h-3 rounded-full bg-red-500 window-button close-button" data-astro-cid-gqdrpsfm></div> <div class="w-3 h-3 rounded-full bg-yellow-500 window-button minimize-button" data-astro-cid-gqdrpsfm></div> <div class="w-3 h-3 rounded-full bg-green-500 window-button maximize-button" data-astro-cid-gqdrpsfm></div> </div> <div${addAttribute(`text-sm font-medium ${t ? "text-gray-300" : "text-gray-700"}`, "class")} data-astro-cid-gqdrpsfm> ${u} </div> <div class="flex items-center space-x-2" data-astro-cid-gqdrpsfm> ${p && renderTemplate`<button class="expand-button text-xs px-2 py-1 rounded bg-gray-700 bg-opacity-20 hover:bg-opacity-30 transition-colors" aria-label="Expand code" data-astro-cid-gqdrpsfm> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-gqdrpsfm> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" data-astro-cid-gqdrpsfm></path> </svg> </button>`} <button class="copy-button text-xs px-2 py-1 rounded bg-gray-700 bg-opacity-20 hover:bg-opacity-30 transition-colors" aria-label="Copy code" data-astro-cid-gqdrpsfm> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-gqdrpsfm> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" data-astro-cid-gqdrpsfm></path> </svg> </button> </div> </div> <!-- Code Editor Content --> <div class="editor-content p-4 overflow-auto max-h-[500px]" data-astro-cid-gqdrpsfm> ${o && renderTemplate`<div class="code-container relative" data-astro-cid-gqdrpsfm> ${c && renderTemplate`<div class="terminal-prompt" data-astro-cid-gqdrpsfm>$&nbsp;</div>`} <pre${addAttribute(`code-block font-mono text-sm ${l ? "with-line-numbers" : ""} ${t ? "text-gray-300" : "text-gray-800"}`, "class")} data-astro-cid-gqdrpsfm>          <code${addAttribute(`language-${i}`, "class")}${addAttribute(i, "data-language")} data-astro-cid-gqdrpsfm>
            ${l ? b(o) : o}
          </code>
        </pre> <div class="copy-notification" data-astro-cid-gqdrpsfm>Copied!</div> </div>`} </div> </div>  ${renderScript(r, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/CodeDisplay.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/CodeDisplay.astro", void 0);
export {
  g
};
