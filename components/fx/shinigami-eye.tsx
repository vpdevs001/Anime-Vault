"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ShinigamiEyeProps {
  size?: number;
  className?: string;
}

/**
 * SHINIGAMI EYE — the real crimson-iris art wreathed in a roiling dark
 * purple-black miasma. Dark aura churns behind it. Uses full-quality PNG.
 */
export function ShinigamiEye({ size = 56, className }: ShinigamiEyeProps) {
  return (
    <div className={cn("fx", className)} style={{ width: size, height: size }} aria-hidden>
      {/* Dark purple-black aura — chaotic, roiling cursed smoke */}
      <div className="fx-aura fx-shinigami-aura" />
      {/* The iris art */}
      <div className="fx-shinigami-glow">
        <Image
          src="/shinigami-eyes.png"
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
