/**
 * SEO Keywords database for NOSYT Labs services
 * Used for GEO (Generative Engine Optimization) and traditional SEO
 */

export const SERVICE_SEO_KEYWORDS = {
  "web-development": {
    primary: "web development",
    secondary: [
      "custom website design",
      "web applications",
      "responsive websites",
      "Astro development",
      "React websites",
      "small business websites",
    ],
    intent: "commercial",
    searchVolume: "high",
    competitiveness: "high",
  },
  "ai-agents": {
    primary: "AI agents for business",
    secondary: [
      "autonomous agents",
      "business automation",
      "workflow automation",
      "Claude agents",
      "Gemini agents",
      "process automation",
    ],
    intent: "commercial",
    searchVolume: "high",
    competitiveness: "medium",
  },
  "ai-chatbots": {
    primary: "AI chatbot development",
    secondary: [
      "customer support chatbot",
      "ChatGPT chatbot",
      "AI customer service",
      "conversational AI",
      "support automation",
    ],
    intent: "commercial",
    searchVolume: "high",
    competitiveness: "high",
  },
  "ai-integration": {
    primary: "AI integration services",
    secondary: [
      "ChatGPT API integration",
      "Claude integration",
      "business automation",
      "AI workflow automation",
      "LLM integration",
    ],
    intent: "commercial",
    searchVolume: "medium",
    competitiveness: "medium",
  },
  "web3-blockchain": {
    primary: "Web3 blockchain development",
    secondary: [
      "smart contract development",
      "Solana development",
      "blockchain integration",
      "cryptocurrency services",
      "NFT development",
    ],
    intent: "commercial",
    searchVolume: "medium",
    competitiveness: "medium",
  },
  "mobile-app": {
    primary: "mobile app development",
    secondary: [
      "React Native development",
      "iOS app development",
      "Android app development",
      "cross-platform mobile",
    ],
    intent: "commercial",
    searchVolume: "high",
    competitiveness: "high",
  },
  "3d-printing": {
    primary: "3D printing services",
    secondary: [
      "custom 3D printing",
      "3D printing prototypes",
      "Creality printing",
      "3D part manufacturing",
    ],
    intent: "transactional",
    searchVolume: "low",
    competitiveness: "low",
  },
};

export const GEO_OPTIMIZATION_CHECKLIST = [
  "✅ Meta title includes primary keyword + brand",
  "✅ Meta description compelling with benefits",
  "✅ H1 uses primary keyword naturally",
  "✅ H2/H3 use secondary keywords and questions",
  "✅ Service schema with pricing and description",
  "✅ FAQ schema with 5-8 common questions",
  "✅ Include original data/statistics",
  "✅ Author bio with credentials",
  "✅ Internal links to related services",
  "✅ Conversational language for AI parsing",
  "✅ Clear CTA button for contact/inquiry",
  "✅ Mobile-optimized and fast loading",
];

export const BACKLINK_STRATEGY = {
  phase1: {
    week: 1,
    action: "Submit to 10+ free high-DA sites",
    expectedBacklinks: 10,
    sites: [
      "WordPress.com (DA 94)",
      "Medium.com (DA 92)",
      "LinkedIn (DA 98)",
      "GitHub (DA 94)",
      "Yelp (DA 93)",
    ],
  },
  phase2: {
    week: 2,
    action: "Guest posts + digital PR",
    expectedBacklinks: 3,
    sites: ["Dev.to", "Hashnode", "Tech news outlets"],
  },
  phase3: {
    week: 3,
    action: "HARO/Featured responses + partnerships",
    expectedBacklinks: 2,
    sites: ["HARO (featured.com)", "Industry partnerships"],
  },
  phase4: {
    week: 4,
    action: "Community engagement + shareable content",
    expectedBacklinks: 3,
    sites: ["Reddit", "Tech forums", "Community links"],
  },
};

export const LOCAL_SEO_CHECKLIST = [
  "✅ Google Business Profile claimed and complete",
  "✅ 20+ geo-tagged photos uploaded",
  "✅ NAP (name, address, phone) consistent everywhere",
  "✅ Service area pages created for major cities",
  "✅ Local keywords in title/description",
  "✅ Reviews and ratings visible and encouraged",
  "✅ Business hours and contact info prominent",
  "✅ Yelp and local directory listings updated",
];
