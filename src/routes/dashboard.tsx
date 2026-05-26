import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { ProgressRing } from "@/components/ProgressRing";
import { initialCourses, initialAssignments, computeGPA, predictedGPA, gpaTrend } from "@/lib/mock-data";
import { useLocalState } from "@/lib/storage";
import { motion } from "framer-motion";
import { Sparkles, Flame, Clock, BookOpen, Zap, ArrowRight, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Rate My Semester" }, { name: "description", content: "Your current GPA, predicted GPA, study hours, streaks and reminders at a glance." }] }),
  component: Dashboard,
});

function statusFromGpa(g: number) {
  if (g >= 3.85) return { label: "Locked In", color: "acid" };
  if (g >= 3.4) return { label: "On Track", color: "brand" };
  if (g >= 2.8) return { label: "Wobbly", color: "warning" };
  return { label: "Cooked", color: "stress" };
}

function Dashboard() {
  const [courses] = useLocalState("rms.courses", initialCourses);
  const [assignments] = useLocalState("rms.assignments", initialAssignments);
  const [studyHours] = useLocalState("rms.studyHours", 18);
  const [streak] = useLocalState("rms.streak", 14);

  const gpa = computeGPA(courses);
  const predicted = predictedGPA(courses);
  const status = statusFromGpa(predicted);
  const credits = courses.reduce((s, c) => s + c.credits, 0);
  const upcoming = assignments
    .filter((a) => a.status !== "done")
    .sort((a, b) => +new Date(a.due) - +new Date(b.due))
    .slice(0, 4);

  const [greet, setGreet] = useState("Welcome back");
  useEffect(() => {
    const h = new Date().getHours();
    setGreet(h < 5 ? "Still up?" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  function celebrate() {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.3 },
      colors: ["#8b5cf6", "#2dd4bf", "#f43f5e", "#fbbf24"],
    });
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${greet}, Alex`}
        title={`Your semester is ${status.label.toLowerCase()}.`}
        subtitle="A snapshot of your grades, your finals trajectory, and what you need to do this week."
      />

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        {/* GPA hero */}
        <GlassCard className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 size-48 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative">
              <ProgressRing value={(gpa/4)*100} label={gpa.toFixed(2)} sub="Current GPA" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest" style={{ color: `var(--${status.color})` }}>
                {status.label}
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Predicted GPA</div>
                  <div className="text-3xl font-semibold text-acid">{predicted.toFixed(2)}</div>
                </div>
                <button onClick={celebrate} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-glow hover:scale-[1.03] transition-transform">
                  <Sparkles className="size-3.5" /> Celebrate
                </button>
              </div>
              <div className="h-32 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gpaTrend}>
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" hide />
                    <YAxis hide domain={[2.8, 4]} />
                    <Tooltip
                      contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: "var(--muted-foreground)" }}
                    />
                    <Area type="monotone" dataKey="gpa" stroke="var(--brand)" strokeWidth={2.5} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-5">
          <StatCard icon={Clock} label="Study this week" value={`${studyHours}h`} color="brand" />
          <StatCard icon={GraduationCap} label="Credits" value={`${credits}`} color="acid" />
          <StatCard icon={Zap} label="Streak" value={`${streak}🔥`} color="warning" />
          <StatCard icon={Flame} label="Burnout" value="67%" color="stress" />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Upcoming reminders</h3>
            <Link to="/assignments" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>
          </div>
          <div className="space-y-2">
            {upcoming.map((a, i) => {
              const due = new Date(a.due);
              const days = Math.ceil((+due - Date.now()) / 86400000);
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05*i }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-border hover:bg-white/10 transition-colors"
                >
                  <div className={`size-10 rounded-xl grid place-items-center text-xs font-bold`} style={{ background: `color-mix(in oklab, var(--${a.priority === "high" ? "stress" : a.priority === "med" ? "warning" : "acid"}) 20%, transparent)`, color: `var(--${a.priority === "high" ? "stress" : a.priority === "med" ? "warning" : "acid"})` }}>
                    {days <= 0 ? "!" : `${days}d`}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.course} · weight {a.weight}%</div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{due.toLocaleDateString(undefined,{month:"short",day:"numeric"})}</span>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-acid/15 via-transparent to-brand/15 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-acid">
              <Sparkles className="size-3" /> AI nudge
            </div>
            <p className="mt-3 font-display italic text-2xl leading-tight">
              "You're 0.08 GPA away from Dean's List. One good MATH 251 final flips it."
            </p>
            <div className="mt-5 space-y-2">
              <Suggestion icon={BookOpen} text="Schedule 2× 50-min calc sessions this week." />
              <Suggestion icon={Clock} text="Move CHEM lab review before Thursday." />
              <Suggestion icon={Zap} text="Sleep 7h to keep the streak alive." />
            </div>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; value: string; color: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl p-4 relative overflow-hidden">
      <Icon className="size-4 mb-3" style={{ color: `var(--${color})` }} />
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-0.5">{value}</div>
    </motion.div>
  );
}

function Suggestion({ icon: Icon, text }: { icon: React.ComponentType<{className?: string}>; text: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-foreground/90">
      <Icon className="size-4 text-acid mt-0.5 shrink-0" />
      <span>{text}</span>
    </div>
  );
}