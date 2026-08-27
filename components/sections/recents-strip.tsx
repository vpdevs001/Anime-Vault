"use client";

import { Clock } from "lucide-react";
import { LinkCard } from "../cards/link-card";
import { SectionHeader } from "@/components/ui/section-header";

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
    <section className="mb-10">
      <SectionHeader
        icon={Clock}
        title="Fresh Scrolls"
        kanji="新"
        count={recents.length}
        accent="#3fc1ff"
      />

      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin">
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
