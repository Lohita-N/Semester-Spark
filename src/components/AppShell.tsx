import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Calculator, BarChart3, ListTodo,
  Timer, Flame, Sparkles, Menu, X
} from "lucide-react";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/gpa", label: "GPA Lab", icon: Calculator },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/assignments", label: "Tasks", icon: ListTodo },
  { to: "/planner", label: "Planner", icon: Timer },
  { to: "/cooked", label: "Cooked?", icon: Flame },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* background blobs */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[55%] h-[55%] rounded-full bg-brand/25 blur-[140px] animate-blob" />
        <div className="absolute top-[30%] -right-[10%] w-[45%] h-[45%] rounded-full bg-accent/15 blur-[140px] animate-blob [animation-delay:3s]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-stress/10 blur-[140px] animate-blob [animation-delay:6s]" />
      </div>

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 p-4 z-40">
        <div className="glass rounded-3xl w-full p-4 flex flex-col">
          <Link to="/" className="flex items-center gap-2 px-3 py-2">
            <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-display italic text-xl shadow-glow">R</div>
            <div>
              <div className="font-semibold tracking-tight leading-none">Rate My</div>
              <div className="font-display italic text-sm leading-tight brand-gradient-text">Semester</div>
            </div>
          </Link>

          <nav className="mt-6 flex-1 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = path === to;
              return (
                <Link key={to} to={to} className="block group">
                  <motion.div
                    whileHover={{ x: 2 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/15 text-foreground ring-1 ring-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                    {active && (
                      <motion.span layoutId="navdot" className="ml-auto size-1.5 rounded-full bg-primary" />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 glass-strong rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-acid">
              <Sparkles className="size-3.5" /> Daily nudge
            </div>
            <p className="mt-2 text-sm text-foreground/90 leading-snug">
              Two hours of focused work beats six hours of half-scrolling.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 glass border-b border-border px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display italic">R</div>
          <span className="font-semibold tracking-tight">Rate My Semester</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button onClick={() => setOpen((o) => !o)} className="p-2 rounded-lg hover:bg-white/5">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-x-3 top-16 z-50 glass-strong rounded-2xl p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                  active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="size-4" /> {label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Desktop theme switcher */}
      <div className="hidden lg:flex fixed top-4 right-6 z-40">
        <ThemeSwitcher />
      </div>

      <main className="lg:pl-64 px-4 lg:px-8 py-6 lg:py-10 max-w-[1400px] mx-auto">
        {children}
      </main>
    </div>
  );
}