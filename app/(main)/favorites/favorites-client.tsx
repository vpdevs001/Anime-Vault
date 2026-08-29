"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Heart, ChevronDown, Loader2 } from "lucide-react";
import { LinkCard } from "@/components/cards/link-card";
import { PageHeader } from "@/components/ui/page-header";
import { ShinigamiEye } from "@/components/fx/shinigami-eye";
import { getFavoritesPage } from "@/lib/actions/links";

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
  total?: number;
  totalPages?: number;
}

export function FavoritesClient({ favorites: initialFavorites, total = 0, totalPages = 1 }: FavoritesClientProps) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasMore = page < totalPages;

  // Same reasoning as the folder detail view: re-sync when the server sends
  // fresh data so favorites toggled/added elsewhere don't require a hard
  // reload. Derived during render (React's documented pattern) rather than
  // via useEffect, which would cost an extra render pass on every refresh.
  const [prevInitialFavorites, setPrevInitialFavorites] = useState(initialFavorites);
  if (initialFavorites !== prevInitialFavorites) {
    setPrevInitialFavorites(initialFavorites);
    setFavorites(initialFavorites);
    setPage(1);
  }

  async function handleLoadMore() {
    setIsLoadingMore(true);
    const next = await getFavoritesPage(page + 1);
    setFavorites((prev) => [
      ...prev,
      ...(next.favorites as typeof initialFavorites),
    ]);
    setPage((p) => p + 1);
    setIsLoadingMore(false);
  }

  return (
    <div>
      <PageHeader
        icon={<Heart size={24} style={{ color: "#d7263d" }} />}
        title="Sealed Favorites"
        kanji="印"
        accent="#d7263d"
        subtitle={`${total || favorites.length} ${(total || favorites.length) === 1 ? "scroll" : "scrolls"} bear your seal`}
      >
        <ShinigamiEye size={52} />
      </PageHeader>

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
        <>
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

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="btn-ghost flex items-center gap-2 disabled:opacity-60"
              >
                {isLoadingMore ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <ChevronDown size={15} />
                )}
                {isLoadingMore
                  ? "Unsealing more scrolls..."
                  : `Load more (${favorites.length} of ${total})`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
