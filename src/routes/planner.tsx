import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { useLocalState } from "@/lib/storage";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Flame, Zap, Brain } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Planner · Rate My Semester" }, { name: "description", content: "Weekly planner, pomodoro timer, study streaks, and focus mode." }] }),
  component: PlannerPage,
});

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const BLOCKS = ["Morning","Midday","Evening","Night"];

type Plan = Record<string, string>; // `${day}-${block}` => task

function PlannerPage() {
  const [plan, setPlan] = useLocalState<Plan>("rms.plan", {
    "Mon-Morning": "Calc problem set",
    "Mon-Evening": "Data structures lab",
    "Tue-Midday": "Ethics reading",
    "Wed-Morning": "Chem review",
    "Thu-Evening": "Literature draft",
    "Fri-Night": "Friends 🫶",
    "Sat-Morning": "Practice exam",
    "Sun-Evening": "Weekly review",
  });

  const [streak, setStreak] = useLocalState("rms.streak", 14);
  const [studyHours, setStudyHours] = useLocalState("rms.studyHours", 18);

  return (
    <AppShell>
      <PageHeader eyebrow="Planner" title="A week that feels possible." subtitle="Plan study blocks, run focus sessions, and protect your streak." />

      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">This week</h3>
            <div className="text-xs text-muted-foreground">Click a cell to edit</div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[700px] grid grid-cols-[80px_repeat(7,1fr)] gap-2 text-xs">
              <div />
              {DAYS.map(d => <div key={d} className="text-center text-muted-foreground font-mono uppercase tracking-widest text-[10px]">{d}</div>)}
              {BLOCKS.map((b) => (
                <FragmentRow key={b} block={b} plan={plan} setPlan={setPlan} />
              ))}
            </div>
          </div>
        </GlassCard>

        <Pomodoro onComplete={() => { setStreak(streak+1); setStudyHours(studyHours+0.5); }} />

        <GlassCard>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-warning"><Zap className="size-3.5" /> Streak</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-6xl font-display italic">{streak}</span>
            <span className="text-muted-foreground">days</span>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 21 }).map((_, i) => {
              const lit = i < streak;
              return <div key={i} className={`h-6 rounded-md ${lit ? "bg-warning shadow-[0_0_10px_var(--warning)]" : "bg-white/10"}`} />;
            })}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-acid"><Brain className="size-3.5" /> Focus mode</div>
          <p className="mt-2 text-muted-foreground text-sm">When the timer is running, hide everything else. One task, one ring, one breath.</p>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            {[
              { l: "Sessions today", v: "4" },
              { l: "Study this week", v: `${studyHours}h` },
              { l: "Avg focus score", v: "82%" },
            ].map(s => (
              <div key={s.l} className="glass-strong rounded-2xl p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
                <div className="text-2xl font-semibold mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}

function Pomodoro({ onComplete }: { onComplete: () => void }) {
  const TOTAL = 25 * 60;
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) { setRunning(false); onComplete(); return TOTAL; }
        return l - 1;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const m = Math.floor(left/60).toString().padStart(2,"0");
  const s = (left%60).toString().padStart(2,"0");
  const pct = ((TOTAL - left) / TOTAL) * 100;

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute -inset-20 bg-brand/20 blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand"><Flame className="size-3.5" /> Pomodoro</div>
        <div className="mt-4 flex flex-col items-center">
          <div className="relative size-44">
            <svg className="-rotate-90 absolute inset-0" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="color-mix(in oklab, var(--foreground) 12%, transparent)" strokeWidth="6" fill="none" />
              <motion.circle
                cx="50" cy="50" r="44" stroke="var(--brand)" strokeWidth="6" fill="none" strokeLinecap="round"
                strokeDasharray={2*Math.PI*44}
                animate={{ strokeDashoffset: 2*Math.PI*44 * (1 - pct/100) }}
                style={{ filter: "drop-shadow(0 0 8px var(--brand))" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-display italic text-5xl tabular-nums">{m}:{s}</div>
          </div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-glow hover:scale-[1.03] transition-transform">
              {running ? <><Pause className="size-4" /> Pause</> : <><Play className="size-4" /> Start</>}
            </button>
            <button onClick={() => { setRunning(false); setLeft(TOTAL); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass text-sm hover:bg-white/10">
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function FragmentRow({ block, plan, setPlan }: { block: string; plan: Plan; setPlan: (p: Plan) => void }) {
  return (
    <>
      <div className="text-muted-foreground font-mono uppercase tracking-widest text-[10px] flex items-center">{block}</div>
      {DAYS.map((d) => {
        const key = `${d}-${block}`;
        return (
          <input
            key={key}
            value={plan[key] || ""}
            onChange={(e) => setPlan({ ...plan, [key]: e.target.value })}
            placeholder="—"
            className="bg-white/5 hover:bg-white/10 focus:bg-white/15 border border-border rounded-xl px-2 py-3 text-xs outline-none transition-colors text-center"
          />
        );
      })}
    </>
  );
}