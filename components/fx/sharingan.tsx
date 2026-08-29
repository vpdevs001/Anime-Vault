"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface SharinganProps {
  size?: number;
  className?: string;
  /** Rotate the pinwheel like an activating doujutsu (default true) */
  spin?: boolean;
  delay?: number;
}

/**
 * MANGEKYŌ SHARINGAN — the real crimson iris art, spinning at an IRREGULAR
 * speed: a lazy crawl that surges into a fast whirl and snaps back, like the
 * eye waking up. Uses the full-quality PNG from public/.
 */
export function Sharingan({ size = 120, className, spin = true, delay = 0 }: SharinganProps) {
  return (
    <div
      className={cn("fx", className)}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
      aria-hidden
    >
      {/* Aura — crimson bloom behind the eye */}
      <div className="fx-aura fx-sharingan-aura" style={{ animationDelay: `${delay}s` }} />
      {/* The pinwheel iris — irregular spin + a wet crimson glow */}
      <div
        className={cn("fx-sharingan-glow", spin && "fx-sharingan-img")}
        style={{ animationDelay: `${delay}s` }}
      >
        <Image
          src="/sharingan.png"
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
