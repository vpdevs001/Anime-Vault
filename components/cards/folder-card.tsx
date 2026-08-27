"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";

interface FolderCardProps {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
  linkCount: number;
  description?: string | null;
  index?: number;
}

export function FolderCard({
  id,
  name,
  icon,
  accentColor,
  linkCount,
  description,
  index = 0,
}: FolderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/folders/${id}`} className="block group">
        <div
          className={cn(
            "relative overflow-hidden rounded-lg p-5",
            "bg-surface border-[1.5px]",
            "transition-all duration-300 ease-out",
            "group-hover:-translate-y-1 group-hover:-translate-x-0.5",
            "border-[var(--ink-line)]",
            "group-hover:border-[var(--fa)]",
            "group-hover:shadow-[4px_4px_0_var(--fa-dim)]"
          )}
          style={{
            // @ts-expect-error — folder accent CSS custom properties
            "--fa": accentColor,
            "--fa-dim": `${accentColor}44`,
          }}
        >
          {/* Rotating cursed seal — awakens behind the icon on hover */}
          <div
            className="absolute -top-7 -left-7 w-24 h-24 rounded-full border-[1.5px] border-dashed opacity-0 group-hover:opacity-50 transition-all duration-700 pointer-events-none group-hover:animate-seal-spin"
            style={{ borderColor: accentColor }}
            aria-hidden
          />

          {/* Halftone bloom — top right corner */}
          <div
            className="absolute -top-6 -right-6 w-24 h-24 opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${accentColor}80 1px, transparent 1px)`,
              backgroundSize: "5px 5px",
              maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
            }}
            aria-hidden
          />

          {/* Slash sweep — a blade of light crossing the card */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(115deg, transparent 42%, ${accentColor}18 50%, transparent 58%)`,
            }}
            aria-hidden
          />

          {/* Icon — aura seal */}
          <div
            className="relative w-11 h-11 rounded-sm flex items-center justify-center mb-3 border transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6"
            style={{
              backgroundColor: `${accentColor}14`,
              borderColor: `${accentColor}40`,
            }}
          >
            <DynamicIcon
              name={icon}
              size={22}
              style={{ color: accentColor }}
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]"
            />
          </div>

          {/* Name */}
          <h3 className="relative text-xl font-[family-name:var(--font-rajdhani)] tracking-[0.06em] text-foreground truncate mb-0.5 leading-tight">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="relative text-xs text-foreground-muted truncate mb-2">
              {description}
            </p>
          )}

          {/* Link count — stamped like an archive record */}
          <p className="relative text-[11px] text-foreground-muted meta-mono flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
            />
            {linkCount} {linkCount === 1 ? "scroll" : "scrolls"} sealed
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
