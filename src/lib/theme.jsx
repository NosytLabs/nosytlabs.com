import { createContext, useContext, useState, useEffect } from "react";

export const themes = ["light", "dark", "system"];
export const themeStorageKey = "vite-ui-theme";

const initialState = {
  theme: "system",
  setTheme: (theme) => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setThemeState] = useState(
    () => {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(storageKey) || defaultTheme;
      }
      return defaultTheme;
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      // Check if we're in a browser environment before accessing localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(storageKey, newTheme);
      }
      setThemeState(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};