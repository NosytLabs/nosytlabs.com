import { initThemeManagement } from "@shared-utils/theme";

try {
  initThemeManagement?.();
} catch (error) {
  console.warn("Theme manager initialization failed:", error);
}
