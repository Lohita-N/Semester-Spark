import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { initialAssignments, type Assignment } from "@/lib/mock-data";
import { useLocalState } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/assignments")({
  head: () => ({ meta: [{ title: "Tasks · Rate My Semester" }, { name: "description", content: "Kanban-style assignment tracker with priority, due dates and GPA impact estimator." }] }),
  component: AssignmentsPage,
});

const cols: { id: Assignment["status"]; label: string; tint: string }[] = [
  { id: "todo", label: "To Do", tint: "stress" },
  { id: "doing", label: "Doing", tint: "warning" },
  { id: "done", label: "Done", tint: "acid" },
];

function AssignmentsPage() {
  const [items, setItems] = useLocalState<Assignment[]>("rms.assignments", initialAssignments);
  const [dragging, setDragging] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  function move(id: string, status: Assignment["status"]) {
    setItems(items.map((a) => (a.id === id ? { ...a, status } : a)));
  }
  function remove(id: string) { setItems(items.filter((a) => a.id !== id)); }
  function add() {
    if (!newTitle.trim()) return;
    setItems([{ id: crypto.randomUUID(), title: newTitle, course: "MATH 251", weight: 5, priority: "med", status: "todo", due: new Date(Date.now()+5*86400000).toISOString() }, ...items]);
    setNewTitle("");
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Task Board" title="Move it, ship it, sleep." subtitle="Drag cards between columns. Estimate the GPA impact before you panic." />

      <div className="glass rounded-2xl p-3 mb-5 flex gap-2">
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task… (e.g. Calc midterm review)"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground" />
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.03] transition-transform">
          <Plus className="size-4" /> Add
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {cols.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dragging && (move(dragging, col.id), setDragging(null))}
            className="glass rounded-3xl p-4 min-h-[60vh]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: `var(--${col.tint})` }} />
                <h3 className="font-semibold">{col.label}</h3>
              </div>
              <span className="text-xs text-muted-foreground">{items.filter(i=>i.status===col.id).length}</span>
            </div>
            <div className="space-y-2.5">
              <AnimatePresence>
                {items.filter((a) => a.status === col.id).map((a) => {
                  const days = Math.ceil((+new Date(a.due) - Date.now()) / 86400000);
                  const impact = (a.weight * 0.04).toFixed(2);
                  return (
                    <motion.div
                      key={a.id} layout
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      draggable
                      onDragStart={() => setDragging(a.id)}
                      className="group bg-white/5 border border-border rounded-2xl p-3.5 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{a.course}</span>
                        <button onClick={() => remove(a.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-stress">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <div className="font-medium text-sm mt-1">{a.title}</div>
                      <div className="mt-3 flex items-center justify-between text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest`}
                          style={{ background: `color-mix(in oklab, var(--${a.priority === "high" ? "stress" : a.priority === "med" ? "warning" : "acid"}) 18%, transparent)`, color: `var(--${a.priority === "high" ? "stress" : a.priority === "med" ? "warning" : "acid"})` }}>
                          {a.priority}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="size-3" /> {days <= 0 ? "Overdue" : `${days}d`}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Weight {a.weight}%</span>
                        <span className="text-acid">~{impact} GPA impact</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}