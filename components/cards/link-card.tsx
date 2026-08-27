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
    // Track the open, then let the link open in a new tab
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      className="group"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-md",
          "bg-surface border-2 border-[var(--ink-line)]",
          "transition-all duration-250",
          "hover:border-[var(--border-hover)] hover:bg-surface-hover",
          "hover:-translate-x-0.5 hover:-translate-y-0.5",
          "hover:shadow-[var(--sticker-shadow)]"
        )}
      >
        {/* Preview Image */}
        {previewImageUrl && (
          <div className="relative h-32 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          </div>
        )}

        <div className="p-4">
          {/* Top row: favicon + title + star */}
          <div className="flex items-start gap-3">
            {/* Favicon */}
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
                <div className="w-6 h-6 rounded bg-accent-primary/15 flex items-center justify-center">
                  <ExternalLink size={12} className="text-accent-primary" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpen}
                className="block"
              >
                <h4 className="text-sm font-medium text-foreground truncate hover:text-accent-primary transition-colors">
                  {title || url}
                </h4>
                <p className="text-xs text-foreground-muted mt-0.5 truncate meta-mono">
                  {hostname}
                </p>
              </a>
            </div>

            {/* Favorite — hanko ink-stamp */}
            <button
              onClick={handleFavorite}
              className="shrink-0 p-1 transition-all duration-200 hover:scale-110"
            >
              <span
                className="hanko-stamp"
                data-active={optimisticFav}
                key={optimisticFav ? "on" : "off"}
              >
                <Star
                  size={16}
                  className={cn(
                    "transition-colors",
                    optimisticFav
                      ? "fill-star-active text-star-active"
                      : "text-star-inactive hover:text-star-active"
                  )}
                />
              </span>
            </button>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-foreground-secondary mt-2 line-clamp-2">
              {description}
            </p>
          )}

          {/* Tags + Folder */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {linkTags?.map((lt) => (
              <span key={lt.tag.id} className="tag-chip text-[11px]">
                {lt.tag.name}
              </span>
            ))}
            {showFolder && folderName && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-active text-foreground-muted">
                📁 {folderName}
              </span>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
