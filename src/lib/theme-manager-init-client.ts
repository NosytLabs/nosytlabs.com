import { initThemeManagement } from "./theme-manager.ts";

try {
  initThemeManagement?.();
} catch (error) {
  console.warn("Theme manager initialization failed:", error);
}
