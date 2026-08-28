"use client";

import { cn } from "@/lib/utils";

interface ShinigamiEyeProps {
  size?: number;
  className?: string;
}

/**
 * SHINIGAMI EYE — a crimson iris ringed in ash-drift, on the Death Note
 * "eyes that reveal a name" idea. Fits naturally on the Ask Vault page: the
 * whole feature is "tell me a name/thing and I'll find it for you." Death
 * Note previously only showed up on the 404 page — this gives it presence
 * somewhere people actually visit.
 */
export function ShinigamiEye({ size = 56, className }: ShinigamiEyeProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }} aria-hidden>
      {/* Drifting ash motes */}
      <div className="absolute -inset-2 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="shinigami-ash"
            style={{
              left: `${15 + i * 30}%`,
              animationDelay: `${i * 1.1}s`,
              animationDuration: `${3.4 + i * 0.6}s`,
            }}
          />
        ))}
      </div>

      <svg viewBox="0 0 56 56" width={size} height={size} className="relative sharingan-flicker">
        <defs>
          <radialGradient id="shinigamiIris" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#ff5c5c" />
            <stop offset="45%" stopColor="#b5232e" />
            <stop offset="100%" stopColor="#2e0508" />
          </radialGradient>
        </defs>
        {/* Almond-shaped eye outline, narrower than the Sharingan's round iris */}
        <path
          d="M4 28 C 14 12, 42 12, 52 28 C 42 44, 14 44, 4 28 Z"
          fill="#0b0710"
          stroke="rgba(242,239,228,0.14)"
          strokeWidth="1"
        />
        <circle cx="28" cy="28" r="13" fill="url(#shinigamiIris)" />
        <circle cx="28" cy="28" r="4.5" fill="#0b0710" />
        <ellipse cx="23" cy="23" rx="3.5" ry="2" fill="rgba(255,255,255,0.18)" />
      </svg>
    </div>
  );
}
