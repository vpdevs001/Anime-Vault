"use client";

import { cn } from "@/lib/utils";

interface CursedOrbProps {
  size?: number;
  className?: string;
  /** Rotating jujutsu seal rings around the orb */
  rings?: boolean;
  drift?: boolean;
}

/**
 * HOLLOW PURPLE — an orb of imaginary mass wrapped in rotating
 * cursed seal rings. The Jujutsu Kaisen counterweight to the Rasengan.
 */
export function CursedOrb({
  size = 90,
  className,
  rings = true,
  drift = true,
}: CursedOrbProps) {
  return (
    <div
      className={cn("relative", drift && "animate-float", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Seal rings */}
      {rings && (
        <>
          <div className="cursed-ring absolute -inset-3" />
          <div className="cursed-ring-rev absolute -inset-6" />
        </>
      )}
      {/* Cursed aura */}
      <div
        className="absolute -inset-[40%] rounded-full animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(157,92,255,0.35) 0%, transparent 65%)",
        }}
      />
      {/* Imaginary mass */}
      <div className="hollow-orb absolute inset-0" />
      {/* White core */}
      <div className="absolute inset-[32%] rounded-full bg-white/80 blur-[2px]" />
    </div>
  );
}
