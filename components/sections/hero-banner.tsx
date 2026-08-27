"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { BACKGROUND_IMAGES, FALLBACK_GRADIENTS, GREETING_MESSAGES } from "@/lib/constants";

export function HeroBanner() {
  const bgImage = BACKGROUND_IMAGES[0] ?? null;
  const greeting = GREETING_MESSAGES[0] ?? "Welcome back to the Vault";
  const fallbackGradient = FALLBACK_GRADIENTS[0];
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-xl h-[220px] sm:h-[260px] mb-8 border-2 border-[var(--ink-line)]">
      {/* Background Image or Gradient */}
      <div className="absolute inset-0">
        {bgImage && !imageError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover grayscale-[15%] contrast-[1.1]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: fallbackGradient }}
          />
        )}
      </div>

      {/* Dark ink overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,10,13,0.75) 0%, rgba(10,10,13,0.35) 40%, rgba(10,10,13,0.88) 100%)",
        }}
      />

      {/* Halftone print texture over the whole banner */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgba(236,231,218,0.09) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      />

      {/* Drifting embers (subtle, ink-red) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent-primary/50"
            initial={{
              x: `${20 + i * 15}%`,
              y: `${30 + (i % 3) * 20}%`,
              opacity: 0.2,
            }}
            animate={{
              y: [`${30 + (i % 3) * 20}%`, `${20 + (i % 3) * 20}%`, `${30 + (i % 3) * 20}%`],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hanko seal — the signature mark, stamped bottom-right */}
      <motion.div
        className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 z-10"
        initial={{ opacity: 0, scale: 1.6, rotate: -18 }}
        animate={{ opacity: 0.9, scale: 1, rotate: -8 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-sm border-2 flex items-center justify-center"
          style={{ borderColor: "var(--accent-primary)", boxShadow: "0 0 0 1px rgba(230,57,70,0.25)" }}
        >
          <span
            className="font-[family-name:var(--font-rajdhani)] text-accent-primary text-xl sm:text-2xl tracking-widest"
            style={{ mixBlendMode: "normal" }}
          >
            蔵
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            suppressHydrationWarning
            className="text-4xl sm:text-5xl font-[family-name:var(--font-rajdhani)] tracking-wide text-white mb-2 leading-none"
          >
            {greeting}
          </h1>
          <p className="text-sm text-white/60 meta-mono">
            Your personal resource vault — organized, searchable, always ready.
          </p>
        </motion.div>
      </div>

      {/* Bottom ink accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] animate-energy"
        style={{
          background:
            "linear-gradient(90deg, #e63946, #d4831f, #c9a13b, #8b6f47, #e63946)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
