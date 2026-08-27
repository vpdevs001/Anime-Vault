"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { LinkCard } from "@/components/cards/link-card";
import { PageHeader } from "@/components/ui/page-header";

export interface FavoritesClientProps {
  favorites: Array<{
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

export function FavoritesClient({ favorites }: FavoritesClientProps) {
  return (
    <div>
      <PageHeader
        icon={<Heart size={24} style={{ color: "#d7263d" }} />}
        title="Sealed Favorites"
        kanji="印"
        accent="#d7263d"
        subtitle={`${favorites.length} ${favorites.length === 1 ? "scroll" : "scrolls"} bear your seal`}
      />

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center py-24 rounded-2xl border border-dashed border-[rgba(178,168,255,0.2)] overflow-hidden"
        >
          {/* Ghost kanji */}
          <span
            className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-mincho)] font-bold text-[10rem] leading-none pointer-events-none select-none"
            style={{ color: "transparent", WebkitTextStroke: "1px rgba(215,38,61,0.12)" }}
            aria-hidden
          >
            空
          </span>
          <Heart size={40} className="mx-auto text-accent-crimson/50 mb-4 relative animate-float" />
          <p className="text-foreground-secondary text-sm relative">
            No seals stamped yet. Mark any link with the seal to bind it here!
          </p>
          <p className="font-[family-name:var(--font-mincho)] text-foreground-muted/50 text-xs mt-2 relative">
            まだ印がない
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((link, i) => (
            <LinkCard
              key={link.id}
              {...link}
              index={i}
              showFolder
              folderName={link.folder?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
