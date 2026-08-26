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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/folders/${id}`} className="block group">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl p-5",
            "bg-surface border border-border-custom",
            "transition-all duration-300 ease-out",
            "hover:border-border-hover",
            "hover:-translate-y-1",
            "hover:shadow-xl"
          )}
        >
          {/* Accent glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accentColor}15, transparent 70%)`,
            }}
          />

          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
            style={{
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            }}
          />

          {/* Icon */}
          <div
            className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${accentColor}18` }}
          >
            <DynamicIcon
              name={icon}
              size={22}
              style={{ color: accentColor }}
            />
          </div>

          {/* Name */}
          <h3 className="relative text-base font-semibold text-foreground truncate mb-1 font-[family-name:var(--font-rajdhani)] tracking-wide">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="relative text-xs text-foreground-muted truncate mb-2">
              {description}
            </p>
          )}

          {/* Link count */}
          <p className="relative text-xs text-foreground-muted">
            {linkCount} {linkCount === 1 ? "link" : "links"}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
