import { a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from "../vendor-027e926a.js";
import { $ as $$BaseLayout } from "../../renderers.mjs";
import { $ as $$AnimatedSection } from "../../pages/passive-income/guide.astro.mjs";
import { $ as $$CodeDisplay } from "./ai-tools-comparison-2025.astro-6a4cb5b4.js";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Earnapp = createComponent(($$result, $$props, $$slots) => {
  const appData = {
    id: "earnapp",
    title: "EarnApp",
    description: "Turn your unused internet bandwidth into passive income. EarnApp is a legitimate way to monetize your internet connection.",
    image: "/images/passive-income/earnapp.jpg",
    logo: "/images/passive-income/earnapp-logo.png",
    category: "Bandwidth Sharing",
    link: "https://earnapp.com/i/nosytlabs",
    monthlyEarnings: "$10-25",
    paymentMethods: ["PayPal", "Amazon Gift Cards"],
    platforms: ["Windows", "macOS", "Android"],
    setupDifficulty: "Easy",
    resourceUsage: "Low",
    minPayout: "$2.50",
    referralProgram: "$0.50 per device + 10% of referral earnings",
    founded: "2020",
    company: "Bright Data (formerly Luminati Networks)",
    headquarters: "Israel",
    privacyPolicy: "https://earnapp.com/privacy",
    termsOfService: "https://earnapp.com/terms"
  };
  const pros = [
    "Very low minimum payout threshold ($2.50)",
    "Fast payments (usually within 24 hours)",
    "Excellent referral program",
    "Backed by established company (Bright Data)",
    "Simple and clean user interface",
    "Minimal impact on internet speed",
    "Transparent earnings dashboard"
  ];
  const cons = [
    "Not available in all countries",
    "Limited payment options compared to competitors",
    "No iOS app available yet",
    "Earnings can vary significantly by location",
    "Requires Google account for sign-up"
  ];
  const setupInstructions = [
    {
      step: 1,
      title: "Create an account",
      description: "Visit the EarnApp website and sign up with your Google account.",
      image: "/images/passive-income/earnapp-signup.jpg"
    },
    {
      step: 2,
      title: "Download the app",
      description: "Download and install the EarnApp application on your preferred device(s).",
      image: "/images/passive-income/earnapp-download.jpg"
    },
    {
      step: 3,
      title: "Link your devices",
      description: "Open the app and link it to your account by entering the device ID shown in your dashboard.",
      image: "/images/passive-income/earnapp-link.jpg"
    },
    {
      step: 4,
      title: "Cash out",
      description: "Once you reach the minimum payout threshold of $2.50, you can cash out via PayPal or Amazon Gift Cards.",
      image: "/images/passive-income/earnapp-cashout.jpg"
    }
  ];
  const earningsCalculatorCode = `// EarnApp Earnings Calculator
const calculateEarnAppEarnings = (devices, hours, referrals, referralDevices) => {
  // Base earnings: varies by location, average $0.10-0.25 per GB
  // Average bandwidth usage: 10-15 MB per hour per device
  const avgMbPerHour = 12; // 12 MB per hour average
  const avgRatePerGb = 0.15; // $0.15 per GB average

  // Calculate daily bandwidth earnings
  const dailyMb = devices * hours * avgMbPerHour;
  const dailyGb = dailyMb / 1024;
  const dailyBandwidthEarnings = dailyGb * avgRatePerGb;

  // Referral earnings
  // $0.50 one-time bonus per device + 10% of earnings
  const oneTimeBonus = referralDevices * 0.5 / 30; // Spread across a month
  const avgReferralDailyEarning = 0.08; // $0.08 per day per referral device average
  const referralEarnings = referralDevices * avgReferralDailyEarning * 0.1;
  const totalReferralEarnings = oneTimeBonus + referralEarnings;

  // Calculate total daily earnings
  const totalDailyEarnings = dailyBandwidthEarnings + totalReferralEarnings;

  // Calculate monthly earnings
  const monthlyEarnings = totalDailyEarnings * 30;

  return {
    dailyBandwidthEarnings: dailyBandwidthEarnings.toFixed(2),
    dailyReferralEarnings: totalReferralEarnings.toFixed(2),
    totalDailyEarnings: totalDailyEarnings.toFixed(2),
    monthlyEarnings: monthlyEarnings.toFixed(2),
    daysToMinPayout: Math.ceil(2.5 / totalDailyEarnings)
  };
};

// Example calculation for 2 devices running 12 hours with 3 referrals having 6 devices
const earnings = calculateEarnAppEarnings(2, 12, 3, 6);
console.log(\`Monthly earnings: $\${earnings.monthlyEarnings}\`);
console.log(\`Days to reach minimum payout: \${earnings.daysToMinPayout}\`);`;
  const faqItems = [
    {
      question: "What is EarnApp and how does it work?",
      answer: "EarnApp is a passive income application that pays you for sharing your unused internet bandwidth. The bandwidth is used by Bright Data (the parent company) for web intelligence, price comparison, ad verification, and other legitimate business purposes."
    },
    {
      question: "Is EarnApp safe and legitimate?",
      answer: "Yes, EarnApp is developed by Bright Data (formerly Luminati Networks), a well-established company in the web data collection industry. The app doesn't access your personal data or browsing history, and only uses your excess bandwidth."
    },
    {
      question: "How much can I earn with EarnApp?",
      answer: "Earnings vary based on your location, internet speed, and how many devices you use. On average, users earn between $10-25 per month with 2-3 devices running continuously. Users in the US, UK, and other high-demand countries tend to earn more."
    },
    {
      question: "Will EarnApp slow down my internet?",
      answer: "EarnApp is designed to use only your excess bandwidth, so most users don't notice any significant slowdown. The app includes settings to limit bandwidth usage if needed."
    },
    {
      question: "How do I get paid from EarnApp?",
      answer: "Once you reach the minimum payout threshold of $2.50, you can withdraw your earnings via PayPal or Amazon Gift Cards. Payments are typically processed within 24-48 hours."
    }
  ];
  return renderTemplate(_a || (_a = __template(["", " <script>\n  // Earnings calculator functionality\n  document.addEventListener('DOMContentLoaded', function() {\n    const calculateBtn = document.getElementById('calculate-btn');\n    const resultsDiv = document.getElementById('results');\n    const dailyEarningsEl = document.getElementById('daily-earnings');\n    const monthlyEarningsEl = document.getElementById('monthly-earnings');\n    const daysToPayoutEl = document.getElementById('days-to-payout');\n    const annualEarningsEl = document.getElementById('annual-earnings');\n\n    calculateBtn.addEventListener('click', function() {\n      const devices = parseInt(document.getElementById('devices').value) || 1;\n      const hours = parseInt(document.getElementById('hours').value) || 12;\n      const referrals = parseInt(document.getElementById('referrals').value) || 0;\n      const referralDevices = parseInt(document.getElementById('referral-devices').value) || 0;\n\n      // Base earnings: varies by location, average $0.10-0.25 per GB\n      // Average bandwidth usage: 10-15 MB per hour per device\n      const avgMbPerHour = 12; // 12 MB per hour average\n      const avgRatePerGb = 0.15; // $0.15 per GB average\n\n      // Calculate daily bandwidth earnings\n      const dailyMb = devices * hours * avgMbPerHour;\n      const dailyGb = dailyMb / 1024;\n      const dailyBandwidthEarnings = dailyGb * avgRatePerGb;\n\n      // Referral earnings\n      // $0.50 one-time bonus per device + 10% of earnings\n      const oneTimeBonus = referralDevices * 0.5 / 30; // Spread across a month\n      const avgReferralDailyEarning = 0.08; // $0.08 per day per referral device average\n      const referralEarnings = referralDevices * avgReferralDailyEarning * 0.1;\n      const totalReferralEarnings = oneTimeBonus + referralEarnings;\n\n      // Calculate total daily earnings\n      const totalDailyEarnings = dailyBandwidthEarnings + totalReferralEarnings;\n\n      // Calculate monthly and annual earnings\n      const monthlyEarnings = totalDailyEarnings * 30;\n      const annualEarnings = monthlyEarnings * 12;\n\n      // Calculate days to minimum payout\n      const daysToMinPayout = Math.ceil(2.5 / totalDailyEarnings);\n\n      // Update the UI\n      dailyEarningsEl.textContent = `$${totalDailyEarnings.toFixed(2)}`;\n      monthlyEarningsEl.textContent = `$${monthlyEarnings.toFixed(2)}`;\n      daysToPayoutEl.textContent = daysToMinPayout;\n      annualEarningsEl.textContent = `$${annualEarnings.toFixed(2)}`;\n\n      // Show results\n      resultsDiv.classList.remove('hidden');\n    });\n  });\n<\/script> <script src=\"/scripts/passive-income-particles.js\"><\/script>"], ["", " <script>\n  // Earnings calculator functionality\n  document.addEventListener('DOMContentLoaded', function() {\n    const calculateBtn = document.getElementById('calculate-btn');\n    const resultsDiv = document.getElementById('results');\n    const dailyEarningsEl = document.getElementById('daily-earnings');\n    const monthlyEarningsEl = document.getElementById('monthly-earnings');\n    const daysToPayoutEl = document.getElementById('days-to-payout');\n    const annualEarningsEl = document.getElementById('annual-earnings');\n\n    calculateBtn.addEventListener('click', function() {\n      const devices = parseInt(document.getElementById('devices').value) || 1;\n      const hours = parseInt(document.getElementById('hours').value) || 12;\n      const referrals = parseInt(document.getElementById('referrals').value) || 0;\n      const referralDevices = parseInt(document.getElementById('referral-devices').value) || 0;\n\n      // Base earnings: varies by location, average $0.10-0.25 per GB\n      // Average bandwidth usage: 10-15 MB per hour per device\n      const avgMbPerHour = 12; // 12 MB per hour average\n      const avgRatePerGb = 0.15; // $0.15 per GB average\n\n      // Calculate daily bandwidth earnings\n      const dailyMb = devices * hours * avgMbPerHour;\n      const dailyGb = dailyMb / 1024;\n      const dailyBandwidthEarnings = dailyGb * avgRatePerGb;\n\n      // Referral earnings\n      // $0.50 one-time bonus per device + 10% of earnings\n      const oneTimeBonus = referralDevices * 0.5 / 30; // Spread across a month\n      const avgReferralDailyEarning = 0.08; // $0.08 per day per referral device average\n      const referralEarnings = referralDevices * avgReferralDailyEarning * 0.1;\n      const totalReferralEarnings = oneTimeBonus + referralEarnings;\n\n      // Calculate total daily earnings\n      const totalDailyEarnings = dailyBandwidthEarnings + totalReferralEarnings;\n\n      // Calculate monthly and annual earnings\n      const monthlyEarnings = totalDailyEarnings * 30;\n      const annualEarnings = monthlyEarnings * 12;\n\n      // Calculate days to minimum payout\n      const daysToMinPayout = Math.ceil(2.5 / totalDailyEarnings);\n\n      // Update the UI\n      dailyEarningsEl.textContent = \\`$\\${totalDailyEarnings.toFixed(2)}\\`;\n      monthlyEarningsEl.textContent = \\`$\\${monthlyEarnings.toFixed(2)}\\`;\n      daysToPayoutEl.textContent = daysToMinPayout;\n      annualEarningsEl.textContent = \\`$\\${annualEarnings.toFixed(2)}\\`;\n\n      // Show results\n      resultsDiv.classList.remove('hidden');\n    });\n  });\n<\/script> <script src=\"/scripts/passive-income-particles.js\"><\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${appData.title} - Passive Income | NosytLabs`, "description": `Learn how to earn passive income with ${appData.title}. Complete guide with setup instructions, earnings potential, and tips.` }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-gradient-to-r from-primary-dark to-primary-main text-white py-20"> <!-- Particles background --> <div id="particles-enhanced" class="particles-enhanced absolute inset-0 z-0"></div> <div class="container mx-auto px-4 relative z-10"> <div class="flex flex-col md:flex-row items-center justify-between"> <div class="md:w-1/2 animate-fade-in"> <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">${appData.title}</h1> <p class="text-xl animate-slide-up" style="animation-delay: 0.2s;"> ${appData.description} </p> <div class="mt-8 flex flex-wrap gap-4"> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Sign Up Now
</a> <a href="#setup" class="inline-block bg-white text-primary hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
How to Set Up
</a> </div> </div> <div class="md:w-1/2 mt-8 md:mt-0 flex justify-center animate-fade-in" style="animation-delay: 0.3s;"> <img${addAttribute(appData.image, "src")}${addAttribute(appData.title, "alt")} class="rounded-lg shadow-2xl max-w-full h-auto" width="500" height="300"> </div> </div> </div> <!-- Decorative elements --> <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent z-0"></div> <div class="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/5 to-transparent z-0"></div> </div>  <section class="py-16 bg-white dark:bg-gray-900"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">About ${appData.title}</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"> <div> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">App Details</h3> <div class="space-y-3 text-gray-700 dark:text-gray-300"> <div class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"> <span class="font-medium">Category:</span> <span>${appData.category}</span> </div> <div class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"> <span class="font-medium">Monthly Earnings:</span> <span>${appData.monthlyEarnings}</span> </div> <div class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"> <span class="font-medium">Payment Methods:</span> <span>${appData.paymentMethods.join(", ")}</span> </div> <div class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"> <span class="font-medium">Minimum Payout:</span> <span>${appData.minPayout}</span> </div> <div class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"> <span class="font-medium">Platforms:</span> <span>${appData.platforms.join(", ")}</span> </div> <div class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"> <span class="font-medium">Setup Difficulty:</span> <span>${appData.setupDifficulty}</span> </div> <div class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"> <span class="font-medium">Resource Usage:</span> <span>${appData.resourceUsage}</span> </div> <div class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"> <span class="font-medium">Referral Program:</span> <span>${appData.referralProgram}</span> </div> </div> </div> <div> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pros & Cons</h3> <div class="mb-6"> <h4 class="font-medium text-green-600 dark:text-green-400 mb-2">Pros:</h4> <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"> ${pros.map((pro) => renderTemplate`<li>${pro}</li>`)} </ul> </div> <div> <h4 class="font-medium text-red-600 dark:text-red-400 mb-2">Cons:</h4> <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"> ${cons.map((con) => renderTemplate`<li>${con}</li>`)} </ul> </div> </div> </div> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">How ${appData.title} Works</h3> <p class="text-gray-700 dark:text-gray-300 mb-4">
EarnApp works by allowing you to share your unused internet bandwidth with Bright Data's network. This bandwidth is then used for various legitimate business purposes such as:
</p> <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4"> <li>Web intelligence gathering for businesses</li> <li>Price comparison and monitoring</li> <li>Ad verification and brand protection</li> <li>Market research and competitive analysis</li> </ul> <p class="text-gray-700 dark:text-gray-300">
The app runs in the background on your devices and only uses bandwidth that you're not actively using. You earn credits based on the amount of data shared, which can then be converted to cash once you reach the minimum payout threshold of just $2.50.
</p> </div> </div> ` })} </div> </section>  <section id="setup" class="py-16 bg-gray-50 dark:bg-gray-800"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">How to Set Up ${appData.title}</h2> <div class="space-y-12"> ${setupInstructions.map((instruction) => renderTemplate`<div class="flex flex-col md:flex-row gap-8 items-center"> <div class="md:w-1/2 order-2 md:order-1"> <div class="flex items-center mb-4"> <div class="bg-accent text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4"> ${instruction.step} </div> <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${instruction.title}</h3> </div> <p class="text-gray-700 dark:text-gray-300">${instruction.description}</p> </div> <div class="md:w-1/2 order-1 md:order-2"> <img${addAttribute(instruction.image, "src")}${addAttribute(`Step ${instruction.step}: ${instruction.title}`, "alt")} class="rounded-lg shadow-lg w-full h-auto"> </div> </div>`)} </div> <div class="mt-12 text-center"> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Sign Up for ${appData.title} </a> </div> </div> ` })} </div> </section>  <section class="py-16 bg-white dark:bg-gray-900"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Earnings Calculator</h2> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8"> ${renderComponent($$result3, "CodeDisplay", $$CodeDisplay, { "title": "earnapp-earnings-calculator.js", "language": "javascript", "code": earningsCalculatorCode, "dark": true, "showLineNumbers": true, "expandable": true, "theme": "tech" })} </div> <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Calculate Your Potential Earnings</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> <div> <label for="devices" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Your Devices</label> <input type="number" id="devices" min="1" max="10" value="2" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-accent focus:border-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"> </div> <div> <label for="hours" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hours Active Per Day</label> <input type="number" id="hours" min="1" max="24" value="12" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-accent focus:border-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"> </div> <div> <label for="referrals" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Referrals</label> <input type="number" id="referrals" min="0" max="100" value="0" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-accent focus:border-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"> </div> <div> <label for="referral-devices" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Referral Devices</label> <input type="number" id="referral-devices" min="0" max="100" value="0" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-accent focus:border-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"> </div> </div> <button id="calculate-btn" class="w-full bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded transition-colors">
Calculate Earnings
</button> <div id="results" class="mt-6 hidden"> <h4 class="font-medium text-gray-900 dark:text-white mb-3">Estimated Earnings</h4> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"> <div class="text-sm text-gray-500 dark:text-gray-400">Daily Earnings</div> <div class="text-2xl font-bold text-accent" id="daily-earnings">$0.00</div> </div> <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"> <div class="text-sm text-gray-500 dark:text-gray-400">Monthly Earnings</div> <div class="text-2xl font-bold text-accent" id="monthly-earnings">$0.00</div> </div> <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"> <div class="text-sm text-gray-500 dark:text-gray-400">Days to Minimum Payout</div> <div class="text-2xl font-bold text-gray-900 dark:text-white" id="days-to-payout">0</div> </div> <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"> <div class="text-sm text-gray-500 dark:text-gray-400">Annual Earnings</div> <div class="text-2xl font-bold text-gray-900 dark:text-white" id="annual-earnings">$0.00</div> </div> </div> </div> </div> </div> ` })} </div> </section>  <section class="py-16 bg-gray-50 dark:bg-gray-800"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Frequently Asked Questions</h2> <div class="space-y-6"> ${faqItems.map((item, index) => renderTemplate`<div class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">${item.question}</h3> <p class="text-gray-700 dark:text-gray-300">${item.answer}</p> </div>`)} </div> </div> ` })} </div> </section>  <section class="py-16 bg-accent text-white"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto text-center"> <h2 class="text-3xl font-bold mb-6">Start Earning with ${appData.title} Today</h2> <p class="text-xl mb-8">
Join thousands of users who are already earning passive income by sharing their unused internet bandwidth.
</p> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-white text-accent hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Sign Up Now
</a> <p class="mt-4 text-sm opacity-80">
By signing up through our link, you'll support NosytLabs at no extra cost to you.
</p> </div> ` })} </div> </section> ` }));
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/passive-income/earnapp.astro", void 0);
const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/passive-income/earnapp.astro";
const $$url = "/passive-income/earnapp.html";
export {
  $$Earnapp as default,
  $$file as file,
  $$url as url
};
