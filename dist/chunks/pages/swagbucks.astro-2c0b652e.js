/* empty css                              */import {a as createComponent,r as renderTemplate,f as renderComponent,m as maybeRenderHead,e as addAttribute}from'../astro-061ea033.js';import {$ as $$BaseLayout}from'./3d-printing.astro-bbf5f2c9.js';import {$ as $$AnimatedSection}from'./brave.astro-9f38c3b1.js';import {$ as $$CodeDisplay}from'./ai-tools-comparison-2025.astro-8c140a12.js';var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Swagbucks = createComponent(($$result, $$props, $$slots) => {
  const appData = {
    id: "swagbucks",
    title: "Swagbucks",
    description: "Earn rewards for shopping online, watching videos, taking surveys, and more. Swagbucks is one of the most popular reward sites.",
    image: "/images/passive-income/swagbucks.jpg",
    logo: "/images/passive-income/swagbucks-logo.png",
    category: "Rewards & Surveys",
    link: "https://www.swagbucks.com/p/register?rb=nosytlabs",
    monthlyEarnings: "$25-100",
    paymentMethods: ["PayPal", "Gift Cards"],
    platforms: ["Web", "Android", "iOS"],
    setupDifficulty: "Easy",
    resourceUsage: "N/A",
    minPayout: "$3 (300 SB)",
    referralProgram: "10% of referral earnings",
    founded: "2008",
    company: "Prodege, LLC",
    headquarters: "El Segundo, California",
    privacyPolicy: "https://www.swagbucks.com/privacy-policy-intl",
    earningMethods: [
      {
        name: "Surveys",
        description: "Complete online surveys about products, services, and brands",
        earnings: "$0.25-$5 per survey"
      },
      {
        name: "Shopping",
        description: "Earn cash back when shopping at partner retailers",
        earnings: "1-10% cash back"
      },
      {
        name: "Videos",
        description: "Watch short videos and advertisements",
        earnings: "$0.01-$0.05 per video"
      },
      {
        name: "Games",
        description: "Play games and earn rewards",
        earnings: "Varies by game"
      },
      {
        name: "Offers",
        description: "Complete special offers and sign up for services",
        earnings: "$1-$20+ per offer"
      }
    ]
  };
  const faqs = [
    {
      question: "What is Swagbucks and how does it work?",
      answer: "Swagbucks is a rewards and loyalty program that pays you for completing various online activities like taking surveys, watching videos, shopping online, playing games, and more. You earn points called SB which can be redeemed for gift cards or cash via PayPal."
    },
    {
      question: "How much can I earn with Swagbucks?",
      answer: "Earnings vary based on how much time you invest and which activities you complete. Most users earn between $25-100 per month. Surveys typically pay between $0.25-$5 each, while shopping can earn you 1-10% cash back. Some special offers can pay $20 or more."
    },
    {
      question: "Is Swagbucks legitimate?",
      answer: "Yes, Swagbucks is a legitimate company that has been operating since 2008. They've paid out over $646 million to members worldwide. Swagbucks is owned by Prodege, LLC, which also operates other reward sites like MyPoints and InboxDollars."
    },
    {
      question: "How do I get paid from Swagbucks?",
      answer: "You can redeem your SB points for gift cards to popular retailers like Amazon, Walmart, and Target, or get cash via PayPal. The minimum payout threshold is just $3 (300 SB) for some gift cards, making it one of the lowest in the industry. PayPal redemptions start at $5 (500 SB)."
    },
    {
      question: "How long does it take to receive payment?",
      answer: "Gift card delivery typically takes 1-2 business days after your first redemption, and can be even faster for subsequent redemptions. PayPal payments usually process within 1-3 business days. Your first redemption may take slightly longer as Swagbucks verifies your account."
    }
  ];
  const earningsCalculatorCode = `// Swagbucks Earnings Calculator
function calculateSwagbucksEarnings(activities) {
  // Define average earnings for different activities (in SB points)
  const earningRates = {
    surveys: {
      daily: 5,      // Number of surveys per day
      avgValue: 50   // Average SB per survey (50 SB = $0.50)
    },
    shopping: {
      monthly: 200,  // Monthly shopping amount in dollars
      cashback: 0.05 // Average 5% cash back
    },
    videos: {
      daily: 20,     // Number of videos watched per day
      avgValue: 2    // Average SB per video
    },
    games: {
      daily: 1,      // Hours spent playing games per day
      avgValue: 10   // Average SB per hour
    },
    offers: {
      monthly: 2,    // Number of offers completed per month
      avgValue: 200  // Average SB per offer
    }
  };

  // Calculate monthly earnings for each activity
  const surveyEarnings = activities.surveys ?
    earningRates.surveys.daily * earningRates.surveys.avgValue * 30 : 0;

  const shoppingEarnings = activities.shopping ?
    earningRates.shopping.monthly * earningRates.shopping.cashback * 100 : 0;

  const videoEarnings = activities.videos ?
    earningRates.videos.daily * earningRates.videos.avgValue * 30 : 0;

  const gameEarnings = activities.games ?
    earningRates.games.daily * earningRates.games.avgValue * 30 : 0;

  const offerEarnings = activities.offers ?
    earningRates.offers.monthly * earningRates.offers.avgValue : 0;

  // Calculate total SB and convert to dollars
  const totalSB = surveyEarnings + shoppingEarnings + videoEarnings +
                 gameEarnings + offerEarnings;
  const totalUSD = totalSB / 100; // 100 SB = $1

  return {
    surveyEarnings: surveyEarnings / 100,
    shoppingEarnings: shoppingEarnings / 100,
    videoEarnings: videoEarnings / 100,
    gameEarnings: gameEarnings / 100,
    offerEarnings: offerEarnings / 100,
    totalSB: totalSB,
    totalUSD: totalUSD.toFixed(2)
  };
}

// Example calculation with all activities enabled
const earnings = calculateSwagbucksEarnings({
  surveys: true,
  shopping: true,
  videos: true,
  games: true,
  offers: true
});

console.log(\`Total Monthly Earnings: $\${earnings.totalUSD}\`);
console.log(\`Total SB Points: \${earnings.totalSB}\`);`;
  return renderTemplate(_a || (_a = __template(["", ` <script>
  // Earnings calculator functionality
  document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-earnings');
    if (!calculateButton) return;

    calculateButton.addEventListener('click', function() {
      const activities = {
        surveys: document.getElementById('surveys').checked,
        shopping: document.getElementById('shopping').checked,
        videos: document.getElementById('videos').checked,
        games: document.getElementById('games').checked,
        offers: document.getElementById('offers').checked
      };

      // Define average earnings for different activities (in SB points)
      const earningRates = {
        surveys: {
          daily: 5,      // Number of surveys per day
          avgValue: 50   // Average SB per survey (50 SB = $0.50)
        },
        shopping: {
          monthly: 200,  // Monthly shopping amount in dollars
          cashback: 0.05 // Average 5% cash back
        },
        videos: {
          daily: 20,     // Number of videos watched per day
          avgValue: 2    // Average SB per video
        },
        games: {
          daily: 1,      // Hours spent playing games per day
          avgValue: 10   // Average SB per hour
        },
        offers: {
          monthly: 2,    // Number of offers completed per month
          avgValue: 200  // Average SB per offer
        }
      };

      // Calculate monthly earnings for each activity
      const surveyEarnings = activities.surveys ?
        earningRates.surveys.daily * earningRates.surveys.avgValue * 30 : 0;

      const shoppingEarnings = activities.shopping ?
        earningRates.shopping.monthly * earningRates.shopping.cashback * 100 : 0;

      const videoEarnings = activities.videos ?
        earningRates.videos.daily * earningRates.videos.avgValue * 30 : 0;

      const gameEarnings = activities.games ?
        earningRates.games.daily * earningRates.games.avgValue * 30 : 0;

      const offerEarnings = activities.offers ?
        earningRates.offers.monthly * earningRates.offers.avgValue : 0;

      // Calculate total SB and convert to dollars
      const totalSB = surveyEarnings + shoppingEarnings + videoEarnings +
                     gameEarnings + offerEarnings;
      const totalUSD = totalSB / 100; // 100 SB = $1

      // Display results
      const resultsDiv = document.getElementById('earnings-result');
      const breakdownDiv = document.getElementById('earnings-breakdown');
      const totalEarningsSpan = document.getElementById('total-earnings');

      breakdownDiv.innerHTML = '';

      if (activities.surveys) {
        breakdownDiv.innerHTML += \`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Surveys:</span>
          <span class="text-gray-900 dark:text-white">$\${(surveyEarnings / 100).toFixed(2)}</span>
        </div>\`;
      }

      if (activities.shopping) {
        breakdownDiv.innerHTML += \`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Shopping:</span>
          <span class="text-gray-900 dark:text-white">$\${(shoppingEarnings / 100).toFixed(2)}</span>
        </div>\`;
      }

      if (activities.videos) {
        breakdownDiv.innerHTML += \`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Videos:</span>
          <span class="text-gray-900 dark:text-white">$\${(videoEarnings / 100).toFixed(2)}</span>
        </div>\`;
      }

      if (activities.games) {
        breakdownDiv.innerHTML += \`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Games:</span>
          <span class="text-gray-900 dark:text-white">$\${(gameEarnings / 100).toFixed(2)}</span>
        </div>\`;
      }

      if (activities.offers) {
        breakdownDiv.innerHTML += \`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Offers:</span>
          <span class="text-gray-900 dark:text-white">$\${(offerEarnings / 100).toFixed(2)}</span>
        </div>\`;
      }

      totalEarningsSpan.textContent = \`$\${totalUSD.toFixed(2)} (\${totalSB} SB)\`;
      resultsDiv.classList.remove('hidden');
    });
  });
<\/script> <script src="/scripts/passive-income-particles.js"><\/script>`], ["", ` <script>
  // Earnings calculator functionality
  document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-earnings');
    if (!calculateButton) return;

    calculateButton.addEventListener('click', function() {
      const activities = {
        surveys: document.getElementById('surveys').checked,
        shopping: document.getElementById('shopping').checked,
        videos: document.getElementById('videos').checked,
        games: document.getElementById('games').checked,
        offers: document.getElementById('offers').checked
      };

      // Define average earnings for different activities (in SB points)
      const earningRates = {
        surveys: {
          daily: 5,      // Number of surveys per day
          avgValue: 50   // Average SB per survey (50 SB = $0.50)
        },
        shopping: {
          monthly: 200,  // Monthly shopping amount in dollars
          cashback: 0.05 // Average 5% cash back
        },
        videos: {
          daily: 20,     // Number of videos watched per day
          avgValue: 2    // Average SB per video
        },
        games: {
          daily: 1,      // Hours spent playing games per day
          avgValue: 10   // Average SB per hour
        },
        offers: {
          monthly: 2,    // Number of offers completed per month
          avgValue: 200  // Average SB per offer
        }
      };

      // Calculate monthly earnings for each activity
      const surveyEarnings = activities.surveys ?
        earningRates.surveys.daily * earningRates.surveys.avgValue * 30 : 0;

      const shoppingEarnings = activities.shopping ?
        earningRates.shopping.monthly * earningRates.shopping.cashback * 100 : 0;

      const videoEarnings = activities.videos ?
        earningRates.videos.daily * earningRates.videos.avgValue * 30 : 0;

      const gameEarnings = activities.games ?
        earningRates.games.daily * earningRates.games.avgValue * 30 : 0;

      const offerEarnings = activities.offers ?
        earningRates.offers.monthly * earningRates.offers.avgValue : 0;

      // Calculate total SB and convert to dollars
      const totalSB = surveyEarnings + shoppingEarnings + videoEarnings +
                     gameEarnings + offerEarnings;
      const totalUSD = totalSB / 100; // 100 SB = $1

      // Display results
      const resultsDiv = document.getElementById('earnings-result');
      const breakdownDiv = document.getElementById('earnings-breakdown');
      const totalEarningsSpan = document.getElementById('total-earnings');

      breakdownDiv.innerHTML = '';

      if (activities.surveys) {
        breakdownDiv.innerHTML += \\\`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Surveys:</span>
          <span class="text-gray-900 dark:text-white">$\\\${(surveyEarnings / 100).toFixed(2)}</span>
        </div>\\\`;
      }

      if (activities.shopping) {
        breakdownDiv.innerHTML += \\\`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Shopping:</span>
          <span class="text-gray-900 dark:text-white">$\\\${(shoppingEarnings / 100).toFixed(2)}</span>
        </div>\\\`;
      }

      if (activities.videos) {
        breakdownDiv.innerHTML += \\\`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Videos:</span>
          <span class="text-gray-900 dark:text-white">$\\\${(videoEarnings / 100).toFixed(2)}</span>
        </div>\\\`;
      }

      if (activities.games) {
        breakdownDiv.innerHTML += \\\`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Games:</span>
          <span class="text-gray-900 dark:text-white">$\\\${(gameEarnings / 100).toFixed(2)}</span>
        </div>\\\`;
      }

      if (activities.offers) {
        breakdownDiv.innerHTML += \\\`<div class="flex justify-between">
          <span class="text-gray-700 dark:text-gray-300">Offers:</span>
          <span class="text-gray-900 dark:text-white">$\\\${(offerEarnings / 100).toFixed(2)}</span>
        </div>\\\`;
      }

      totalEarningsSpan.textContent = \\\`$\\\${totalUSD.toFixed(2)} (\\\${totalSB} SB)\\\`;
      resultsDiv.classList.remove('hidden');
    });
  });
<\/script> <script src="/scripts/passive-income-particles.js"><\/script>`])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${appData.title} - Passive Income | NosytLabs`, "description": `Learn how to earn rewards with ${appData.title}. Complete guide with earning methods, payment options, and tips.` }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-gradient-to-r from-primary-dark to-primary-main text-white py-20"> <!-- Particles background --> <div id="particles-enhanced" class="particles-enhanced absolute inset-0 z-0"></div> <div class="container mx-auto px-4 relative z-10"> <div class="flex flex-col md:flex-row items-center justify-between"> <div class="md:w-1/2 animate-fade-in"> <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">${appData.title}</h1> <p class="text-xl animate-slide-up" style="animation-delay: 0.2s;"> ${appData.description} </p> <div class="mt-8 flex flex-wrap gap-4"> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Sign Up Now
</a> <a href="#earning-methods" class="inline-block bg-white text-primary hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Earning Methods
</a> </div> </div> <div class="md:w-1/2 mt-8 md:mt-0 flex justify-center animate-fade-in" style="animation-delay: 0.3s;"> <img${addAttribute(appData.image, "src")}${addAttribute(appData.title, "alt")} class="rounded-lg shadow-2xl max-w-full h-auto" width="500" height="300"> </div> </div> </div> <!-- Decorative elements --> <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent z-0"></div> <div class="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/5 to-transparent z-0"></div> </div>  <section class="py-16 bg-white dark:bg-gray-900"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">About ${appData.title}</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">App Details</h3> <div class="space-y-3 text-gray-700 dark:text-gray-300"> <div class="flex justify-between"> <span class="font-medium">Category:</span> <span>${appData.category}</span> </div> <div class="flex justify-between"> <span class="font-medium">Monthly Earnings:</span> <span>${appData.monthlyEarnings}</span> </div> <div class="flex justify-between"> <span class="font-medium">Payment Methods:</span> <span>${appData.paymentMethods.join(", ")}</span> </div> <div class="flex justify-between"> <span class="font-medium">Minimum Payout:</span> <span>${appData.minPayout}</span> </div> <div class="flex justify-between"> <span class="font-medium">Platforms:</span> <span>${appData.platforms.join(", ")}</span> </div> <div class="flex justify-between"> <span class="font-medium">Setup Difficulty:</span> <span>${appData.setupDifficulty}</span> </div> <div class="flex justify-between"> <span class="font-medium">Referral Program:</span> <span>${appData.referralProgram}</span> </div> </div> </div> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pros & Cons</h3> <div class="mb-4"> <h4 class="font-medium text-green-600 dark:text-green-400 mb-2">Pros:</h4> <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"> <li>Multiple ways to earn rewards</li> <li>Low minimum payout threshold ($3)</li> <li>Wide variety of gift card options</li> <li>PayPal cash option available</li> <li>Mobile apps for earning on the go</li> <li>Daily bonuses and special promotions</li> <li>Established company with good track record</li> </ul> </div> <div> <h4 class="font-medium text-red-600 dark:text-red-400 mb-2">Cons:</h4> <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"> <li>Survey disqualifications can be frustrating</li> <li>Some activities have low earning rates</li> <li>Time investment required for meaningful earnings</li> <li>Not available in all countries</li> <li>Some offers require purchases or subscriptions</li> </ul> </div> </div> </div> <div class="mt-8"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">How ${appData.title} Works</h3> <p class="text-gray-700 dark:text-gray-300 mb-4">
Swagbucks is a rewards platform that pays you for completing various online activities. You earn points called SB, which can be redeemed for gift cards or cash via PayPal. The platform partners with market research companies, advertisers, and retailers to provide earning opportunities.
</p> <p class="text-gray-700 dark:text-gray-300">
With over $646 million paid to members worldwide, Swagbucks is one of the most established rewards sites. The platform is free to join and offers multiple ways to earn, making it suitable for anyone looking to make some extra money in their spare time.
</p> </div> </div> ` })} </div> </section>  <section id="earning-methods" class="py-16 bg-gray-50 dark:bg-gray-800"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Ways to Earn with ${appData.title}</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> ${appData.earningMethods.map((method, index) => renderTemplate`<div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"> <div class="p-4 bg-primary text-white"> <h3 class="text-xl font-semibold">${method.name}</h3> </div> <div class="p-6"> <p class="text-gray-700 dark:text-gray-300 mb-4">${method.description}</p> <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"> <span class="font-medium text-accent">Typical earnings: </span> <span class="text-gray-700 dark:text-gray-300">${method.earnings}</span> </div> </div> </div>`)} </div> <div class="mt-8 text-center"> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Sign Up for ${appData.title} </a> </div> </div> ` })} </div> </section>  <section class="py-16 bg-white dark:bg-gray-900"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Earnings Calculator</h2> <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8"> ${renderComponent($$result3, "CodeDisplay", $$CodeDisplay, { "title": "swagbucks-earnings-calculator.js", "language": "javascript", "code": earningsCalculatorCode, "dark": true, "showLineNumbers": true, "expandable": true, "theme": "tech" })} </div> <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Calculate Your Potential Earnings</h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"> <div class="flex items-center"> <input type="checkbox" id="surveys" checked class="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"> <label for="surveys" class="ml-2 text-gray-700 dark:text-gray-300">Take Surveys</label> </div> <div class="flex items-center"> <input type="checkbox" id="shopping" checked class="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"> <label for="shopping" class="ml-2 text-gray-700 dark:text-gray-300">Shop Online</label> </div> <div class="flex items-center"> <input type="checkbox" id="videos" checked class="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"> <label for="videos" class="ml-2 text-gray-700 dark:text-gray-300">Watch Videos</label> </div> <div class="flex items-center"> <input type="checkbox" id="games" checked class="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"> <label for="games" class="ml-2 text-gray-700 dark:text-gray-300">Play Games</label> </div> <div class="flex items-center"> <input type="checkbox" id="offers" checked class="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"> <label for="offers" class="ml-2 text-gray-700 dark:text-gray-300">Complete Offers</label> </div> </div> <button id="calculate-earnings" class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-lg transition-colors">
Calculate Earnings
</button> <div id="earnings-result" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hidden"> <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Estimated Monthly Earnings</h4> <div id="earnings-breakdown" class="space-y-2"></div> <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"> <div class="flex justify-between font-bold"> <span class="text-gray-900 dark:text-white">Total:</span> <span id="total-earnings" class="text-accent"></span> </div> </div> </div> </div> </div> ` })} </div> </section>  <section class="py-16 bg-gray-50 dark:bg-gray-800"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Frequently Asked Questions</h2> <div class="space-y-6"> ${faqs.map((faq) => renderTemplate`<div class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700"> <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">${faq.question}</h3> <p class="text-gray-700 dark:text-gray-300">${faq.answer}</p> </div>`)} </div> </div> ` })} </div> </section>  <section class="py-16 bg-accent text-white"> <div class="container mx-auto px-4"> ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl mx-auto text-center"> <h2 class="text-3xl font-bold mb-6">Start Earning with ${appData.title} Today</h2> <p class="text-xl mb-8">
Join millions of users who are already earning rewards by taking surveys, shopping online, and more.
</p> <a${addAttribute(appData.link, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-white text-accent hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
Sign Up Now
</a> <p class="mt-4 text-sm opacity-80">
By signing up through our link, you'll support NosytLabs at no extra cost to you.
</p> </div> ` })} </div> </section> ` }));
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/passive-income/swagbucks.astro", void 0);

const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/passive-income/swagbucks.astro";
const $$url = "/passive-income/swagbucks.html";export{$$Swagbucks as default,$$file as file,$$url as url};