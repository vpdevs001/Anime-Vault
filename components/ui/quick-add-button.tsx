"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Link2, FolderPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAddButtonProps {
  onAddLink: () => void;
  onAddFolder: () => void;
}

export function QuickAddButton({ onAddLink, onAddFolder }: QuickAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-30 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ delay: 0.05 }}
              onClick={() => {
                onAddFolder();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
            >
              <FolderPlus size={16} className="text-accent-slayer" />
              New Folder
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={() => {
                onAddLink();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
            >
              <Link2 size={16} className="text-accent-chakra" />
              New Link
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center",
          "bg-gradient-to-br from-accent-primary to-accent-secondary",
          "shadow-lg shadow-accent-primary/25",
          "hover:shadow-xl hover:shadow-accent-primary/35",
          "transition-shadow duration-300"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <X size={22} className="text-white" /> : <Plus size={22} className="text-white" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
