"use client";

import { Fragment } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Mincho seal shown beside the title — defaults to the vault seal */
  kanji?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * DOMAIN EXPANSION — the backdrop floods with cursed energy,
 * then the panel barrier snaps into existence around the caster.
 */
export function Modal({ isOpen, onClose, title, kanji = "術", children, className }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Cursed flood */}
          <motion.div
            className="fixed inset-0 z-50 backdrop-blur-md"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(91,43,224,0.22) 0%, rgba(6,6,11,0.82) 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Barrier panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className={cn(
                "relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl glass pointer-events-auto",
                "border border-glass-border",
                className
              )}
              initial={{ opacity: 0, scale: 0.85, rotate: -1.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 1, y: 20 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barrier edge — energy running the frame */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] animate-energy"
                style={{
                  background:
                    "linear-gradient(90deg, #9d5cff, #ff4a3d, #ff9f2e, #9d5cff)",
                  backgroundSize: "200% 100%",
                }}
                aria-hidden
              />

              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 pb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-sm border border-accent-cursed/50 bg-accent-cursed/10 flex items-center justify-center -rotate-3">
                      <span className="font-[family-name:var(--font-mincho)] text-accent-hollow text-sm leading-none">
                        {kanji}
                      </span>
                    </span>
                    <h2 className="text-2xl font-[family-name:var(--font-rajdhani)] text-foreground tracking-[0.06em]">
                      {title}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-surface-hover transition-all text-foreground-muted hover:text-accent-primary hover:rotate-90 duration-300"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
