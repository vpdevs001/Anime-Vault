"use client";

import { cn } from "@/lib/utils";

interface RasenganProps {
  size?: number;
  className?: string;
  /** Whether the orb gently floats/sways (disable inside tight UI slots) */
  drift?: boolean;
}

/**
 * RASENGAN — a spinning sphere of pure chakra.
 * Layered: aura halo → outer swirl (CW) → core → inner swirl (CCW) → white heart.
 * Pure CSS animation, zero JS cost.
 */
export function Rasengan({ size = 120, className, drift = true }: RasenganProps) {
  return (
    <div
      className={cn("relative", drift && "animate-rasengan-drift", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Chakra aura halo */}
      <div
        className="absolute -inset-[45%] rounded-full animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(63,193,255,0.30) 0%, rgba(63,193,255,0.08) 45%, transparent 65%)",
        }}
      />
      {/* Outer wind shear — clockwise */}
      <div className="rasengan-swirl absolute -inset-[12%]" />
      {/* Core sphere */}
      <div className="rasengan-core absolute inset-0" />
      {/* Inner shear — counter-clockwise */}
      <div className="rasengan-swirl-rev absolute inset-[14%]" />
      {/* White-hot heart */}
      <div className="rasengan-heart absolute inset-[30%]" />
    </div>
  );
}
