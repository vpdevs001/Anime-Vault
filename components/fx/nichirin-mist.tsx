"use client";

import { cn } from "@/lib/utils";

interface NichirinMistProps {
  size?: number;
  className?: string;
}

/**
 * NICHIRIN MIST — a colour-shifting blade wreathed in water-breathing mist.
 * Demon Slayer previously had only the sidebar's seigaiha wave strip; this
 * gives it a proper dedicated set-piece on par with what the other series
 * got in the hero.
 */
export function NichirinMist({ size = 56, className }: NichirinMistProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }} aria-hidden>
      {/* Drifting mist wisps */}
      <div className="absolute -inset-3 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="nichirin-mist-wisp"
            style={{
              left: `${10 + i * 25}%`,
              animationDelay: `${i * 1.4}s`,
              animationDuration: `${5 + i}s`,
            }}
          />
        ))}
      </div>

      <svg viewBox="0 0 56 56" width={size} height={size} className="relative">
        <defs>
          <linearGradient id="nichirinBladeGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#2a9d8f" />
            <stop offset="55%" stopColor="#8fe3d8" />
            <stop offset="100%" stopColor="#f2f7f5" />
          </linearGradient>
        </defs>
        {/* Nichirin blade — diagonal, color-shifting edge */}
        <path
          d="M10 46 L38 12 L42 15 L14 49 Z"
          fill="url(#nichirinBladeGrad)"
          stroke="#0e4a42"
          strokeWidth="0.8"
        />
        {/* Hamon-style wavy edge line, characteristic of a katana's temper line */}
        <path
          d="M12 45 Q 18 40 16 36 T 22 28 T 20 20 T 28 14"
          fill="none"
          stroke="#0e4a42"
          strokeWidth="0.6"
          opacity="0.5"
        />
        {/* Handle wrap */}
        <rect x="4" y="42" width="10" height="4" rx="1.4" fill="#0e2b26" transform="rotate(-42 9 44)" />
      </svg>
    </div>
  );
}
