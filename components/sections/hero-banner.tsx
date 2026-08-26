"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { BACKGROUND_IMAGES, FALLBACK_GRADIENTS, GREETING_MESSAGES } from "@/lib/constants";

export function HeroBanner() {
  const [bgImage] = useState(() => {
    if (BACKGROUND_IMAGES.length === 0) return null;
    return BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
  });
  const [greeting] = useState(() => {
    return GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
  });
  const [fallbackGradient] = useState(() => {
    return FALLBACK_GRADIENTS[Math.floor(Math.random() * FALLBACK_GRADIENTS.length)];
  });
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl h-[220px] sm:h-[260px] mb-8">
      {/* Background Image or Gradient */}
      <div className="absolute inset-0">
        {bgImage && !imageError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: fallbackGradient }}
          />
        )}
      </div>

      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(8,8,15,0.7) 0%, rgba(8,8,15,0.4) 40%, rgba(8,8,15,0.8) 100%)",
        }}
      />

      {/* Animated particles/dots overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent-primary/40"
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

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-rajdhani)] tracking-wide text-white mb-2">
            {greeting}
          </h1>
          <p className="text-sm text-white/60">
            Your personal resource vault — organized, searchable, always ready.
          </p>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] animate-energy"
        style={{
          background:
            "linear-gradient(90deg, #a855f7, #f97316, #14b8a6, #6366f1, #a855f7)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
