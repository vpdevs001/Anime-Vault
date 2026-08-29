"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface SixEyesProps {
  size?: number;
  className?: string;
  delay?: number;
}

/**
 * SIX EYES — Gojo's Limitless-blue iris from the real art. No rotation: the
 * eye breathes open (scale up) then fades back, like Gojo unveiling the
 * Limitless. A cyan bloom pulses in time behind it. Uses full-quality PNG.
 */
export function SixEyes({ size = 78, className, delay = 0 }: SixEyesProps) {
  return (
    <div
      className={cn("fx", className)}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
      aria-hidden
    >
      {/* Aura — cyan bloom, scaling + fading in time with the eye */}
      <div className="fx-aura fx-six-eyes-aura" style={{ animationDelay: `${delay}s` }} />
      {/* The iris — scale-up + fade reveal, no rotation */}
      <div className="fx-six-eyes-img" style={{ animationDelay: `${delay}s` }}>
        <Image
          src="/six-eye.png"
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
