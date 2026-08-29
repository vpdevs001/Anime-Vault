"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CursedOrbProps {
  size?: number;
  className?: string;
  /** Rotating jujutsu seal rings around the orb */
  rings?: boolean;
  drift?: boolean;
}

/**
 * HOLLOW PURPLE — an orb of imaginary mass rendered from the real art, wrapped
 * in a chaotic cursed aura. The aura flickers and churns (unstable cursed
 * energy) while the orb pulses. Uses the full-quality PNG from public/.
 */
export function CursedOrb({
  size = 90,
  className,
  rings = true,
  drift = true,
}: CursedOrbProps) {
  return (
    <div
      className={cn("fx", drift && "animate-float", className)}
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
      {/* Chaotic purple aura — roiling, unstable cursed energy */}
      <div className="fx-aura fx-hollow-aura" />
      {/* The orb of imaginary mass */}
      <div className="fx-hollow-img fx-hollow-glow">
        <Image
          src="/hollow-purple.png"
          alt=""
          width={size}
          height={size}
          draggable={false}
          priority
        />
      </div>
    </div>
  );
}
