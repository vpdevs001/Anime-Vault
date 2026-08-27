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
            "relative overflow-hidden rounded-md p-5",
            "bg-surface border-2 border-[var(--ink-line)]",
            "transition-all duration-300 ease-out",
            "group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
          )}
          style={{ boxShadow: "none" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accentColor;
            e.currentTarget.style.boxShadow = `3px 3px 0 ${accentColor}55`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--ink-line)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Halftone corner texture */}
          <div
            className="absolute -top-6 -right-6 w-24 h-24 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${accentColor}80 1px, transparent 1px)`,
              backgroundSize: "5px 5px",
              maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
            }}
          />

          {/* Icon */}
          <div
            className="relative w-11 h-11 rounded-sm flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 border"
            style={{ backgroundColor: `${accentColor}14`, borderColor: `${accentColor}40` }}
          >
            <DynamicIcon
              name={icon}
              size={22}
              style={{ color: accentColor }}
            />
          </div>

          {/* Name */}
          <h3 className="relative text-lg font-[family-name:var(--font-rajdhani)] tracking-wide text-foreground truncate mb-1">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="relative text-xs text-foreground-muted truncate mb-2">
              {description}
            </p>
          )}

          {/* Link count */}
          <p className="relative text-xs text-foreground-muted meta-mono">
            {linkCount} {linkCount === 1 ? "link" : "links"}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
