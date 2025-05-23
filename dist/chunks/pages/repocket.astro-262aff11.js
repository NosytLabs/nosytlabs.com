/* empty css                              */import {a as createComponent,r as renderTemplate,f as renderComponent,m as maybeRenderHead,e as addAttribute}from'../astro-061ea033.js';import {$ as $$BaseLayout}from'./3d-printing.astro-bbf5f2c9.js';import {$ as $$AnimatedSection}from'./brave.astro-9f38c3b1.js';import {$ as $$CodeDisplay}from'./ai-tools-comparison-2025.astro-8c140a12.js';var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Repocket = createComponent(($$result, $$props, $$slots) => {
  const appData = {
    id: "repocket",
    title: "Repocket",
    description: "Monetize your unused internet bandwidth. Repocket allows you to earn passive income by sharing your internet connection.",
    image: "/images/passive-income/repocket.jpg",
    logo: "/images/passive-income/repocket-logo.png",
    category: "Bandwidth Sharing",
    link: "https://link.repocket.co/nosytlabs",
    monthlyEarnings: "$5-20",
    paymentMethods: ["PayPal", "Bitcoin", "Ethereum"],
    platforms: ["Windows", "macOS", "Android"],
    setupDifficulty: "Easy",
    resourceUsage: "Low",
    minPayout: "$10",
    referralProgram: "25% of referral earnings",
    founded: "2021",
    company: "Repocket Ltd",
    headquarters: "United Kingdom",
    privacyPolicy: "https://repocket.co/privacy",
    setupSteps: [
      {
        title: "Create an account",
        description: "Visit the Repocket website and sign up with your email address.",
        image: "/images/passive-income/repocket-signup.jpg"
      },
      {
        title: "Download the app",
        description: "Download and install the Repocket application on your preferred device(s).",
        image: "/images/passive-income/repocket-download.jpg"
      },
      {
        title: "Start earning",
        description: "Open the app and start earning immediately. No additional configuration required.",
        image: "/images/passive-income/repocket-dashboard.jpg"
      },
      {
        title: "Cash out",
        description: "Once you reach the minimum payout threshold of $10, you can cash out via PayPal or cryptocurrency.",
        image: "/images/passive-income/repocket-cashout.jpg"
      }
    ]
  };
  const faqs = [
    {
      question: "What is Repocket and how does it work?",
      answer: "Repocket is a passive income app that pays you for sharing your unused internet bandwidth. The bandwidth is used for various legitimate business purposes like web intelligence gathering, price comparison, and content delivery."
    },
    {
      question: "Is Repocket safe and legitimate?",
      answer: "Yes, Repocket is a legitimate company that follows strict privacy and security standards. The app doesn't access your personal data or browsing history, and only uses your excess bandwidth for legitimate business purposes."
    },
    {
      question: "How much can I earn with Repocket?",
      answer: "Earnings vary based on your location, internet speed, and how many devices you use. On average, users earn between $5-20 per month with 2-3 devices running continuously. Users in the US, UK, and other high-demand countries tend to earn more."
    },
    {
      question: "Will Repocket slow down my internet?",
      answer: "Repocket is designed to use only your excess bandwidth, so most users don't notice any significant slowdown. The app includes settings to limit bandwidth usage if needed."
    },
    {
      question: "How do I get paid from Repocket?",
      answer: "Once you reach the minimum payout threshold of $10, you can withdraw your earnings via PayPal, Bitcoin, or Ethereum. Payments are typically processed within 1-3 business days."
    }
  ];
  const earningsCalculatorCode = `// Repocket Earnings Calculator
function calculateRepocketEarnings(devices, hoursPerDay, referrals) {
  // Base earnings per device per hour (in dollars)
  const baseRatePerHour = 0.0035;

  // Earnings multiplier based on location (example values)
  const locationMultipliers = {
    'US': 1.5,
    'UK': 1.4,
    'Canada': 1.3,
    'Australia': 1.3,
    'Germany': 1.2,
    'France': 1.2,
    'Other': 1.0
  };

  // Default to 'Other' location
  const locationMultiplier = locationMultipliers['Other'];

  // Calculate device earnings
  const dailyEarnings = devices * baseRatePerHour * hoursPerDay * locationMultiplier;
  const monthlyEarnings = dailyEarnings * 30;

  // Calculate referral earnings (25% of referred users' earnings)
  // Assuming each referral has 1 device running 12 hours per day
  const referralEarnings = referrals * 0.25 * baseRatePerHour * 12 * 30 * locationMultiplier;

  // Total monthly earnings
  const totalMonthlyEarnings = monthlyEarnings + referralEarnings;

  return {
    deviceEarnings: monthlyEarnings.toFixed(2),
    referralEarnings: referralEarnings.toFixed(2),
    totalEarnings: totalMonthlyEarnings.toFixed(2)
  };
}

// Example calculation
const earnings = calculateRepocketEarnings(2, 12, 3);
console.log(\`Device Earnings: $\${earnings.deviceEarnings}\`);
console.log(\`Referral Earnings: $\${earnings.referralEarnings}\`);
console.log(\`Total Monthly Earnings: $\${earnings.totalEarnings}\`);`;
  return renderTemplate(_a || (_a = __template(["", " <script>\n  // Earnings calculator functionality\n  document.addEventListener('DOMContentLoaded', function() {\n    const calculateButton = document.getElementById('calculate-earnings');\n    if (!calculateButton) return;\n\n    calculateButton.addEventListener('click', function() {\n      const devices = parseInt(document.getElementById('devices').value) || 1;\n      const hours = parseInt(document.getElementById('hours').value) || 12;\n      const referrals = parseInt(document.getElementById('referrals').value) || 0;\n\n      // Base earnings per device per hour (in dollars)\n      const baseRatePerHour = 0.0035;\n\n      // Default to 'Other' location with multiplier 1.0\n      const locationMultiplier = 1.0;\n\n      // Calculate device earnings\n      const dailyEarnings = devices * baseRatePerHour * hours * locationMultiplier;\n      const monthlyEarnings = dailyEarnings * 30;\n\n      // Calculate referral earnings (25% of referred users' earnings)\n      // Assuming each referral has 1 device running 12 hours per day\n      const referralEarnings = referrals * 0.25 * baseRatePerHour * 12 * 30 * locationMultiplier;\n\n      // Total monthly earnings\n      const totalMonthlyEarnings = monthlyEarnings + referralEarnings;\n\n      // Display results\n      alert(`Estimated Monthly Earnings:\nDevice Earnings: $${monthlyEarnings.toFixed(2)}\nReferral Earnings: $${referralEarnings.toFixed(2)}\nTotal: $${totalMonthlyEarnings.toFixed(2)}`);\n    });\n  });\n<\/script> <script src=\"/scripts/passive-income-particles.js\"><\/script>"], ["", " <script>\n  // Earnings calculator functionality\n  document.addEventListener('DOMContentLoaded', function() {\n    const calculateButton = document.getElementById('calculate-earnings');\n    if (!calculateButton) return;\n\n    calculateButton.addEventListener('click', function() {\n      const devices = parseInt(document.getElementById('devices').value) || 1;\n      const hours = parseInt(document.getElementById('hours').value) || 12;\n      const referrals = parseInt(document.getElementById('referrals').value) || 0;\n\n      // Base earnings per device per hour (in dollars)\n      const baseRatePerHour = 0.0035;\n\n      // Default to 'Other' location with multiplier 1.0\n      const locationMultiplier = 1.0;\n\n      // Calculate device earnings\n      const dailyEarnings = devices * baseRatePerHour * hours * locationMultiplier;\n      const monthlyEarnings = dailyEarnings * 30;\n\n      // Calculate referral earnings (25% of referred users' earnings)\n      // Assuming each referral has 1 device running 12 hours per day\n      const referralEarnings = referrals * 0.25 * baseRatePerHour * 12 * 30 * locationMultiplier;\n\n      // Total monthly earnings\n      const totalMonthlyEarnings = monthlyEarnings + referralEarnings;\n\n      // Display results\n      alert(\\`Estimated Monthly Earnings:\nDevice Earnings: $\\${monthlyEarnings.toFixed(2)}\nReferral Earnings: $\\${referralEarnings.toFixed(2)}\nTotal: $\\${totalMonthlyEarnings.toFixed(2)}\\`);\n    });\n  });\n<\/script> <script src=\"/scripts/passive-income-particles.js\"><\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${appData.title} - Passive Income | NosytLabs`, "description": `Learn how to earn passive income with ${appData.title}. Complete guide with setup instructions, earnings potential, and tips.` }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-gradient-to-r from-primary-dark to-primary-main text-white py-20"> <!-- Particles background --> <div id="particles-enhanced" class="particles-enhanced absolute inset-0 z-0"></div> <div class="container mx-auto px-4 relative z-10"> <div class="flex flex-col md:flex-row items-center justify-between"> <div class="md:w-1/2 animate-fade-in"> <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">${appData.title}</h1> <p class="text-xl animate-slide-up" style="animation-delay: 0.2s;"> ${appData.description} </p> <div class="mt-8 flex flex-wrap gap-4"> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Sign Up Now
</a> <a href="#setup" class="inline-block bg-white text-primary hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
How to Set Up
</a> </div> </div> <div class="md:w-1/2 mt-8 md:mt-0 flex justify-center animate-fade-in" style="animation-delay: 0.3s;"> <img${addAttribute(appData.image, "src")}${addAttribute(appData.title, "alt")} class="rounded-lg shadow-2xl max-w-full h-auto" width="500" height="300"> </div> </div> </div> <!-- Decorative elements --> <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent z-0"></div> <div class="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/5 to-transparent z-0"></div> </div>  <section class="py-16 bg-white dark:bg-gray-900"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">About ${appData.title}</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">App Details</h3> <div class="space-y-3 text-gray-700 dark:text-gray-300"> <div class="flex justify-between"> <span class="font-medium">Category:</span> <span>${appData.category}</span> </div> <div class="flex justify-between"> <span class="font-medium">Monthly Earnings:</span> <span>${appData.monthlyEarnings}</span> </div> <div class="flex justify-between"> <span class="font-medium">Payment Methods:</span> <span>${appData.paymentMethods.join(", ")}</span> </div> <div class="flex justify-between"> <span class="font-medium">Minimum Payout:</span> <span>${appData.minPayout}</span> </div> <div class="flex justify-between"> <span class="font-medium">Platforms:</span> <span>${appData.platforms.join(", ")}</span> </div> <div class="flex justify-between"> <span class="font-medium">Setup Difficulty:</span> <span>${appData.setupDifficulty}</span> </div> <div class="flex justify-between"> <span class="font-medium">Resource Usage:</span> <span>${appData.resourceUsage}</span> </div> <div class="flex justify-between"> <span class="font-medium">Referral Program:</span> <span>${appData.referralProgram}</span> </div> </div> </div> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pros & Cons</h3> <div class="mb-4"> <h4 class="font-medium text-green-600 dark:text-green-400 mb-2">Pros:</h4> <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"> <li>High referral commission (25%)</li> <li>Cryptocurrency payment options</li> <li>Clean user interface</li> <li>Good customer support</li> <li>Transparent earnings dashboard</li> <li>Low resource usage</li> <li>Easy to set up and use</li> </ul> </div> <div> <h4 class="font-medium text-red-600 dark:text-red-400 mb-2">Cons:</h4> <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"> <li>Newer service with less track record</li> <li>Lower earnings in some regions</li> <li>Limited platform support</li> <li>Higher minimum payout than some competitors</li> <li>Earnings can fluctuate based on demand</li> </ul> </div> </div> </div> <div class="mt-8"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">How ${appData.title} Works</h3> <p class="text-gray-700 dark:text-gray-300 mb-4"> ${appData.title} works by allowing you to share your unused internet bandwidth with the company's network. This bandwidth is then used for various legitimate business purposes such as:
</p> <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4"> <li>Web intelligence gathering for businesses</li> <li>Price comparison and monitoring</li> <li>Ad verification and brand protection</li> <li>Market research and competitive analysis</li> <li>Content delivery and website performance testing</li> </ul> <p class="text-gray-700 dark:text-gray-300">
The app runs in the background on your devices and only uses bandwidth that you're not actively using. You earn credits based on the amount of data shared, which can then be converted to cash once you reach the minimum payout threshold of ${appData.minPayout}.
</p> </div> </div> ` })} </div> </section>  <section id="setup" class="py-16 bg-gray-50 dark:bg-gray-800"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">How to Set Up ${appData.title}</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> ${appData.setupSteps.map((step, index) => renderTemplate`<div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"> <div class="p-4 bg-primary text-white"> <div class="flex items-center"> <div class="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold mr-3"> ${index + 1} </div> <h3 class="text-xl font-semibold">${step.title}</h3> </div> </div> <div class="p-6"> <p class="text-gray-700 dark:text-gray-300 mb-4">${step.description}</p> <img${addAttribute(step.image, "src")}${addAttribute(`Step ${index + 1}: ${step.title}`, "alt")} class="rounded-lg shadow w-full h-auto" loading="lazy"> </div> </div>`)} </div> <div class="mt-8 text-center"> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Sign Up for ${appData.title} </a> </div> </div> ` })} </div> </section>  <section class="py-16 bg-white dark:bg-gray-900"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Earnings Calculator</h2> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8"> ${renderComponent($$result3, "CodeDisplay", $$CodeDisplay, { "title": "repocket-earnings-calculator.js", "language": "javascript", "code": earningsCalculatorCode, "dark": true, "showLineNumbers": true, "expandable": true, "theme": "tech" })} </div> <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Calculate Your Potential Earnings</h3> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"> <div> <label for="devices" class="block text-gray-700 dark:text-gray-300 mb-2">Number of Your Devices</label> <input type="number" id="devices" min="1" max="10" value="2" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"> </div> <div> <label for="hours" class="block text-gray-700 dark:text-gray-300 mb-2">Hours Active Per Day</label> <input type="number" id="hours" min="1" max="24" value="12" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"> </div> <div> <label for="referrals" class="block text-gray-700 dark:text-gray-300 mb-2">Number of Referrals</label> <input type="number" id="referrals" min="0" max="100" value="0" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"> </div> </div> <button id="calculate-earnings" class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-lg transition-colors">
Calculate Earnings
</button> </div> </div> ` })} </div> </section>  <section class="py-16 bg-gray-50 dark:bg-gray-800"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Frequently Asked Questions</h2> <div class="space-y-6"> ${faqs.map((faq) => renderTemplate`<div class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">${faq.question}</h3> <p class="text-gray-700 dark:text-gray-300">${faq.answer}</p> </div>`)} </div> </div> ` })} </div> </section>  <section class="py-16 bg-accent text-white"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto text-center"> <h2 class="text-3xl font-bold mb-6">Start Earning with ${appData.title} Today</h2> <p class="text-xl mb-8">
Join thousands of users who are already earning passive income by sharing their unused internet bandwidth.
</p> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-white text-accent hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Sign Up Now
</a> <p class="mt-4 text-sm opacity-80">
By signing up through our link, you'll support NosytLabs at no extra cost to you.
</p> </div> ` })} </div> </section> ` }));
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/passive-income/repocket.astro", void 0);

const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/passive-income/repocket.astro";
const $$url = "/passive-income/repocket.html";export{$$Repocket as default,$$file as file,$$url as url};