import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Flame, Calculator, BarChart3, ArrowRight, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rate My Semester — Your GPA, minus the anxiety" },
      { name: "description", content: "Premium student productivity suite. Track GPA, predict finals, plan study, and find out how cooked you actually are." },
      { property: "og:title", content: "Rate My Semester" },
      { property: "og:description", content: "Track GPA, predict finals, plan study, and find out how cooked you actually are." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* blobs */}
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand/25 blur-[140px] animate-blob" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/15 blur-[120px] animate-blob [animation-delay:3s]" />
        <div className="absolute bottom-[5%] left-[30%] w-[35%] h-[35%] rounded-full bg-stress/10 blur-[120px] animate-blob [animation-delay:6s]" />
      </div>

      {/* nav */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-display italic text-xl shadow-glow">R</div>
            <span className="font-semibold tracking-tight text-lg">Rate My Semester</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#cooked" className="hover:text-foreground transition-colors">How Cooked?</a>
            <a href="#loved" className="hover:text-foreground transition-colors">Students</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="px-4 py-2 text-sm font-medium glass rounded-full hover:bg-white/10 transition-colors">
              Demo semester
            </Link>
            <Link to="/dashboard" className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full shadow-glow hover:scale-[1.03] transition-transform">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-14 items-center">
        <div className="space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold tracking-widest uppercase text-brand"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full size-2 bg-brand" />
            </span>
            Beta · Finals season
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="text-5xl md:text-7xl font-display italic leading-[1.02] gradient-text"
          >
            Stop guessing,<br/>start <span className="text-primary not-italic font-display">conquering.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-lg leading-relaxed"
          >
            The student productivity suite that feels like a supportive friend.
            Track your GPA, simulate your finals, and stay <span className="text-acid font-medium">locked in</span> when it matters most.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            <Link to="/dashboard" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.03] transition-transform">
              Launch demo semester <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/cooked" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl glass font-semibold hover:bg-white/10 transition-colors">
              <Flame className="size-4 text-stress" /> How cooked am I?
            </Link>
          </motion.div>

          <div className="flex items-center gap-6 pt-4 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {["from-violet-400 to-blue-500","from-rose-400 to-amber-400","from-emerald-400 to-cyan-400","from-fuchsia-400 to-pink-500"].map((g, i) => (
                <div key={i} className={`size-7 rounded-full bg-gradient-to-br ${g} border-2 border-background`} />
              ))}
            </div>
            <span>Joined by <span className="text-foreground font-semibold">50,000+</span> students this semester</span>
          </div>
        </div>

        {/* preview */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
            className="relative animate-float-y"
          >
            <div className="absolute -inset-6 rounded-[3rem] bg-brand/30 blur-3xl opacity-60" />
            <div className="relative glass-strong rounded-[2rem] p-7 ring-glow">
              <div className="flex items-center justify-between mb-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Status</p>
                  <h2 className="text-3xl font-display italic text-acid">Locked In</h2>
                </div>
                <div className="relative size-20 rounded-full grid place-items-center">
                  <svg className="-rotate-90 absolute inset-0" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" stroke="color-mix(in oklab, var(--brand) 25%, transparent)" strokeWidth="8" fill="none" />
                    <motion.circle
                      cx="50" cy="50" r="44" stroke="var(--brand)" strokeWidth="8" fill="none" strokeLinecap="round"
                      strokeDasharray={2*Math.PI*44}
                      initial={{ strokeDashoffset: 2*Math.PI*44 }}
                      animate={{ strokeDashoffset: 2*Math.PI*44 * (1 - 0.92) }}
                      transition={{ duration: 1.6, ease: [0.16,1,0.3,1] }}
                      style={{ filter: "drop-shadow(0 0 10px var(--brand))" }}
                    />
                  </svg>
                  <span className="relative text-lg font-bold">3.92</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Advanced Calculus", glyph: "Σ", color: "stress", status: "82% Cooked", note: "Next exam: 2d", w: "w-4/5" },
                  { name: "Intro to Ethics", glyph: "Φ", color: "acid", status: "Chilling", note: "Next exam: 12d", w: "w-1/4" },
                  { name: "Data Structures", glyph: "{}", color: "brand", status: "On track", note: "Project: 3d", w: "w-3/5" },
                ].map((c) => (
                  <div key={c.name} className="p-3.5 bg-white/5 rounded-2xl border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl grid place-items-center text-sm font-bold`} style={{ background: `color-mix(in oklab, var(--${c.color}) 18%, transparent)`, color: `var(--${c.color})` }}>{c.glyph}</div>
                      <div>
                        <p className="text-sm font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.note}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: `var(--${c.color})` }}>{c.status}</p>
                      <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                        <div className={`${c.w} h-full`} style={{ background: `var(--${c.color})` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-border flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Burnout Risk</p>
                  <p className="text-lg font-medium">Moderate</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="size-3.5 text-warning" />
                  <span className="font-mono text-warning">14 day streak</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* floating chips */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="absolute -bottom-6 -right-4 glass-strong rounded-3xl p-4 rotate-6 animate-float-y shadow-glow"
          >
            <p className="text-[10px] uppercase text-muted-foreground font-bold">Streak</p>
            <p className="text-3xl font-display italic">14</p>
            <p className="text-[10px] text-acid">Days strong</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="absolute -top-4 -left-4 glass-strong rounded-2xl px-3 py-2 -rotate-6"
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Predicted</div>
            <div className="text-sm font-semibold text-acid">+0.18 GPA</div>
          </motion.div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: Calculator, title: "Smart GPA Tracking", body: "Real-time calculations that predict your final grade before you even take the test. No more 3 AM spreadsheets.", color: "brand" },
          { icon: Flame, title: "The 'Cooked' Meter", body: "Brutally honest AI-style feedback on your current workload. Part roast, part motivator, fully addictive.", color: "stress" },
          { icon: BarChart3, title: "Visual Analytics", body: "Beautiful charts showing burnout trends, study efficiency, grade distribution, and what-if simulations.", color: "acid" },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }}
            whileHover={{ y: -4 }}
            className="glass p-8 rounded-[2rem] hover:bg-white/5 transition-colors"
          >
            <div className="size-12 rounded-2xl grid place-items-center mb-5"
              style={{ background: `color-mix(in oklab, var(--${f.color}) 18%, transparent)`, color: `var(--${f.color})` }}>
              <f.icon className="size-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.body}</p>
          </motion.div>
        ))}
      </section>

      {/* cooked teaser */}
      <section id="cooked" className="max-w-7xl mx-auto px-6 py-20">
        <div className="p-[1px] rounded-[3rem] bg-gradient-to-br from-brand/50 via-accent/40 to-stress/40">
          <div className="rounded-[3rem] bg-background/80 backdrop-blur-2xl p-12 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold tracking-widest uppercase text-stress">
                <Flame className="size-3" /> AI Verdict
              </div>
              <h2 className="text-4xl md:text-5xl font-display italic leading-tight">"You're basically toast, but there's a 4% chance you clutch."</h2>
              <p className="text-muted-foreground">Our model analyzes your syllabus, current trajectory, sleep schedule, and assignment weightage to give you a survival percentage. With memes.</p>
              <Link to="/cooked" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stress text-white font-semibold hover:scale-[1.03] transition-transform shadow-xl shadow-stress/30">
                Find out my fate <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="glass-strong rounded-3xl p-7">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Survival Probability</span>
                <span className="text-3xl font-bold text-stress">22%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: "22%" }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="h-full bg-gradient-to-r from-stress to-warning" />
              </div>
              <p className="mt-5 text-xs italic text-muted-foreground">Recommendation: 3 espressos, delete TikTok for 48h, befriend a TA.</p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { l: "Sleep", v: "4.2h" },
                  { l: "Workload", v: "Heavy" },
                  { l: "Stress", v: "82%" },
                ].map(s => (
                  <div key={s.l} className="glass rounded-xl p-3">
                    <div className="text-[10px] uppercase text-muted-foreground">{s.l}</div>
                    <div className="font-semibold mt-0.5">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section id="loved" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold tracking-widest uppercase text-acid">
            <Sparkles className="size-3" /> Loved by stressed students
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-display italic gradient-text">Receipts from the trenches</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { q: "I wasn't cooked, I was medium-well. Finished the essay.", n: "Sarah J. · UCLA" },
            { q: "Actually aesthetic. I don't feel like I'm doing taxes anymore.", n: "Marcus T. · NYU" },
            { q: "The GPA ring is Duolingo for my entire future.", n: "Elena R. · UofT" },
            { q: "Replaced 4 spreadsheets and 2 panic attacks.", n: "David L. · GT" },
          ].map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }}
              className="glass p-6 rounded-2xl"
            >
              <p className="text-sm italic mb-4">"{t.q}"</p>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">— {t.n}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-border py-12 px-6 mt-12 text-center">
        <p className="text-muted-foreground text-sm">Made for the sleep-deprived by the sleep-deprived.</p>
      </footer>
    </div>
  );
}