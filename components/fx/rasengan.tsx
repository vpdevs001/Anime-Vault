"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface RasenganProps {
  size?: number;
  className?: string;
  /** Whether the orb gently floats/sways (disable inside tight UI slots) */
  drift?: boolean;
}

/**
 * RASENGAN — a giant spinning sphere of concentrated chakra, rendered from
 * the real art. Surrounded by a massive, multi-tiered radiating bluish aura
 * that pulses, expands, and blooms with immense chakra pressure.
 */
export function Rasengan({ size = 175, className, drift = true }: RasenganProps) {
  return (
    <div
      className={cn("fx", drift && "animate-rasengan-drift", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Outer mega-aura — massive radiating chakra haze */}
      <div className="fx-aura fx-rasengan-aura-outer" />
      {/* Bluish shiny aura — intermittent blooming chakra energy */}
      <div className="fx-aura fx-rasengan-aura" />
      {/* Inner high-intensity chakra flare */}
      <div className="fx-aura fx-rasengan-aura-inner" />
      {/* The chakra sphere itself — rapid constant rotation + intense blue glow */}
      <div className="fx-rasengan-img fx-rasengan-glow">
        <Image
          src="/rasengan.png"
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
