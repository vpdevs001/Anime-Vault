"use client";

import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { LinkCard } from "../cards/link-card";

interface RecentsStripProps {
  recents: Array<{
    id: string;
    url: string;
    title: string | null;
    description: string | null;
    faviconUrl: string | null;
    previewImageUrl: string | null;
    isFavorite: boolean;
    linkTags?: { tag: { id: string; name: string } }[];
    folder?: { name: string } | null;
  }>;
}

export function RecentsStrip({ recents }: RecentsStripProps) {
  if (recents.length === 0) return null;

  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <Clock size={18} className="text-accent-rasengan" />
        <h2 className="text-lg font-bold font-[family-name:var(--font-rajdhani)] tracking-wide text-foreground">
          Recently Added
        </h2>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {recents.map((link, i) => (
          <div key={link.id} className="min-w-[280px] max-w-[300px] shrink-0">
            <LinkCard
              {...link}
              index={i}
              showFolder
              folderName={link.folder?.name}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
