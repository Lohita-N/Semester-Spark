export type Assignment = {
    id: string;
    title: string;
    course: string;
    weight: number; // % of course grade
    score?: number; // 0-100, undefined = pending
    due: string;   // ISO
    priority: "low" | "med" | "high";
    status: "todo" | "doing" | "done";
  };
  
  export type Course = {
    id: string;
    code: string;
    name: string;
    credits: number;
    color: string; // semantic var name
    glyph: string;
    current: number;    // current grade % so far
    target: number;     // desired grade
    finalWeight: number; // weight of final exam
    stress: number;     // 0-100
    workload: number;   // 0-100
  };
  
  export const initialCourses: Course[] = [
    { id: "c1", code: "MATH 251", name: "Advanced Calculus", credits: 4, color: "stress", glyph: "Σ", current: 78, target: 90, finalWeight: 35, stress: 82, workload: 88 },
    { id: "c2", code: "PHIL 110", name: "Intro to Ethics", credits: 3, color: "acid", glyph: "Φ", current: 92, target: 92, finalWeight: 20, stress: 24, workload: 30 },
    { id: "c3", code: "CSCI 240", name: "Data Structures", credits: 4, color: "brand", glyph: "{}", current: 86, target: 92, finalWeight: 30, stress: 58, workload: 72 },
    { id: "c4", code: "ENGL 215", name: "Modern Literature", credits: 3, color: "warning", glyph: "¶", current: 88, target: 90, finalWeight: 25, stress: 40, workload: 50 },
    { id: "c5", code: "CHEM 105", name: "Organic Chemistry", credits: 4, color: "stress", glyph: "⚗", current: 74, target: 85, finalWeight: 40, stress: 72, workload: 80 },
  ];
  
  export const initialAssignments: Assignment[] = [
    { id: "a1", title: "Problem Set 7", course: "MATH 251", weight: 8, due: futureISO(2), priority: "high", status: "doing" },
    { id: "a2", title: "Ethics Essay #2", course: "PHIL 110", weight: 15, due: futureISO(5), priority: "med", status: "todo" },
    { id: "a3", title: "BST Implementation", course: "CSCI 240", weight: 12, due: futureISO(1), priority: "high", status: "doing" },
    { id: "a4", title: "Reading Response", course: "ENGL 215", weight: 5, due: futureISO(3), priority: "low", status: "todo" },
    { id: "a5", title: "Lab Report 4", course: "CHEM 105", weight: 10, due: futureISO(-1), priority: "high", status: "done", score: 88 },
    { id: "a6", title: "Midterm Review", course: "MATH 251", weight: 0, due: futureISO(7), priority: "med", status: "todo" },
    { id: "a7", title: "Group Project Demo", course: "CSCI 240", weight: 20, due: futureISO(10), priority: "high", status: "todo" },
    { id: "a8", title: "Reflection Paper", course: "PHIL 110", weight: 8, due: futureISO(-3), priority: "low", status: "done", score: 94 },
  ];
  
  function futureISO(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }
  
  export const gpaTrend = [
    { week: "W1", gpa: 3.20 },
    { week: "W2", gpa: 3.32 },
    { week: "W3", gpa: 3.45 },
    { week: "W4", gpa: 3.51 },
    { week: "W5", gpa: 3.62 },
    { week: "W6", gpa: 3.58 },
    { week: "W7", gpa: 3.74 },
    { week: "W8", gpa: 3.82 },
    { week: "W9", gpa: 3.88 },
    { week: "W10", gpa: 3.92 },
  ];
  
  export const studyVsGpa = [
    { hours: 8, gpa: 3.1 },
    { hours: 12, gpa: 3.4 },
    { hours: 16, gpa: 3.6 },
    { hours: 20, gpa: 3.8 },
    { hours: 24, gpa: 3.9 },
    { hours: 28, gpa: 3.95 },
  ];
  
  export const burnoutTrend = [
    { week: "W1", burnout: 22 },
    { week: "W2", burnout: 30 },
    { week: "W3", burnout: 38 },
    { week: "W4", burnout: 44 },
    { week: "W5", burnout: 52 },
    { week: "W6", burnout: 60 },
    { week: "W7", burnout: 58 },
    { week: "W8", burnout: 64 },
    { week: "W9", burnout: 70 },
    { week: "W10", burnout: 67 },
  ];
  
  export const gradeDist = [
    { name: "A", value: 6, fill: "var(--acid)" },
    { name: "B", value: 4, fill: "var(--brand)" },
    { name: "C", value: 2, fill: "var(--warning)" },
    { name: "D/F", value: 0, fill: "var(--stress)" },
  ];
  
  export function gradePoint(pct: number) {
    if (pct >= 93) return 4.0;
    if (pct >= 90) return 3.7;
    if (pct >= 87) return 3.3;
    if (pct >= 83) return 3.0;
    if (pct >= 80) return 2.7;
    if (pct >= 77) return 2.3;
    if (pct >= 73) return 2.0;
    if (pct >= 70) return 1.7;
    if (pct >= 67) return 1.3;
    if (pct >= 60) return 1.0;
    return 0;
  }
  
  export function computeGPA(courses: Course[]) {
    const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
    if (!totalCredits) return 0;
    const totalPoints = courses.reduce((s, c) => s + gradePoint(c.current) * c.credits, 0);
    return totalPoints / totalCredits;
  }
  
  export function predictedGPA(courses: Course[]) {
    // Assume current trajectory + slight bump from intent
    const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
    if (!totalCredits) return 0;
    const totalPoints = courses.reduce((s, c) => {
      const projected = c.current * (1 - c.finalWeight / 100) + ((c.current + c.target) / 2) * (c.finalWeight / 100);
      return s + gradePoint(projected) * c.credits;
    }, 0);
    return totalPoints / totalCredits;
  }
  
  export function neededOnFinal(currentPct: number, finalWeight: number, targetPct: number) {
    // target = current*(1-w) + final*w  =>  final = (target - current*(1-w))/w
    const w = finalWeight / 100;
    if (w === 0) return targetPct;
    return (targetPct - currentPct * (1 - w)) / w;
  }