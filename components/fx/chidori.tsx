"use client";

import { cn } from "@/lib/utils";

interface ChidoriProps {
  className?: string;
  width?: number;
  flip?: boolean;
  /** Seconds — staggers multiple bolts out of phase */
  delay?: number;
}

/**
 * CHIDORI — a crackling lightning strike.
 * Jagged SVG bolt with a neon drop-shadow, flickering violently
 * via the `lightning-flicker` keyframes (mostly dark, then SLASH).
 */
export function Chidori({ className, width = 220, flip = false, delay = 0 }: ChidoriProps) {
  return (
    <svg
      viewBox="0 0 240 120"
      width={width}
      className={cn("chidori-bolt pointer-events-none", flip && "-scale-x-100", className)}
      style={{ animationDelay: `${delay}s` }}
      fill="none"
      aria-hidden
    >
      {/* Main bolt — jagged descent */}
      <path
        d="M6 64 L52 40 L44 62 L96 30 L82 58 L138 22 L118 56 L176 18 L152 54 L234 8"
        stroke="#eaf9ff"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Forks */}
      <path
        d="M52 40 L72 68 M96 30 L114 62 M138 22 L160 54"
        stroke="#9be7ff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Ghost echo — doubles the crackle */}
      <path
        d="M6 64 L52 40 L44 62 L96 30 L82 58 L138 22 L118 56 L176 18 L152 54 L234 8"
        stroke="#3fc1ff"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  );
}
