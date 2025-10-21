import {
  Sprint,
  LandingPage,
  AiIntegration,
  Performance,
  UiUxDesign,
  Integration,
  Debug,
  Consulting,
  WebDevelopment,
  Ecommerce,
  MobileApp,
  Search,
  PenTool,
  Code,
  Rocket,
  Brain,
} from "./index";

export const serviceIcons = {
  sprint: Sprint,
  "landing-page": LandingPage,
  "ai-integration": AiIntegration,
  "ai-consulting": AiIntegration, // AI consulting uses AI integration icon
  performance: Performance,
  "ui-ux-design": UiUxDesign,
  integration: Integration,
  debug: Debug,
  consulting: Consulting,
  "web-development": WebDevelopment,
  ecommerce: Ecommerce,
  "mobile-app": MobileApp,
  search: Search,
  "pen-tool": PenTool,
  code: Code,
  rocket: Rocket,
  globe: Brain, // Using Brain as fallback for globe
  brain: Brain,
  smartphone: MobileApp, // Using MobileApp as fallback for smartphone
  palette: UiUxDesign, // Using UiUxDesign as fallback for palette
  "shopping-cart": Ecommerce, // Using Ecommerce as fallback for shopping-cart
  "message-circle": Consulting, // Using Consulting as fallback for message-circle
  "default-icon": Brain,
};
