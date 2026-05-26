import { motion } from "framer-motion";

type Props = {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sub?: string;
  color?: string; // CSS var or color
  trackColor?: string;
};

export function ProgressRing({
  value, size = 160, stroke = 12, label, sub,
  color = "var(--brand)", trackColor = "color-mix(in oklab, var(--foreground) 12%, transparent)"
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 12px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && <div className="text-3xl font-semibold tracking-tight">{label}</div>}
        {sub && <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">{sub}</div>}
      </div>
    </div>
  );
}