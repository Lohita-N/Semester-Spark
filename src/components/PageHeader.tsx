import { motion } from "framer-motion";

export function PageHeader({
  eyebrow, title, subtitle,
}: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold tracking-widest uppercase text-acid"
        >
          <span className="size-1.5 rounded-full bg-acid animate-pulse" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="mt-3 font-display italic text-4xl md:text-5xl leading-[1.05] gradient-text"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="mt-2 text-muted-foreground max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}