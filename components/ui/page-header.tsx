"use client";

import { motion } from "motion/react";

interface PageHeaderProps {
  /** A rendered icon element, e.g. <Heart size={24} style={{ color }} /> —
   *  passed as a node so Server Components can use this header too. */
  icon: React.ReactNode;
  title: string;
  kanji: string;
  subtitle?: string;
  accent?: string;
  children?: React.ReactNode;
}

/**
 * PAGE SEAL — the header stamped at the top of every archive room:
 * rotating seal box, Bebas title, mincho kanji, brush stroke underline.
 */
export function PageHeader({
  icon,
  title,
  kanji,
  subtitle,
  accent = "#ff4a3d",
  children,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex items-start gap-4 mb-8 relative"
    >
      {/* Seal box — rotates on hover, ringed by a cursed seal */}
      <motion.div
        className="relative w-14 h-14 shrink-0"
        whileHover={{ rotate: 8, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
      >
        <div
          className="cursed-ring absolute -inset-1.5"
          style={{ borderColor: `${accent}55` }}
        />
        <div
          className="absolute inset-0 rounded-md border-2 flex items-center justify-center -rotate-3"
          style={{
            borderColor: `${accent}77`,
            backgroundColor: `${accent}12`,
            boxShadow: `0 0 22px ${accent}30`,
          }}
        >
          {icon}
        </div>
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-4xl font-[family-name:var(--font-rajdhani)] tracking-[0.06em] text-foreground leading-none">
            {title}
          </h1>
          <span
            className="font-[family-name:var(--font-mincho)] text-lg leading-none"
            style={{ color: `${accent}cc` }}
          >
            {kanji}
          </span>
        </div>
        {subtitle && (
          <p className="text-sm text-foreground-muted mt-1.5 meta-mono">
            {subtitle}
          </p>
        )}
        <div
          className="brush-underline animate-brush h-[3px] w-36 mt-2.5"
          style={{
            background: `linear-gradient(90deg, ${accent} 0%, ${accent}88 55%, transparent 100%)`,
          }}
        />
      </div>

      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </motion.div>
  );
}
