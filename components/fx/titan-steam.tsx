"use client";

import { cn } from "@/lib/utils";

interface TitanSteamProps {
  size?: number;
  className?: string;
}

/**
 * TITAN STEAM — a wings-of-freedom-inspired emblem wreathed in heavy rising
 * vapor, like a Titan shifting. Thick steam bursts billow upward and dissipate,
 * with secondary wisps for depth. Enhanced with a heated shimmer haze.
 */
export function TitanSteam({ size = 56, className }: TitanSteamProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }} aria-hidden>
      {/* Rising steam wisps — heavy, thick bursts */}
      <div className="absolute -inset-6 overflow-hidden pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="titan-steam-wisp"
            style={{
              left: `${10 + i * 20}%`,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${3.5 + i * 0.7}s`,
            }}
          />
        ))}
        {/* Secondary thin wisps — faster, more transparent */}
        {[0, 1, 2].map((i) => (
          <span
            key={`thin-${i}`}
            className="titan-steam-wisp-thin"
            style={{
              left: `${25 + i * 25}%`,
              animationDelay: `${0.4 + i * 1.1}s`,
              animationDuration: `${2.8 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Heat shimmer haze — distortion layer */}
      <div className="titan-heat-haze" />

      {/* Emblem — two curved wings framing a ring, earth/scout tones */}
      <svg viewBox="0 0 56 56" width={size} height={size} className="relative">
        <defs>
          <linearGradient id="titanWingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b6f47" />
            <stop offset="100%" stopColor="#5a8c69" />
          </linearGradient>
          <filter id="titanGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Left wing */}
        <path
          d="M28 28 C 18 22, 10 24, 4 16 C 10 30, 14 34, 24 34 C 26 34, 27 31, 28 28 Z"
          fill="url(#titanWingGrad)"
          opacity="0.9"
          filter="url(#titanGlow)"
        />
        {/* Right wing (mirrored) */}
        <path
          d="M28 28 C 38 22, 46 24, 52 16 C 46 30, 42 34, 32 34 C 30 34, 29 31, 28 28 Z"
          fill="url(#titanWingGrad)"
          opacity="0.9"
          filter="url(#titanGlow)"
        />
        {/* Center ring — the "shield" the wings guard */}
        <circle cx="28" cy="28" r="9" fill="none" stroke="#dfd8c4" strokeWidth="1.6" opacity="0.85" />
        <circle cx="28" cy="28" r="3.2" fill="#dfd8c4" opacity="0.7" />
      </svg>
    </div>
  );
}
