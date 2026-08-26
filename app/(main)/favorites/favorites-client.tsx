"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { LinkCard } from "@/components/cards/link-card";

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-accent-crimson/15 flex items-center justify-center">
          <Heart size={20} className="text-accent-crimson" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] tracking-wide text-foreground">
            Favorites
          </h1>
          <p className="text-sm text-foreground-muted">
            {favorites.length} {favorites.length === 1 ? "link" : "links"}
          </p>
        </div>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 rounded-2xl border border-dashed border-border-custom"
        >
          <Heart size={40} className="mx-auto text-foreground-muted mb-3" />
          <p className="text-foreground-secondary text-sm">
            No favorites yet. Star any link to see it here!
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
