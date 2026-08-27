"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Link2, FolderPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAddButtonProps {
  onAddLink: () => void;
  onAddFolder: () => void;
}

/**
 * JUTSU SUMMON — a floating chakra orb. Tap it and the seal opens,
 * fanning out talisman options like hand signs being formed.
 */
export function QuickAddButton({ onAddLink, onAddFolder }: QuickAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-30 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              initial={{ opacity: 0, scale: 0.4, y: 24, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, y: 24, rotate: -6 }}
              transition={{ delay: 0.06, type: "spring", stiffness: 400, damping: 22 }}
              onClick={() => {
                onAddFolder();
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg glass text-sm font-medium text-foreground hover:border-accent-slayer/50 transition-all group"
            >
              <FolderPlus
                size={16}
                className="text-accent-slayer group-hover:drop-shadow-[0_0_6px_rgba(47,212,183,0.8)]"
              />
              New Folder
              <span className="font-[family-name:var(--font-mincho)] text-xs text-accent-slayer/70">
                巻
              </span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.4, y: 24, rotate: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, y: 24, rotate: 6 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              onClick={() => {
                onAddLink();
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg glass text-sm font-medium text-foreground hover:border-accent-chakra/50 transition-all group"
            >
              <Link2
                size={16}
                className="text-accent-chakra group-hover:drop-shadow-[0_0_6px_rgba(255,159,46,0.8)]"
              />
              New Link
              <span className="font-[family-name:var(--font-mincho)] text-xs text-accent-chakra/70">
                鎖
              </span>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* The chakra orb itself */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-15 h-15 rounded-full flex items-center justify-center",
          "transition-shadow duration-300"
        )}
        style={{ width: 60, height: 60 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Quick add"
      >
        {/* Rotating seal rings */}
        <motion.div
          className="cursed-ring absolute -inset-1.5"
          animate={{ opacity: isOpen ? 1 : 0.5 }}
        />
        <div className="cursed-ring-rev absolute -inset-3.5" />
        {/* Orb body */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            isOpen ? "glow-purple" : "glow-ember"
          )}
          style={{
            background: isOpen
              ? "var(--gradient-cursed)"
              : "var(--gradient-primary)",
          }}
        />
        {/* Swirl sheen */}
        <div
          className="absolute inset-0 rounded-full animate-spin-slow opacity-40"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.5) 40deg, transparent 90deg)",
            maskImage: "radial-gradient(circle, transparent 30%, black 70%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 30%, black 70%)",
          }}
        />
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
          className="relative"
        >
          {isOpen ? (
            <X size={22} className="text-white drop-shadow-md" />
          ) : (
            <Plus size={22} className="text-white drop-shadow-md" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
