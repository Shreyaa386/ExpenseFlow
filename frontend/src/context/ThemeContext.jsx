import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const getSystemTheme = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Theme preference: "light" | "dark" | "system"
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch (e) {
      console.error(e);
    }
    return "system";
  });

  // Effective/Resolved theme applied to DOM: "light" | "dark"
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    try {
      const initialPref = localStorage.getItem("theme") || "system";
      if (initialPref === "system") {
        return typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return initialPref;
    } catch {
      return "light";
    }
  });

  // Helper to apply theme classes & attributes to document element
  const applyThemeToDOM = useCallback((resolved) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.setAttribute("data-theme", resolved);
    root.style.colorScheme = resolved;
  }, []);

  // Immediate update handler
  const setTheme = useCallback(
    (newTheme) => {
      if (!["light", "dark", "system"].includes(newTheme)) return;

      setThemeState(newTheme);
      try {
        localStorage.setItem("theme", newTheme);
      } catch (e) {
        console.error(e);
      }

      const nextResolved = newTheme === "system" ? getSystemTheme() : newTheme;
      setResolvedTheme(nextResolved);
      applyThemeToDOM(nextResolved);
    },
    [getSystemTheme, applyThemeToDOM]
  );

  // Sync on initial mount & whenever theme preference changes
  useEffect(() => {
    const nextResolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(nextResolved);
    applyThemeToDOM(nextResolved);
  }, [theme, getSystemTheme, applyThemeToDOM]);

  // Listen to OS theme changes if and only if theme === "system"
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleMediaChange = (e) => {
      // Respect explicit user choice: do NOT override if theme is "dark" or "light"
      if (theme === "system") {
        const nextResolved = e.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        applyThemeToDOM(nextResolved);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, [theme, applyThemeToDOM]);

  // Sync with user profile / auth events
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail && ["light", "dark", "system"].includes(e.detail)) {
        setTheme(e.detail);
      }
    };

    const handleStorage = (e) => {
      if (e.key === "theme" && e.newValue) {
        if (["light", "dark", "system"].includes(e.newValue)) {
          setTheme(e.newValue);
        }
      }
    };

    window.addEventListener("expenseflow-theme-sync", handleSync);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("expenseflow-theme-sync", handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, [setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        isDark: resolvedTheme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);