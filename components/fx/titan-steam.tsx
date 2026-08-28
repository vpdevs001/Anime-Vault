"use client";

import { cn } from "@/lib/utils";

interface TitanSteamProps {
  size?: number;
  className?: string;
}

/**
 * TITAN STEAM — a wings-of-freedom-inspired emblem wreathed in rising vapor.
 * Attack on Titan's presence in the app was previously just two unused
 * palette entries (Titan Earth, Scout Green) with nothing actually rendered
 * anywhere. This gives it a real, dedicated visual on par with the Rasengan
 * / Sharingan / Cursed Orb treatment the other series already had.
 */
export function TitanSteam({ size = 56, className }: TitanSteamProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }} aria-hidden>
      {/* Rising steam wisps */}
      <div className="absolute inset-x-0 -top-3 -bottom-3 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="titan-steam-wisp"
            style={{
              left: `${20 + i * 28}%`,
              animationDelay: `${i * 1.3}s`,
              animationDuration: `${4.5 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Emblem — two curved wings framing a ring, earth/scout tones */}
      <svg viewBox="0 0 56 56" width={size} height={size} className="relative">
        <defs>
          <linearGradient id="titanWingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b6f47" />
            <stop offset="100%" stopColor="#5a8c69" />
          </linearGradient>
        </defs>
        {/* Left wing */}
        <path
          d="M28 28 C 18 22, 10 24, 4 16 C 10 30, 14 34, 24 34 C 26 34, 27 31, 28 28 Z"
          fill="url(#titanWingGrad)"
          opacity="0.9"
        />
        {/* Right wing (mirrored) */}
        <path
          d="M28 28 C 38 22, 46 24, 52 16 C 46 30, 42 34, 32 34 C 30 34, 29 31, 28 28 Z"
          fill="url(#titanWingGrad)"
          opacity="0.9"
        />
        {/* Center ring — the "shield" the wings guard */}
        <circle cx="28" cy="28" r="9" fill="none" stroke="#dfd8c4" strokeWidth="1.6" opacity="0.85" />
        <circle cx="28" cy="28" r="3.2" fill="#dfd8c4" opacity="0.7" />
      </svg>
    </div>
  );
}
