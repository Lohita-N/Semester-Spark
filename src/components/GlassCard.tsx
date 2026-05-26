import { type ReactNode } from "react";
import { motion } from "framer-motion";

export function GlassCard({
  children, className = "", hover = true, delay = 0,
}: { children: ReactNode; className?: string; hover?: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -3 } : undefined}
      className={`glass rounded-3xl p-6 shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}
