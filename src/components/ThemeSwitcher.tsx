import { Palette } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";
import { useState } from "react";

const themes: { id: Theme; label: string; swatch: string }[] = [
  { id: "midnight", label: "Midnight", swatch: "bg-gradient-to-br from-violet-500 to-blue-500" },
  { id: "cozy", label: "Cozy Night", swatch: "bg-gradient-to-br from-orange-400 to-pink-500" },
  { id: "cyber", label: "Cyberpunk Finals", swatch: "bg-gradient-to-br from-pink-500 to-cyan-400" },
  { id: "academia", label: "Soft Academia", swatch: "bg-gradient-to-br from-amber-200 to-stone-500" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass rounded-full p-2.5 hover:bg-white/10 transition-colors"
        aria-label="Switch theme"
      >
        <Palette className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 glass-strong rounded-2xl p-2 w-56 z-50">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pb-1">Theme</div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl text-sm hover:bg-white/5 ${
                theme === t.id ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span className={`size-5 rounded-full ${t.swatch}`} />
              {t.label}
              {theme === t.id && <span className="ml-auto text-acid">●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}