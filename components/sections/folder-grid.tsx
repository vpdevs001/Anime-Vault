"use client";

import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { FolderCard } from "../cards/folder-card";
import { SectionHeader } from "@/components/ui/section-header";

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
      <SectionHeader
        icon={Layers}
        title="Village Archives"
        kanji="巻"
        count={folders.length}
        accent="#2fd4b7"
      />

      {folders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center py-16 rounded-2xl border border-dashed border-[rgba(178,168,255,0.2)] overflow-hidden"
        >
          <div className="absolute inset-0 seigaiha opacity-40 pointer-events-none" />
          <Layers size={40} className="mx-auto text-foreground-muted mb-3 relative" />
          <p className="text-foreground-secondary text-sm relative">
            No scrolls sealed yet. Forge your first folder to begin the archive!
          </p>
          <p className="font-[family-name:var(--font-mincho)] text-foreground-muted/60 text-xs mt-2 relative">
            巻物はまだない
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
