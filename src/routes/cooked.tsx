import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { initialCourses, computeGPA } from "@/lib/mock-data";
import { useLocalState } from "@/lib/storage";
import { motion } from "framer-motion";
import { Flame, RefreshCw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/cooked")({
  head: () => ({ meta: [{ title: "How Cooked Am I? · Rate My Semester" }, { name: "description", content: "Funny AI-style semester analysis with a survival percentage and motivational roast." }] }),
  component: CookedPage,
});

const ROASTS = [
  "You're basically toast, but there's a 4% chance you clutch.",
  "If panic was a credit, you'd be on the Dean's List.",
  "Your future self is begging you to open the textbook.",
  "Survivable. Barely. Like a 7-year-old microwave.",
  "Locked in like the library on a Sunday morning.",
];

const TIPS = [
  "Delete TikTok for 48 hours. You can reinstall after the exam.",
  "Two 50-minute focus blocks > five hours of doomscrolling.",
  "Sleep is a study tool. Stop optimizing it away.",
  "Email the TA today. Future-you will weep with gratitude.",
];

function CookedPage() {
  const [courses] = useLocalState("rms.courses", initialCourses);
  const [seed, setSeed] = useState(0);

  const { survival, roast, tip, breakdown } = useMemo(() => {
    const gpa = computeGPA(courses);
    const avgStress = courses.reduce((s,c)=>s+c.stress,0)/courses.length;
    const avgLoad = courses.reduce((s,c)=>s+c.workload,0)/courses.length;
    const gpaScore = (gpa/4)*100;
    const survival = Math.round(Math.max(2, Math.min(98, gpaScore*0.6 + (100-avgStress)*0.2 + (100-avgLoad)*0.2)));
    return {
      survival,
      roast: ROASTS[(seed+survival) % ROASTS.length],
      tip: TIPS[(seed+1) % TIPS.length],
      breakdown: [
        { l: "GPA momentum", v: Math.round(gpaScore), color: "brand" },
        { l: "Stress", v: Math.round(avgStress), color: "stress", invert: true },
        { l: "Workload", v: Math.round(avgLoad), color: "warning", invert: true },
        { l: "Sleep est.", v: 62, color: "acid" },
      ],
    };
  }, [courses, seed]);

  const tone = survival > 75 ? { l: "Locked in", c: "acid" } : survival > 50 ? { l: "Manageable", c: "warning" } : survival > 25 ? { l: "Cooking", c: "warning" } : { l: "Cooked", c: "stress" };

  return (
    <AppShell>
      <PageHeader eyebrow="Reality Check" title="So… how cooked are we?" subtitle="A brutally honest, slightly funny AI verdict based on your current semester." />

      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-stress/15 via-transparent to-brand/15 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stress">
              <Flame className="size-3.5" /> Verdict
            </div>
            <motion.h2 key={roast} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-display italic text-3xl md:text-4xl leading-tight">"{roast}"</motion.h2>

            <div className="mt-6 flex items-baseline gap-3">
              <motion.span key={survival} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="text-7xl font-display italic" style={{ color: `var(--${tone.c})` }}>
                {survival}%
              </motion.span>
              <span className="text-muted-foreground">survival probability</span>
            </div>
            <div className="mt-3 h-3 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${survival}%` }} transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }}
                className="h-full" style={{ background: `linear-gradient(90deg, var(--stress), var(--warning), var(--acid))` }} />
            </div>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest" style={{ color: `var(--${tone.c})` }}>
              Status · {tone.l}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => setSeed((s) => s + 1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-glow hover:scale-[1.03] transition-transform">
                <RefreshCw className="size-4" /> Re-roast me
              </button>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
                <Sparkles className="size-4 text-acid" /> {tip}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[10px] font-bold uppercase tracking-widest text-acid mb-3">Breakdown</div>
          <div className="space-y-3">
            {breakdown.map((b) => {
              const v = b.invert ? 100 - b.v : b.v;
              return (
                <div key={b.l}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{b.l}</span>
                    <span className="font-mono font-bold" style={{ color: `var(--${b.color})` }}>{b.v}{b.invert?"":""}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.9 }} className="h-full" style={{ background: `var(--${b.color})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-warning mb-3">Meme reactions</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { e: "😎", t: "Locked in" },
              { e: "😬", t: "Cooking" },
              { e: "🥲", t: "Send help" },
              { e: "💀", t: "It's over" },
            ].map((m) => (
              <motion.button whileHover={{ y: -2 }} key={m.t} className="glass-strong rounded-2xl p-4 flex items-center gap-3">
                <span className="text-3xl">{m.e}</span>
                <span className="text-sm font-medium">{m.t}</span>
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}