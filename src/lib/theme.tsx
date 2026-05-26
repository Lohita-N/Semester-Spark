import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "midnight" | "academia" | "cyber" | "cozy";

const themeClass: Record<Theme, string> = {
  midnight: "",
  academia: "theme-academia",
  cyber: "theme-cyber",
  cozy: "theme-cozy",
};

type Ctx = { theme: Theme; setTheme: (t: Theme) => void };
const ThemeCtx = createContext<Ctx>({ theme: "midnight", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("midnight");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rms.theme") as Theme | null;
      if (raw && raw in themeClass) setTheme(raw);
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    Object.values(themeClass).forEach((c) => c && root.classList.remove(c));
    const cls = themeClass[theme];
    if (cls) root.classList.add(cls);
    try { localStorage.setItem("rms.theme", theme); } catch {}
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);