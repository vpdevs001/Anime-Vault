"use client";

import { cn } from "@/lib/utils";

interface RasenganProps {
  size?: number;
  className?: string;
  /** Whether the orb gently floats/sways (disable inside tight UI slots) */
  drift?: boolean;
}

/**
 * RASENGAN — a spinning, unstable sphere of pure chakra.
 * Layered: pressure ring → aura halo → 3 counter-rotating wind-shear bands
 * (with a churning SVG turbulence filter on the core for that roiling,
 * barely-contained look) → orbiting chakra sparks → white-hot heart.
 * The turbulence filter is the one bit of SVG; everything else stays plain
 * CSS so the orb is still cheap to render in numbers.
 */
export function Rasengan({ size = 120, className, drift = true }: RasenganProps) {
  return (
    <div
      className={cn("relative", drift && "animate-rasengan-drift", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Invisible SVG filter defs — churns the core's highlight into a
          turbulent, liquid-chakra texture instead of a flat gradient */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="rasengan-churn" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.05"
              numOctaves="2"
              seed="7"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.010 0.045;0.018 0.06;0.010 0.045"
                dur="5s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" />
          </filter>
        </defs>
      </svg>

      {/* Compressed-air pressure ring — the visible edge of the wind sphere */}
      <div className="rasengan-pressure-ring absolute -inset-[8%]" />

      {/* Chakra aura halo */}
      <div
        className="absolute -inset-[45%] rounded-full animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(63,193,255,0.30) 0%, rgba(63,193,255,0.08) 45%, transparent 65%)",
        }}
      />

      {/* Outer wind shear — clockwise, churning texture */}
      <div className="rasengan-swirl absolute -inset-[12%]" style={{ filter: "url(#rasengan-churn)" }} />
      {/* Mid wind shear — counter-clockwise, slower */}
      <div className="rasengan-swirl-mid absolute -inset-[2%]" />
      {/* Core sphere */}
      <div className="rasengan-core absolute inset-0" />
      {/* Inner shear — counter-clockwise, fast */}
      <div className="rasengan-swirl-rev absolute inset-[14%]" />

      {/* Orbiting chakra sparks */}
      <div className="rasengan-orbit absolute inset-0">
        <span className="rasengan-spark" style={{ animationDelay: "0s" }} />
        <span className="rasengan-spark" style={{ animationDelay: "-1.6s" }} />
      </div>
      <div className="rasengan-orbit-rev absolute inset-0">
        <span className="rasengan-spark rasengan-spark-sm" style={{ animationDelay: "-0.8s" }} />
      </div>

      {/* White-hot heart */}
      <div className="rasengan-heart absolute inset-[30%]" />
    </div>
  );
}
