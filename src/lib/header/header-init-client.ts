// Use a relative import to ensure Vite resolves this correctly in dev and prod
import { initializeHeader } from "../header-enhancer.ts";

try {
  initializeHeader();
} catch (error) {
  console.warn("Header enhancer initialization failed:", error);
}
