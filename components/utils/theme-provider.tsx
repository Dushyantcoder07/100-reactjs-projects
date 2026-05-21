"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme?: Theme;
  forcedTheme?: Theme;
  resolvedTheme?: "light" | "dark";
  systemTheme?: "light" | "dark";
  themes: Theme[];
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getResolvedTheme(theme: Theme | undefined): "light" | "dark" {
  if (theme === "system" || !theme) {
    return getSystemTheme();
  }

  return theme;
}

function applyTheme(theme: Theme, attribute: "class" | `data-${string}`) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const resolvedTheme = getResolvedTheme(theme);

  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  } else {
    root.setAttribute(attribute, resolvedTheme);
  }

  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
  forcedTheme,
  attribute = "class",
}: React.PropsWithChildren<{
  defaultTheme?: Theme;
  enableSystem?: boolean;
  storageKey?: string;
  forcedTheme?: Theme;
  attribute?: "class" | `data-${string}`;
}>) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") {
      return forcedTheme ?? defaultTheme;
    }

    const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
    return forcedTheme ?? storedTheme ?? defaultTheme;
  });

  const resolvedTheme = React.useMemo(() => {
    if (!enableSystem) {
      return theme === "system" ? "light" : theme;
    }

    return getResolvedTheme(theme);
  }, [enableSystem, theme]);

  React.useEffect(() => {
    const nextTheme = forcedTheme ?? theme;

    if (typeof window !== "undefined") {
      if (!forcedTheme) {
        window.localStorage.setItem(storageKey, nextTheme);
      }

      if (enableSystem && nextTheme === "system") {
        applyTheme(getSystemTheme(), attribute);
      } else {
        applyTheme(nextTheme, attribute);
      }
    }
  }, [attribute, enableSystem, forcedTheme, storageKey, theme]);

  React.useEffect(() => {
    if (!enableSystem || forcedTheme || theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system", attribute);

    mediaQuery.addEventListener?.("change", handleChange);
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, [attribute, enableSystem, forcedTheme, theme]);

  const setTheme = React.useCallback<React.Dispatch<React.SetStateAction<string>>>(
    (value) => {
      if (forcedTheme) {
        return;
      }

      setThemeState((currentTheme) => {
        const nextTheme = typeof value === "function" ? value(currentTheme) : value;
        return nextTheme as Theme;
      });
    },
    [forcedTheme],
  );

  const contextValue = React.useMemo<ThemeContextValue>(
    () => ({
      theme: forcedTheme ?? theme,
      forcedTheme,
      resolvedTheme,
      systemTheme: getSystemTheme(),
      themes: enableSystem ? ["light", "dark", "system"] : ["light", "dark"],
      setTheme,
    }),
    [enableSystem, forcedTheme, resolvedTheme, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
