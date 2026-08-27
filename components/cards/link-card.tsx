"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import {
  Star,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderInput,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite, trackLinkOpen } from "@/lib/actions/links";

interface LinkCardTag {
  tag: { id: string; name: string };
}

interface LinkCardProps {
  id: string;
  url: string;
  title?: string | null;
  description?: string | null;
  faviconUrl?: string | null;
  previewImageUrl?: string | null;
  isFavorite: boolean;
  linkTags?: LinkCardTag[];
  folderName?: string;
  index?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
  showFolder?: boolean;
}

export function LinkCard({
  id,
  url,
  title,
  description,
  faviconUrl,
  previewImageUrl,
  isFavorite,
  linkTags,
  folderName,
  index = 0,
  onEdit,
  onDelete,
  onMove,
  showFolder = false,
}: LinkCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [, startTransition] = useTransition();
  const [optimisticFav, setOptimisticFav] = useState(isFavorite);

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOptimisticFav(!optimisticFav);
    startTransition(() => {
      toggleFavorite(id);
    });
  }

  function handleOpen() {
    startTransition(() => {
      trackLinkOpen(id);
    });
  }

  const hostname = (() => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: "easeOut" }}
      className="group"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg",
          "bg-surface border-[1.5px] border-[var(--ink-line)]",
          "transition-all duration-300",
          "hover:border-[var(--border-hover)] hover:bg-surface-hover",
          "hover:-translate-y-1 hover:shadow-[5px_5px_0_rgba(157,92,255,0.22)]"
        )}
      >
        {/* Speed-line sweep — flashes across on hover (AoT) */}
        <div className="absolute inset-0 speedlines opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[1]" />

        {/* Corner kanji — ghosts in on hover */}
        <span
          className="absolute -bottom-3 -right-2 font-[family-name:var(--font-mincho)] font-bold text-7xl leading-none text-foreground/[0.05] group-hover:text-foreground/[0.09] transition-all duration-500 pointer-events-none select-none z-[1]"
          aria-hidden
        >
          巻
        </span>

        {/* Preview Image */}
        {previewImageUrl && (
          <div className="relative h-32 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[0.5deg]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          </div>
        )}

        <div className="p-4 relative z-[2]">
          {/* Top row: favicon + title + seal */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {faviconUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={faviconUrl}
                  alt=""
                  className="w-6 h-6 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-6 h-6 rounded bg-surface-active border border-[var(--ink-line)] flex items-center justify-center">
                  <ExternalLink size={12} className="text-foreground-muted" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpen}
                className="block text-sm font-semibold text-foreground truncate hover:text-accent-chakra transition-colors"
              >
                {title || hostname}
              </a>
              <span className="text-[11px] text-foreground-muted meta-mono truncate block">
                {hostname}
              </span>
            </div>

            {/* Favorite — the ink seal. Click slams the hanko down. */}
            <button
              onClick={handleFavorite}
              className="hanko-stamp shrink-0 p-1 -m-1 rounded transition-transform hover:scale-125 active:scale-90"
              data-active={optimisticFav}
              title={optimisticFav ? "Unseal" : "Seal as favorite"}
            >
              <Star
                size={17}
                className={cn(
                  "transition-all duration-300",
                  optimisticFav
                    ? "fill-star-active text-star-active drop-shadow-[0_0_8px_rgba(255,74,61,0.8)] -rotate-6"
                    : "text-star-inactive hover:text-foreground-secondary"
                )}
              />
            </button>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-foreground-secondary mt-2 line-clamp-2">
              {description}
            </p>
          )}

          {/* Tags — ofuda talismans + folder scroll */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {linkTags?.map((lt) => (
              <span key={lt.tag.id} className="tag-chip text-[11px]">
                {lt.tag.name}
              </span>
            ))}
            {showFolder && folderName && (
              <span className="text-[11px] px-2 py-0.5 rounded-sm bg-accent-cursed/10 text-accent-hollow border border-accent-cursed/25 meta-mono">
                巻 {folderName}
              </span>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-2 right-2 z-[3] opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-lg glass hover:bg-surface-hover transition-colors"
            >
              <MoreHorizontal size={14} className="text-foreground-secondary" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-40 py-1 rounded-xl glass border border-glass-border shadow-xl">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onEdit();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground-secondary hover:bg-surface-hover hover:text-foreground transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  )}
                  {onMove && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onMove();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground-secondary hover:bg-surface-hover hover:text-foreground transition-colors"
                    >
                      <FolderInput size={14} />
                      Move
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent-crimson hover:bg-surface-hover transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}