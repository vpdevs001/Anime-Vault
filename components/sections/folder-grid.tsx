"use client";

import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { FolderCard } from "../cards/folder-card";

interface FolderGridProps {
  folders: Array<{
    id: string;
    name: string;
    description: string | null;
    icon: string;
    accentColor: string;
    linkCount: number;
  }>;
}

export function FolderGrid({ folders }: FolderGridProps) {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <Layers size={18} className="text-accent-slayer" />
        <h2 className="text-lg font-bold font-[family-name:var(--font-rajdhani)] tracking-wide text-foreground">
          All Folders
        </h2>
        <span className="text-sm text-foreground-muted ml-1">
          ({folders.length})
        </span>
      </motion.div>

      {folders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 rounded-2xl border border-dashed border-border-custom"
        >
          <Layers size={40} className="mx-auto text-foreground-muted mb-3" />
          <p className="text-foreground-secondary text-sm">
            No folders yet. Create your first folder to get started!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder, i) => (
            <FolderCard key={folder.id} {...folder} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
