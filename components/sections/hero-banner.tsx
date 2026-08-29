"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Rasengan } from "@/components/fx/rasengan";
import { Sharingan } from "@/components/fx/sharingan";
import { SixEyes } from "@/components/fx/six-eyes";
import { CursedOrb } from "@/components/fx/cursed-orb";
import { TitanSteam } from "@/components/fx/titan-steam";
import {
  BACKGROUND_IMAGES,
  FALLBACK_GRADIENTS,
  GREETING_MESSAGES,
} from "@/lib/constants";

export function HeroBanner() {
  const bgImage = BACKGROUND_IMAGES[0] ?? null;
  const fallbackGradient = FALLBACK_GRADIENTS[0];
  const [imageError, setImageError] = useState(false);
  // Rotating greeting — coarse 10-hour window so the server render and the
  // client hydration virtually always land in the same slot (no drift).
  const [greeting] = useState(
    () =>
      GREETING_MESSAGES[
        Math.floor(Date.now() / 36000000) % GREETING_MESSAGES.length
      ]
  );

  return (
    <div className="relative overflow-hidden rounded-2xl h-[280px] sm:h-[320px] mb-10 energy-frame">
      {/* ── Layer 0: art or gradient ── */}
      <div className="absolute inset-0">
        {bgImage && !imageError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover grayscale-[20%] contrast-[1.15] saturate-[0.9]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full" style={{ background: fallbackGradient }} />
        )}
      </div>

      {/* ── Layer 1: night ink overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(6,6,11,0.88) 0%, rgba(6,6,11,0.45) 45%, rgba(6,6,11,0.92) 100%)",
        }}
      />

      {/* ── Layer 2: manga textures — halftone + speed lines ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(242,239,228,0.08) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      />
      <div className="absolute inset-0 speedlines-slow opacity-70 pointer-events-none" />

      {/* ── Layer 3: giant mincho kanji ghosted into the panel ── */}
      <div
        className="absolute -right-4 -bottom-10 font-[family-name:var(--font-mincho)] font-bold text-[13rem] leading-none pointer-events-none select-none animate-kanji"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(242,239,228,0.10)",
        }}
        aria-hidden
      >
        忍
      </div>

      {/* ── Layer 4: eyes, watching — one Sharingan (Naruto), one Six Eyes (JJK) ── */}
      <div className="absolute top-3 left-2 sm:top-5 sm:left-6 pointer-events-none">
        <Sharingan size={78} delay={0.6} />
      </div>
      <div className="absolute top-16 left-20 sm:top-24 sm:left-32 pointer-events-none opacity-80">
        <SixEyes size={54} delay={2.4} />
      </div>

      {/* ── Layer 4b: Titan wings + steam — top-right, Attack on Titan flagship ── */}
      <motion.div
        className="absolute top-3 right-3 sm:top-5 sm:right-8 pointer-events-none"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 0.95, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <TitanSteam size={64} className="sm:hidden" />
        <TitanSteam size={84} className="hidden sm:block" />
      </motion.div>

      {/* ── Layer 5: the Rasengan — floating right of center ── */}
      <motion.div
        className="absolute right-8 sm:right-24 top-1/2 -translate-y-1/2 z-10"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <Rasengan size={96} className="sm:hidden" />
        <Rasengan size={132} className="hidden sm:block" />
      </motion.div>

      {/* ── Layer 6: hollow purple, lurking bottom-left ── */}
      <motion.div
        className="absolute left-6 sm:left-10 bottom-8 z-10 hidden sm:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <CursedOrb size={44} />
      </motion.div>

      {/* ── Layer 7: rising sparks inside the panel ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              backgroundColor: i % 2 ? "#ff9f2e" : "#9d5cff",
              boxShadow: `0 0 6px ${i % 2 ? "#ff9f2e" : "#9d5cff"}`,
            }}
            initial={{
              x: `${12 + i * 13}%`,
              y: "105%",
              opacity: 0,
            }}
            animate={{
              y: ["105%", "-8%"],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 5 + i * 0.9,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* ── Vertical brush caption — right edge ── */}
      <div
        className="absolute right-3 top-4 bottom-16 hidden sm:flex items-start pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-[family-name:var(--font-mincho)] text-sm text-foreground/35 tracking-[0.5em]"
          style={{ writingMode: "vertical-rl" }}
        >
          術の蔵・封印解
        </span>
      </div>

      {/* ── Hanko seal — stamped bottom-right ── */}
      <motion.div
        className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 z-10"
        initial={{ opacity: 0, scale: 1.8, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ duration: 0.45, delay: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-sm border-2 border-accent-primary bg-accent-primary/10 glow-ember flex items-center justify-center">
          <span className="font-[family-name:var(--font-mincho)] font-bold text-accent-primary text-2xl sm:text-3xl">
            蔵
          </span>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-9">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Chapter tag */}
          <motion.p
            className="meta-mono text-[11px] tracking-[0.35em] text-accent-chakra/90 uppercase mb-3"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            ◈ Chapter ∞ — The Vault Opens
          </motion.p>

          {/* Greeting — letters slam in one by one */}
          <h1
            key={greeting}
            suppressHydrationWarning
            className="text-4xl sm:text-6xl font-[family-name:var(--font-rajdhani)] tracking-wide text-white mb-2.5 leading-none"
            style={{ textShadow: "0 2px 24px rgba(6,6,11,0.8)" }}
          >
            {greeting.split("").map((ch, i) => (
              <span
                key={`${greeting}-${i}`}
                className="animate-letter-pop inline-block"
                style={{ animationDelay: `${0.25 + i * 0.035}s` }}
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
          </h1>

          <motion.p
            className="text-sm text-white/55 meta-mono max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Every link a sealed jutsu — organized, searchable, always ready
            for the next mission.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Bottom energy line — chakra running the frame ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] animate-energy"
        style={{
          background:
            "linear-gradient(90deg, #ff4a3d, #ff9f2e, #9d5cff, #3fc1ff, #ff4a3d)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}