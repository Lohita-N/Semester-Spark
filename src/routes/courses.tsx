import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { ProgressRing } from "@/components/ProgressRing";
import { initialCourses, neededOnFinal, type Course } from "@/lib/mock-data";
import { useLocalState } from "@/lib/storage";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Flame, Brain } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({ meta: [{ title: "Courses · Rate My Semester" }, { name: "description", content: "Expandable course cards with grade rings, finals predictions, and stress meters." }] }),
  component: CoursesPage,
});

function CoursesPage() {
  const [courses, setCourses] = useLocalState<Course[]>("rms.courses", initialCourses);
  const [openId, setOpenId] = useState<string | null>(initialCourses[0].id);

  function update(id: string, patch: Partial<Course>) {
    setCourses(courses.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Course Lab" title="Where every grade lives." subtitle="Tap a card to simulate final exam outcomes and see what you need to hit your target." />
      <div className="grid lg:grid-cols-2 gap-5">
        {courses.map((c, i) => {
          const open = openId === c.id;
          const need = neededOnFinal(c.current, c.finalWeight, c.target);
          const safe = need <= 100 && need >= 0;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.04 }}
              className="glass rounded-3xl overflow-hidden"
            >
              <button onClick={() => setOpenId(open ? null : c.id)} className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/5 transition-colors">
                <div className="size-14 rounded-2xl grid place-items-center text-lg font-bold" style={{ background: `color-mix(in oklab, var(--${c.color}) 18%, transparent)`, color: `var(--${c.color})` }}>{c.glyph}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">{c.code}</span>
                    <span className="text-[10px] text-muted-foreground">· {c.credits} cr</span>
                  </div>
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${c.current}%` }} transition={{ duration: 1 }} className="h-full" style={{ background: `var(--${c.color})` }} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold">{c.current}%</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Current</div>
                </div>
                <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 grid md:grid-cols-2 gap-5 border-t border-border pt-5">
                      <div className="flex items-center gap-5">
                        <ProgressRing value={c.current} label={`${c.current}%`} sub="So far" size={130} color={`var(--${c.color})`} />
                        <div className="space-y-3 flex-1">
                          <Meter label="Stress" value={c.stress} color="stress" icon={Flame} />
                          <Meter label="Workload" value={c.workload} color="warning" icon={Brain} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <SliderRow
                          label="Target grade" value={c.target} suffix="%"
                          onChange={(v) => update(c.id, { target: v })}
                          color={c.color}
                        />
                        <SliderRow
                          label="Final exam weight" value={c.finalWeight} suffix="%"
                          onChange={(v) => update(c.id, { finalWeight: v })}
                          color="brand"
                        />
                        <div className="glass-strong rounded-2xl p-4">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">To hit {c.target}% you need</div>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-3xl font-semibold" style={{ color: `var(--${safe ? "acid" : "stress"})` }}>
                              {need.toFixed(1)}%
                            </span>
                            <span className="text-xs text-muted-foreground">on the final</span>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {safe ? "Totally achievable. Just lock in." : need > 100 ? "Mathematically impossible. Recalibrate the target." : "Easy money. Show up."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}

function Meter({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.ComponentType<{className?: string}> }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="flex items-center gap-1.5 text-muted-foreground"><Icon className="size-3.5" />{label}</span>
        <span className="font-mono font-bold" style={{ color: `var(--${color})` }}>{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9 }} className="h-full" style={{ background: `var(--${color})` }} />
      </div>
    </div>
  );
}

function SliderRow({ label, value, suffix = "", onChange, color }: { label: string; value: number; suffix?: string; onChange: (v: number) => void; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold" style={{ color: `var(--${color})` }}>{value}{suffix}</span>
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[color:var(--brand)]"
      />
    </div>
  );
}