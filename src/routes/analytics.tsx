import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Scatter, ScatterChart, Tooltip, XAxis, YAxis
} from "recharts";
import { burnoutTrend, gpaTrend, gradeDist, initialCourses, studyVsGpa } from "@/lib/mock-data";
import { useLocalState } from "@/lib/storage";
import { Brain, Flame, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Rate My Semester" }, { name: "description", content: "GPA trend, burnout, workload, study vs GPA, and AI-style insights." }] }),
  component: AnalyticsPage,
});

const tooltipStyle = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 };

function AnalyticsPage() {
  const [courses] = useLocalState("rms.courses", initialCourses);
  const workload = courses.map((c) => ({ name: c.code, workload: c.workload, stress: c.stress }));
  const burnoutNow = burnoutTrend.at(-1)!.burnout;

  return (
    <AppShell>
      <PageHeader eyebrow="Analytics" title="Patterns your future self will thank you for." subtitle="The behind-the-scenes signal in your semester." />

      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2">
          <Head icon={TrendingUp} label="GPA Trend" tint="brand" />
          <div className="h-64 mt-2">
            <ResponsiveContainer>
              <AreaChart data={gpaTrend}>
                <defs>
                  <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis domain={[2.5, 4]} stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="gpa" stroke="var(--brand)" strokeWidth={2.5} fill="url(#ga)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <Head icon={Flame} label="Burnout Meter" tint="stress" />
          <div className="mt-3 text-center">
            <div className="text-6xl font-display italic" style={{ color: "var(--stress)" }}>{burnoutNow}%</div>
            <div className="text-xs text-muted-foreground mt-1">Above your 4-week average</div>
          </div>
          <div className="h-32 mt-3">
            <ResponsiveContainer>
              <LineChart data={burnoutTrend}>
                <XAxis dataKey="week" hide /><YAxis hide />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="burnout" stroke="var(--stress)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <Head icon={Brain} label="Grade Distribution" tint="acid" />
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={gradeDist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={4}>
                  {gradeDist.map((g, i) => <Cell key={i} fill={g.fill} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 text-xs">
            {gradeDist.map(g => (
              <div key={g.name} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: g.fill }} />
                <span className="text-muted-foreground">{g.name}</span>
                <span className="font-semibold">{g.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <Head icon={Brain} label="Workload by course" tint="warning" />
          <div className="h-64 mt-2">
            <ResponsiveContainer>
              <BarChart data={workload}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="workload" fill="var(--warning)" radius={[6,6,0,0]} />
                <Bar dataKey="stress" fill="var(--stress)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <Head icon={TrendingUp} label="Study hours vs GPA" tint="brand" />
          <div className="h-64 mt-2">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="hours" name="hours" stroke="var(--muted-foreground)" fontSize={11} unit="h" />
                <YAxis dataKey="gpa" name="gpa" stroke="var(--muted-foreground)" fontSize={11} domain={[2.8, 4]} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={studyVsGpa} fill="var(--brand)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-acid/15 via-transparent to-brand/15 pointer-events-none" />
          <div className="relative">
            <Head icon={Sparkles} label="AI insights" tint="acid" />
            <ul className="mt-3 space-y-3 text-sm">
              {[
                "Your GPA spikes every week you log 20h+ of study. Lock that habit.",
                "Stress correlates 0.74 with CHEM 105 lab weeks — front-load that work.",
                "Skipping Sunday review drops weekly GPA by ~0.06. Worth 30 minutes.",
              ].map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="size-1.5 rounded-full bg-acid mt-2 shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}

function Head({ icon: Icon, label, tint }: { icon: React.ComponentType<{className?: string}>; label: string; tint: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: `var(--${tint})` }}>
      <Icon className="size-3.5" /> {label}
    </div>
  );
}