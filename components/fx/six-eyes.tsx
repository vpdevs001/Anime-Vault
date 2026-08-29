"use client";

import { cn } from "@/lib/utils";

interface SixEyesProps {
  size?: number;
  className?: string;
  delay?: number;
}

/**
 * SIX EYES — Gojo's turquoise iris ringed by a six-point hex pattern.
 * JJK's only presence used to be the small Hollow Purple orb; pairing this
 * with it gives the series actual eye-level parity with Naruto's Sharingan
 * in the hero, instead of a single minor accent color.
 */
export function SixEyes({ size = 78, className, delay = 0 }: SixEyesProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
      aria-hidden
    >
      {/* Aura — cyan bloom */}
      <div
        className="absolute -inset-[35%] rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(94,234,212,0.32) 0%, rgba(94,234,212,0.08) 45%, transparent 68%)",
          animationDelay: `${delay}s`,
        }}
      />

      <svg viewBox="0 0 120 120" width={size} height={size} className="relative six-eyes-flicker" style={{ animationDelay: `${delay}s` }}>
        <defs>
          <radialGradient id="sixEyesIris" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#e8fffb" />
            <stop offset="35%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#0e7c66" />
          </radialGradient>
        </defs>

        {/* Sclera ring */}
        <circle cx="60" cy="60" r="58" fill="#060b0a" stroke="rgba(232,255,251,0.16)" strokeWidth="1.5" />

        {/* Iris */}
        <circle cx="60" cy="60" r="50" fill="url(#sixEyesIris)" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="#04241d" strokeWidth="2" />

        {/* Six-point star pattern — the signature "hex" of the Six Eyes */}
        <g className="animate-spin-slow" style={{ transformOrigin: "60px 60px" }}>
          {[0, 60, 120, 180, 240, 300].map((rot) => (
            <line
              key={rot}
              x1="60"
              y1="60"
              x2="60"
              y2="16"
              stroke="rgba(6,18,15,0.75)"
              strokeWidth="1.6"
              strokeLinecap="round"
              transform={`rotate(${rot} 60 60)`}
            />
          ))}
          {[30, 90, 150, 210, 270, 330].map((rot) => (
            <line
              key={rot}
              x1="60"
              y1="60"
              x2="60"
              y2="26"
              stroke="rgba(6,18,15,0.45)"
              strokeWidth="1"
              strokeLinecap="round"
              transform={`rotate(${rot} 60 60)`}
            />
          ))}
          <circle cx="60" cy="60" r="8" fill="#060b0a" />
        </g>

        {/* Glass highlight */}
        <ellipse cx="44" cy="40" rx="10" ry="6" fill="rgba(255,255,255,0.22)" />
      </svg>
    </div>
  );
}
