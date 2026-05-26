import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { ProgressRing } from "@/components/ProgressRing";
import { initialCourses, computeGPA, gradePoint, neededOnFinal } from "@/lib/mock-data";
import { useLocalState } from "@/lib/storage";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Target, BookOpen } from "lucide-react";

export const Route = createFileRoute("/gpa")({
  head: () => ({ meta: [{ title: "GPA Lab · Rate My Semester" }, { name: "description", content: "Semester GPA, cumulative GPA, target GPA and final-exam-needed calculators." }] }),
  component: GpaPage,
});

type Row = { id: string; name: string; credits: number; grade: number };

function GpaPage() {
  const [courses] = useLocalState("rms.courses", initialCourses);
  const semGpa = computeGPA(courses);

  const [prevGpa, setPrevGpa] = useLocalState("rms.prevGpa", 3.62);
  const [prevCredits, setPrevCredits] = useLocalState("rms.prevCredits", 60);

  const semCredits = courses.reduce((s, c) => s + c.credits, 0);
  const cumulative = useMemo(() =>
    (prevGpa * prevCredits + semGpa * semCredits) / (prevCredits + semCredits),
  [prevGpa, prevCredits, semGpa, semCredits]);

  const [target, setTarget] = useLocalState("rms.target", 3.85);
  const neededSem = ((target * (prevCredits + semCredits)) - (prevGpa * prevCredits)) / semCredits;

  // Final calculator
  const [course, setCourse] = useState(courses[0].id);
  const [current, setCurrent] = useState(courses[0].current);
  const [weight, setWeight] = useState(courses[0].finalWeight);
  const [want, setWant] = useState(90);
  const final = neededOnFinal(current, weight, want);

  return (
    <AppShell>
      <PageHeader eyebrow="GPA Lab" title="Run the numbers without the tears." subtitle="Live recalculations across every scenario. No formulas to memorize." />

      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand">
            <Calculator className="size-3.5" /> Semester GPA
          </div>
          <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center mt-4">
            <ProgressRing value={(semGpa/4)*100} label={semGpa.toFixed(2)} sub="This semester" size={170} />
            <div className="space-y-2">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
                  <div className="size-8 rounded-lg grid place-items-center text-xs font-bold" style={{ background: `color-mix(in oklab, var(--${c.color}) 18%, transparent)`, color: `var(--${c.color})` }}>{c.glyph}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{c.credits} credits · {c.current}%</div>
                  </div>
                  <div className="text-sm font-mono font-semibold">{gradePoint(c.current).toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-acid">
            <BookOpen className="size-3.5" /> Cumulative GPA
          </div>
          <div className="mt-4 space-y-3">
            <NumField label="Previous GPA" value={prevGpa} step={0.01} onChange={setPrevGpa} max={4} />
            <NumField label="Previous credits" value={prevCredits} step={1} onChange={setPrevCredits} max={500} />
          </div>
          <div className="mt-5 glass-strong rounded-2xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">New cumulative</div>
            <motion.div key={cumulative} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-display italic brand-gradient-text mt-1">
              {cumulative.toFixed(3)}
            </motion.div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-warning">
            <Target className="size-3.5" /> Target GPA Predictor
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">I want cumulative</span>
              <span className="font-semibold text-warning">{target.toFixed(2)}</span>
            </div>
            <input type="range" min={1} max={4} step={0.01} value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full accent-[color:var(--warning)]" />
          </div>
          <div className="mt-5 glass-strong rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">You need this semester</div>
            <div className="mt-1 text-3xl font-semibold" style={{ color: `var(--${neededSem <= 4 ? "acid" : "stress"})` }}>
              {neededSem.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {neededSem > 4 ? "Mathematically out of reach this semester — adjust target." :
               neededSem <= semGpa ? "You're already there. Keep coasting." : "Tight but doable. Pick two key courses."}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stress">
            <Calculator className="size-3.5" /> Final Exam Score Needed
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="block">
                <div className="text-xs text-muted-foreground mb-1">Course</div>
                <select value={course}
                  onChange={(e) => { const c = courses.find(x=>x.id===e.target.value)!; setCourse(c.id); setCurrent(c.current); setWeight(c.finalWeight); }}
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm bg-transparent">
                  {courses.map(c => <option key={c.id} value={c.id} className="bg-popover">{c.name}</option>)}
                </select>
              </label>
              <NumField label="Current grade %" value={current} step={1} onChange={setCurrent} max={100} />
              <NumField label="Final exam weight %" value={weight} step={1} onChange={setWeight} max={100} />
              <NumField label="Target final grade %" value={want} step={1} onChange={setWant} max={100} />
            </div>
            <div className="glass-strong rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">You need on the final</div>
              <motion.div key={final.toFixed(1)} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-7xl font-display italic mt-2" style={{ color: `var(--${final > 100 ? "stress" : final < 50 ? "acid" : "warning"})` }}>
                {final.toFixed(1)}%
              </motion.div>
              <p className="text-sm text-muted-foreground mt-3 max-w-xs">
                {final > 100 ? "Impossible. Negotiate extra credit or recalibrate the target." :
                 final < 0 ? "You already have it locked. Show up and breathe." :
                 final < 60 ? "Cake. Don't get cocky." :
                 final < 85 ? "Definitely possible with solid prep." : "Will require real effort. Schedule study blocks now."}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}

function NumField({ label, value, step, onChange, max }: { label: string; value: number; step: number; onChange: (n: number) => void; max: number }) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <input
        type="number" value={value} step={step} max={max} min={0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full glass rounded-xl px-3 py-2.5 text-sm bg-transparent"
      />
    </label>
  );
}