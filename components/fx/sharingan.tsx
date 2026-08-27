"use client";

import { cn } from "@/lib/utils";

interface SharinganProps {
  size?: number;
  className?: string;
  /** Slowly rotates the pinwheel pattern, like an activating doujutsu */
  spin?: boolean;
  delay?: number;
}

/**
 * MANGEKYŌ SHARINGAN — a crimson iris wrapped in a three-bladed pinwheel.
 * Replaces the old Chidori bolt: reads instantly as "anime" rather than
 * "generic lightning icon," and its blood-red palette sits naturally in the
 * theme's existing ember/crimson accents instead of introducing a new hue.
 * Pure SVG + CSS — the blade ring spins independently of the static iris.
 */
export function Sharingan({ size = 120, className, spin = true, delay = 0 }: SharinganProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
      aria-hidden
    >
      {/* Aura — crimson bloom behind the eye */}
      <div
        className="absolute -inset-[35%] rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(215,38,61,0.35) 0%, rgba(215,38,61,0.08) 45%, transparent 68%)",
          animationDelay: `${delay}s`,
        }}
      />

      <svg viewBox="0 0 120 120" width={size} height={size} className="relative sharingan-flicker" style={{ animationDelay: `${delay}s` }}>
        <defs>
          <radialGradient id="sharinganIris" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#ff5c5c" />
            <stop offset="45%" stopColor="#d7263d" />
            <stop offset="100%" stopColor="#5c0e18" />
          </radialGradient>
        </defs>

        {/* Sclera ring */}
        <circle cx="60" cy="60" r="58" fill="#0b0710" stroke="rgba(242,239,228,0.14)" strokeWidth="1.5" />

        {/* Iris */}
        <circle cx="60" cy="60" r="50" fill="url(#sharinganIris)" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="#1a0206" strokeWidth="2" />

        {/* Spinning tomoe pinwheel */}
        <g className={spin ? "animate-spin-slow" : undefined} style={{ transformOrigin: "60px 60px" }}>
          {[0, 120, 240].map((rot) => (
            <g key={rot} transform={`rotate(${rot} 60 60)`}>
              {/* Tomoe blade — a curved comma sweeping from center to rim */}
              <path
                d="M60 60
                   C 60 42, 50 30, 60 14
                   C 74 20, 78 34, 70 46
                   C 76 50, 78 56, 74 62
                   C 68 60, 62 58, 60 60 Z"
                fill="#0b0710"
              />
              {/* Blade highlight edge */}
              <path
                d="M60 60 C 60 42, 50 30, 60 14"
                fill="none"
                stroke="rgba(242,239,228,0.18)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </g>
          ))}
          {/* Center pupil binding the three blades */}
          <circle cx="60" cy="60" r="9" fill="#0b0710" />
        </g>

        {/* Glass highlight — gives the eye a wet, alert glint */}
        <ellipse cx="44" cy="40" rx="10" ry="6" fill="rgba(255,255,255,0.16)" />
      </svg>
    </div>
  );
}
