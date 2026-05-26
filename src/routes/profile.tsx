import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { useTheme, type Theme } from "@/lib/theme";
import { useLocalState } from "@/lib/storage";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · Rate My Semester" }, { name: "description", content: "Customize themes, choose your mascot, and tweak your study persona." }] }),
  component: ProfilePage,
});

const themes: { id: Theme; label: string; desc: string; swatch: string }[] = [
  { id: "midnight", label: "Midnight Glass", desc: "Violet & teal · the default vibe", swatch: "from-violet-500 to-blue-500" },
  { id: "cozy", label: "Cozy Night", desc: "Warm amber + pink dusk tones", swatch: "from-orange-400 to-pink-500" },
  { id: "cyber", label: "Cyberpunk Finals", desc: "Hot pink + cyan for the all-nighter", swatch: "from-pink-500 to-cyan-400" },
  { id: "academia", label: "Soft Academia", desc: "Parchment, sage, serifs galore", swatch: "from-amber-200 to-stone-500" },
];

const mascots = ["🦝","🦊","🐸","🐙","🦉","🐱"];

function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useLocalState("rms.name", "Alex");
  const [mascot, setMascot] = useLocalState("rms.mascot", "🦊");

  return (
    <AppShell>
      <PageHeader eyebrow="Profile" title={`Hey, ${name}.`} subtitle="Make the app look the way your brain wants it to." />

      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-2"><Sparkles className="size-3.5" /> Themes</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {themes.map((t) => (
              <motion.button
                key={t.id} whileHover={{ y: -2 }}
                onClick={() => setTheme(t.id)}
                className={`text-left glass-strong rounded-2xl p-4 border ${theme === t.id ? "border-primary ring-2 ring-primary/40" : "border-border"}`}
              >
                <div className={`h-20 rounded-xl bg-gradient-to-br ${t.swatch}`} />
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                  </div>
                  {theme === t.id && <span className="text-acid text-xs">Active</span>}
                </div>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[10px] font-bold uppercase tracking-widest text-acid mb-3">Identity</div>
          <label className="block">
            <div className="text-xs text-muted-foreground mb-1">Display name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full glass rounded-xl px-3 py-2.5 text-sm bg-transparent" />
          </label>

          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-2">Mascot</div>
            <div className="grid grid-cols-6 gap-2">
              {mascots.map((m) => (
                <button key={m}
                  onClick={() => setMascot(m)}
                  className={`aspect-square text-2xl glass-strong rounded-xl ${mascot === m ? "ring-2 ring-primary" : ""}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 glass-strong rounded-2xl p-4 flex items-center gap-3">
            <span className="text-4xl">{mascot}</span>
            <div className="text-sm">
              <div className="font-semibold">{mascot === "🦝" ? "Trash panda mode" : mascot === "🦉" ? "Nightowl mode" : "Loyal study buddy"}</div>
              <div className="text-xs text-muted-foreground">Reacts to your streaks and exam days.</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}