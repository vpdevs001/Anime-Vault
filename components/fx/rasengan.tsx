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
 * RASENGAN — a spinning sphere of pure chakra, rendered from the real art.
 * The image spins at a constant rate while a separate bluish aura blooms and
 * fades intermittently behind it. Uses the full-quality PNG from public/.
 */
export function Rasengan({ size = 120, className, drift = true }: RasenganProps) {
  return (
    <div
      className={cn("fx", drift && "animate-rasengan-drift", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Bluish shiny aura — fades in/out intermittently, independent of spin */}
      <div className="fx-aura fx-rasengan-aura" />
      {/* The chakra sphere itself — constant rotation + a shiny chakra glow */}
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
