import { a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from "../vendor-027e926a.js";
import { $ as $$BaseLayout } from "../../renderers.mjs";
import { $ as $$AnimatedSection } from "../../pages/passive-income/guide.astro.mjs";
import { $ as $$CodeDisplay } from "./ai-tools-comparison-2025.astro-6a4cb5b4.js";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Brave = createComponent(async ($$result, $$props, $$slots) => {
  const appData = {
    id: "brave",
    title: "Brave Browser",
    description: "A privacy-focused browser that pays you in Basic Attention Token (BAT) for viewing ads while you browse the web.",
    image: "/images/passive-income/brave.jpg",
    logo: "/images/passive-income/brave-logo.png",
    category: "Browser Rewards",
    link: "https://brave.com/nosyt",
    monthlyEarnings: "$3-10",
    paymentMethods: ["Uphold", "Gemini", "Self-Custody"],
    platforms: ["Windows", "macOS", "Linux", "Android", "iOS"],
    setupDifficulty: "Easy",
    resourceUsage: "Medium",
    minPayout: "None",
    referralProgram: "Varies by region",
    founded: "2015",
    company: "Brave Software, Inc.",
    headquarters: "San Francisco, California",
    privacyPolicy: "https://brave.com/privacy/browser/",
    setupSteps: [
      {
        title: "Download Brave Browser",
        description: "Visit the Brave website and download the browser for your operating system.",
        image: "/images/passive-income/brave-download.jpg"
      },
      {
        title: "Enable Brave Rewards",
        description: "Click on the triangle icon in the address bar and enable Brave Rewards.",
        image: "/images/passive-income/brave-rewards.jpg"
      },
      {
        title: "Customize Ad Settings",
        description: "Set your preferred number of ads per hour (up to 10) in the Brave Rewards settings.",
        image: "/images/passive-income/brave-settings.jpg"
      },
      {
        title: "Connect a Wallet",
        description: "Connect to Uphold or Gemini to withdraw your earned BAT tokens, or use self-custody.",
        image: "/images/passive-income/brave-wallet.jpg"
      }
    ]
  };
  const faqs = [
    {
      question: "What is Brave Browser and how does it work?",
      answer: "Brave is a privacy-focused web browser that blocks trackers and ads by default. Its Brave Rewards program allows users to opt into viewing privacy-respecting ads and earn Basic Attention Token (BAT), a cryptocurrency, in return."
    },
    {
      question: "How much can I earn with Brave Browser?",
      answer: "Earnings vary based on your location, browsing habits, and the number of ads you choose to see per hour. On average, users earn between $3-10 per month. Users in the US, UK, and other high-ad-volume countries tend to earn more."
    },
    {
      question: "Is Brave Browser safe and legitimate?",
      answer: "Yes, Brave is a legitimate browser created by Brendan Eich, co-founder of Mozilla and creator of JavaScript. It's built on Chromium (the same technology behind Google Chrome) and focuses heavily on privacy and security."
    },
    {
      question: "How do I get paid from Brave Browser?",
      answer: "You earn BAT tokens which accumulate in your Brave Rewards wallet. To withdraw, you need to connect to a supported crypto exchange like Uphold or Gemini. You can also use the tokens to tip content creators or websites you enjoy."
    },
    {
      question: "Will I see annoying ads while using Brave?",
      answer: "No, Brave's ads appear as system notifications and are non-intrusive. They don't appear in your browsing content, and you can set how many ads you want to see per hour (from 0 to 10)."
    }
  ];
  const batPriceTrackerCode = `// Basic Attention Token (BAT) Price Tracker
async function trackBATPrice() {
  try {
    // Fetch current BAT price from CoinGecko API
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=basic-attention-token&vs_currencies=usd,eur,gbp');
    const data = await response.json();

    // Extract price data
    const batPrices = data['basic-attention-token'];

    // Display current prices
    console.log('Current BAT Prices:');
    console.log(\`USD: $\${batPrices.usd}\`);
    console.log(\`EUR: €\${batPrices.eur}\`);
    console.log(\`GBP: £\${batPrices.gbp}\`);

    // Calculate potential earnings based on monthly BAT
    const monthlyBAT = 5; // Average monthly earnings in BAT
    const usdValue = monthlyBAT * batPrices.usd;

    console.log(\`
Estimated Monthly Earnings (with \${monthlyBAT} BAT):\`);
    console.log(\`USD: $\${usdValue.toFixed(2)}\`);

    return {
      prices: batPrices,
      monthlyEstimate: {
        bat: monthlyBAT,
        usd: usdValue.toFixed(2)
      }
    };
  } catch (error) {
    console.error('Error fetching BAT price:', error);
    return null;
  }
}

// Call the function
trackBATPrice().then(result => {
  if (result) {
    console.log('Price tracking complete!');
  }
});`;
  return renderTemplate(_a || (_a = __template(["", ` <script>
  // BAT Price Tracker functionality
  document.addEventListener('DOMContentLoaded', function() {
    const batPriceContainer = document.getElementById('bat-price-container');
    if (!batPriceContainer) return;

    // Fetch BAT price from CoinGecko API
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=basic-attention-token&vs_currencies=usd,eur,gbp')
      .then(response => response.json())
      .then(data => {
        const batPrices = data['basic-attention-token'];
        const monthlyBAT = 5; // Average monthly earnings in BAT
        const usdValue = monthlyBAT * batPrices.usd;

        // Update the price container with actual data
        batPriceContainer.innerHTML = \`
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-2xl font-bold text-accent">$\${batPrices.usd}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">USD</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-2xl font-bold text-accent">€\${batPrices.eur}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">EUR</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-2xl font-bold text-accent">£\${batPrices.gbp}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">GBP</div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg inline-block">
            <div class="text-sm text-gray-500 dark:text-gray-400">Estimated Monthly Earnings (5 BAT)</div>
            <div class="text-2xl font-bold text-accent">$\${usdValue.toFixed(2)}</div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">Prices updated: \${new Date().toLocaleString()}</p>
        \`;
      })
      .catch(error => {
        batPriceContainer.innerHTML = \`
          <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
            <p>Error loading BAT price data. Please try again later.</p>
          </div>
        \`;
        console.error('Error fetching BAT price:', error);
      });
  });
<\/script> <script src="/scripts/passive-income-particles.js"><\/script>`], ["", ` <script>
  // BAT Price Tracker functionality
  document.addEventListener('DOMContentLoaded', function() {
    const batPriceContainer = document.getElementById('bat-price-container');
    if (!batPriceContainer) return;

    // Fetch BAT price from CoinGecko API
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=basic-attention-token&vs_currencies=usd,eur,gbp')
      .then(response => response.json())
      .then(data => {
        const batPrices = data['basic-attention-token'];
        const monthlyBAT = 5; // Average monthly earnings in BAT
        const usdValue = monthlyBAT * batPrices.usd;

        // Update the price container with actual data
        batPriceContainer.innerHTML = \\\`
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-2xl font-bold text-accent">$\\\${batPrices.usd}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">USD</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-2xl font-bold text-accent">€\\\${batPrices.eur}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">EUR</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-2xl font-bold text-accent">£\\\${batPrices.gbp}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">GBP</div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg inline-block">
            <div class="text-sm text-gray-500 dark:text-gray-400">Estimated Monthly Earnings (5 BAT)</div>
            <div class="text-2xl font-bold text-accent">$\\\${usdValue.toFixed(2)}</div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">Prices updated: \\\${new Date().toLocaleString()}</p>
        \\\`;
      })
      .catch(error => {
        batPriceContainer.innerHTML = \\\`
          <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
            <p>Error loading BAT price data. Please try again later.</p>
          </div>
        \\\`;
        console.error('Error fetching BAT price:', error);
      });
  });
<\/script> <script src="/scripts/passive-income-particles.js"><\/script>`])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${appData.title} - Passive Income | NosytLabs`, "description": `Learn how to earn passive income with ${appData.title}. Complete guide with setup instructions, earnings potential, and tips.` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-gradient-to-r from-primary-dark to-primary-main text-white py-20"> <!-- Particles background --> <div id="particles-enhanced" class="particles-enhanced absolute inset-0 z-0"></div> <div class="container mx-auto px-4 relative z-10"> <div class="flex flex-col md:flex-row items-center justify-between"> <div class="md:w-1/2 animate-fade-in"> <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">${appData.title}</h1> <p class="text-xl animate-slide-up" style="animation-delay: 0.2s;"> ${appData.description} </p> <div class="mt-8 flex flex-wrap gap-4"> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Download Now
</a> <a href="#setup" class="inline-block bg-white text-primary hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
How to Set Up
</a> </div> </div> <div class="md:w-1/2 mt-8 md:mt-0 flex justify-center animate-fade-in" style="animation-delay: 0.3s;"> <img${addAttribute(appData.image, "src")}${addAttribute(appData.title, "alt")} class="rounded-lg shadow-2xl max-w-full h-auto" width="500" height="300"> </div> </div> </div> <!-- Decorative elements --> <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent z-0"></div> <div class="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/5 to-transparent z-0"></div> </div>  <section class="py-16 bg-white dark:bg-gray-900"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": async ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">About ${appData.title}</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">App Details</h3> <div class="space-y-3 text-gray-700 dark:text-gray-300"> <div class="flex justify-between"> <span class="font-medium">Category:</span> <span>${appData.category}</span> </div> <div class="flex justify-between"> <span class="font-medium">Monthly Earnings:</span> <span>${appData.monthlyEarnings}</span> </div> <div class="flex justify-between"> <span class="font-medium">Payment Methods:</span> <span>${appData.paymentMethods.join(", ")}</span> </div> <div class="flex justify-between"> <span class="font-medium">Minimum Payout:</span> <span>${appData.minPayout}</span> </div> <div class="flex justify-between"> <span class="font-medium">Platforms:</span> <span>${appData.platforms.join(", ")}</span> </div> <div class="flex justify-between"> <span class="font-medium">Setup Difficulty:</span> <span>${appData.setupDifficulty}</span> </div> <div class="flex justify-between"> <span class="font-medium">Resource Usage:</span> <span>${appData.resourceUsage}</span> </div> <div class="flex justify-between"> <span class="font-medium">Referral Program:</span> <span>${appData.referralProgram}</span> </div> </div> </div> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pros & Cons</h3> <div class="mb-4"> <h4 class="font-medium text-green-600 dark:text-green-400 mb-2">Pros:</h4> <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"> <li>Enhanced privacy and security while browsing</li> <li>Built-in ad and tracker blocking</li> <li>Faster browsing experience</li> <li>Earn cryptocurrency while browsing normally</li> <li>Support content creators directly</li> <li>Available on all major platforms</li> <li>Based on Chromium (compatible with Chrome extensions)</li> </ul> </div> <div> <h4 class="font-medium text-red-600 dark:text-red-400 mb-2">Cons:</h4> <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"> <li>Lower earnings compared to dedicated bandwidth sharing apps</li> <li>BAT token value fluctuates with cryptocurrency market</li> <li>KYC verification required for withdrawals to exchanges</li> <li>Limited withdrawal options</li> <li>Earnings vary significantly by region</li> </ul> </div> </div> </div> <div class="mt-8"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">How ${appData.title} Works</h3> <p class="text-gray-700 dark:text-gray-300 mb-4">
Brave Browser works differently from other passive income methods. Instead of sharing your resources, you earn by viewing privacy-respecting ads while browsing the web. Here's how it works:
</p> <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4"> <li>Brave blocks traditional ads and trackers by default</li> <li>You can opt into Brave Rewards to see privacy-respecting ads</li> <li>Ads appear as system notifications, not in your browsing content</li> <li>You earn Basic Attention Token (BAT) for viewing these ads</li> <li>BAT accumulates in your Brave Rewards wallet</li> <li>You can withdraw BAT to supported exchanges or use it to tip content creators</li> </ul> <p class="text-gray-700 dark:text-gray-300">
The key advantage of Brave is that you're not just earning passive income—you're also getting a faster, more private browsing experience. It's a win-win situation where you benefit from both enhanced privacy and passive earnings.
</p> </div> </div> ` })} </div> </section>  <section id="setup" class="py-16 bg-gray-50 dark:bg-gray-800"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": async ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">How to Set Up ${appData.title}</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> ${appData.setupSteps.map((step, index) => renderTemplate`<div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"> <div class="p-4 bg-primary text-white"> <div class="flex items-center"> <div class="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold mr-3"> ${index + 1} </div> <h3 class="text-xl font-semibold">${step.title}</h3> </div> </div> <div class="p-6"> <p class="text-gray-700 dark:text-gray-300 mb-4">${step.description}</p> <img${addAttribute(step.image, "src")}${addAttribute(`Step ${index + 1}: ${step.title}`, "alt")} class="rounded-lg shadow w-full h-auto" loading="lazy"> </div> </div>`)} </div> <div class="mt-8 text-center"> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Download ${appData.title} </a> </div> </div> ` })} </div> </section>  <section class="py-16 bg-white dark:bg-gray-900"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": async ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">BAT Price Tracker</h2> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8"> ${renderComponent($$result3, "CodeDisplay", $$CodeDisplay, { "title": "bat-price-tracker.js", "language": "javascript", "code": batPriceTrackerCode, "dark": true, "showLineNumbers": true, "expandable": true, "theme": "tech" })} </div> <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Current BAT Price</h3> <div id="bat-price-container" class="text-center"> <div class="animate-pulse flex space-x-4 justify-center"> <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div> <div class="flex-1 space-y-4 max-w-md"> <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div> <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div> </div> </div> <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">Loading current BAT price data...</p> </div> </div> </div> ` })} </div> </section>  <section class="py-16 bg-gray-50 dark:bg-gray-800"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": async ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Frequently Asked Questions</h2> <div class="space-y-6"> ${faqs.map((faq) => renderTemplate`<div class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">${faq.question}</h3> <p class="text-gray-700 dark:text-gray-300">${faq.answer}</p> </div>`)} </div> </div> ` })} </div> </section>  <section class="py-16 bg-accent text-white"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": async ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto text-center"> <h2 class="text-3xl font-bold mb-6">Start Earning with ${appData.title} Today</h2> <p class="text-xl mb-8">
Join millions of users who are already enjoying a faster, more private browsing experience while earning passive income.
</p> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-white text-accent hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Download Now
</a> <p class="mt-4 text-sm opacity-80">
By downloading through our link, you'll support NosytLabs at no extra cost to you.
</p> </div> ` })} </div> </section> ` }));
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/passive-income/brave.astro", void 0);
const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/passive-income/brave.astro";
const $$url = "/passive-income/brave.html";
export {
  $$Brave as default,
  $$file as file,
  $$url as url
};
