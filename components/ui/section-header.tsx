"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  kanji: string;
  count?: number;
  /** Any accent hex — drives icon glow + brush stroke */
  accent?: string;
}

/**
 * SECTION SEAL — icon-in-stamp + Bebas title + mincho kanji,
 * underlined by a sumi brush stroke that sweeps in on scroll.
 */
export function SectionHeader({
  icon: Icon,
  title,
  kanji,
  count,
  accent = "#ff4a3d",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="flex items-end gap-3 mb-5"
    >
      {/* Stamp icon */}
      <motion.div
        whileHover={{ rotate: -8, scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
        className="w-9 h-9 rounded-sm border flex items-center justify-center -rotate-3 shrink-0"
        style={{
          borderColor: `${accent}66`,
          backgroundColor: `${accent}14`,
          boxShadow: `0 0 14px ${accent}30`,
        }}
      >
        <Icon size={17} style={{ color: accent }} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-xl font-[family-name:var(--font-rajdhani)] tracking-[0.08em] text-foreground leading-none">
            {title}
          </h2>
          <span className="font-[family-name:var(--font-mincho)] text-sm text-foreground-muted/70 leading-none">
            {kanji}
          </span>
          {typeof count === "number" && (
            <span className="text-xs text-foreground-muted meta-mono leading-none">
              [{count}]
            </span>
          )}
        </div>
        {/* Brush stroke */}
        <div
          className="brush-underline animate-brush h-[3px] w-24 mt-1.5"
          style={{
            background: `linear-gradient(90deg, ${accent} 0%, ${accent}88 55%, transparent 100%)`,
          }}
        />
      </div>
    </motion.div>
  );
}
