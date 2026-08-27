"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Pencil, Trash2, ArrowLeft, Link2 } from "lucide-react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { LinkCard } from "@/components/cards/link-card";
import { Modal } from "@/components/ui/modal";
import { FolderForm } from "@/components/forms/folder-form";
import { LinkForm } from "@/components/forms/link-form";
import { QuickAddButton } from "@/components/ui/quick-add-button";
import { deleteFolder } from "@/lib/actions/folders";
import { deleteLink, moveLink } from "@/lib/actions/links";
import Link from "next/link";

export interface FolderDetailClientProps {
  folder: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    accentColor: string;
    coverImageUrl: string | null;
  };
  initialLinks: Array<{
    id: string;
    url: string;
    title: string | null;
    description: string | null;
    faviconUrl: string | null;
    previewImageUrl: string | null;
    isFavorite: boolean;
    folderId: string;
    linkTags?: { tag: { id: string; name: string } }[];
  }>;
  totalLinks: number;
  totalPages?: number;
  allFolders: Array<{ id: string; name: string }>;
  allTags: string[];
}

export function FolderDetailClient({
  folder,
  initialLinks,
  totalLinks,
  allFolders,
  allTags,
}: FolderDetailClientProps) {
  const router = useRouter();
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [editingLink, setEditingLink] = useState<typeof initialLinks[0] | null>(null);
  const [movingLinkId, setMovingLinkId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDeleteFolder() {
    if (!confirm("Burn this scroll and every link sealed inside it?")) return;
    startTransition(async () => {
      await deleteFolder(folder.id);
      router.push("/");
    });
  }

  function handleDeleteLink(linkId: string) {
    if (!confirm("Delete this link?")) return;
    startTransition(async () => {
      await deleteLink(linkId);
      router.refresh();
    });
  }

  function handleMoveLink(linkId: string, newFolderId: string) {
    startTransition(async () => {
      await moveLink(linkId, newFolderId);
      setMovingLinkId(null);
      router.refresh();
    });
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-accent-primary transition-colors mb-5 meta-mono group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to the Vault
        </Link>

        <div className="flex items-start gap-4">
          {/* Seal icon — ringed by a cursed seal */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="relative w-16 h-16 shrink-0"
          >
            <div
              className="cursed-ring absolute -inset-1.5"
              style={{ borderColor: `${folder.accentColor}55` }}
            />
            <div
              className="absolute inset-0 rounded-md border-2 flex items-center justify-center -rotate-3"
              style={{
                borderColor: `${folder.accentColor}77`,
                backgroundColor: `${folder.accentColor}12`,
                boxShadow: `0 0 24px ${folder.accentColor}30`,
              }}
            >
              <DynamicIcon
                name={folder.icon}
                size={28}
                style={{ color: folder.accentColor }}
              />
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="flex items-baseline gap-3 flex-wrap"
            >
              <h1 className="text-3xl sm:text-4xl font-[family-name:var(--font-rajdhani)] tracking-[0.06em] text-foreground leading-none">
                {folder.name}
              </h1>
              <span
                className="font-[family-name:var(--font-mincho)] text-lg leading-none"
                style={{ color: `${folder.accentColor}cc` }}
              >
                巻
              </span>
            </motion.div>
            {folder.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.16 }}
                className="text-sm text-foreground-secondary mt-1.5"
              >
                {folder.description}
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22 }}
              className="text-xs text-foreground-muted mt-1.5 meta-mono flex items-center gap-1.5"
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: folder.accentColor,
                  boxShadow: `0 0 6px ${folder.accentColor}`,
                }}
              />
              {totalLinks} {totalLinks === 1 ? "link" : "links"} sealed in this scroll
            </motion.p>
            <div
              className="brush-underline animate-brush h-[3px] w-36 mt-2.5"
              style={{
                background: `linear-gradient(90deg, ${folder.accentColor} 0%, ${folder.accentColor}88 55%, transparent 100%)`,
              }}
            />
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 shrink-0"
          >
            <button
              onClick={() => setShowEditFolder(true)}
              className="p-2.5 rounded-lg bg-surface border border-[var(--ink-line)] text-foreground-secondary hover:text-foreground hover:border-border-hover transition-all"
              title="Edit scroll"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDeleteFolder}
              disabled={isPending}
              className="p-2.5 rounded-lg bg-surface border border-[var(--ink-line)] text-foreground-secondary hover:text-accent-crimson hover:border-accent-crimson/50 transition-all"
              title="Burn scroll"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Links */}
      {initialLinks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center py-24 rounded-2xl border border-dashed border-[rgba(178,168,255,0.2)] overflow-hidden"
        >
          <span
            className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-mincho)] font-bold text-[9rem] leading-none pointer-events-none select-none"
            style={{
              color: "transparent",
              WebkitTextStroke: `1px ${folder.accentColor}22`,
            }}
            aria-hidden
          >
            空
          </span>
          <Link2 size={40} className="mx-auto text-foreground-muted mb-4 relative animate-float" />
          <p className="text-foreground-secondary text-sm mb-1 relative">
            This scroll is still blank.
          </p>
          <p className="font-[family-name:var(--font-mincho)] text-foreground-muted/50 text-xs mb-6 relative">
            白紙の巻物
          </p>
          <button
            onClick={() => setShowAddLink(true)}
            className="btn-primary px-6 relative"
          >
            Seal the First Link
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialLinks.map((link, i) => (
            <LinkCard
              key={link.id}
              {...link}
              index={i}
              onEdit={() => setEditingLink(link)}
              onDelete={() => handleDeleteLink(link.id)}
              onMove={() => setMovingLinkId(link.id)}
            />
          ))}
        </div>
      )}

      {/* Quick Add */}
      <QuickAddButton
        onAddLink={() => setShowAddLink(true)}
        onAddFolder={() => {}}
      />

      {/* Edit Folder Modal */}
      <Modal
        isOpen={showEditFolder}
        onClose={() => setShowEditFolder(false)}
        title="Edit Folder"
        kanji="巻"
      >
        <FolderForm
          folder={folder}
          onSuccess={() => {
            setShowEditFolder(false);
            router.refresh();
          }}
        />
      </Modal>

      {/* Add Link Modal */}
      <Modal
        isOpen={showAddLink}
        onClose={() => setShowAddLink(false)}
        title="Add Link"
        kanji="鎖"
      >
        <LinkForm
          folders={allFolders}
          defaultFolderId={folder.id}
          existingTags={allTags}
          onSuccess={() => {
            setShowAddLink(false);
            router.refresh();
          }}
        />
      </Modal>

      {/* Edit Link Modal */}
      <Modal
        isOpen={!!editingLink}
        onClose={() => setEditingLink(null)}
        title="Edit Link"
        kanji="鎖"
      >
        {editingLink && (
          <LinkForm
            link={editingLink}
            folders={allFolders}
            existingTags={allTags}
            onSuccess={() => {
              setEditingLink(null);
              router.refresh();
            }}
          />
        )}
      </Modal>

      {/* Move Link Modal */}
      <Modal
        isOpen={!!movingLinkId}
        onClose={() => setMovingLinkId(null)}
        title="Move to Folder"
        kanji="移"
      >
        <div className="space-y-2">
          {allFolders
            .filter((f) => f.id !== folder.id)
            .map((f) => (
              <button
                key={f.id}
                onClick={() => movingLinkId && handleMoveLink(movingLinkId, f.id)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-hover text-foreground-secondary hover:text-foreground transition-colors border border-transparent hover:border-[var(--ink-line)]"
                disabled={isPending}
              >
                {f.name}
              </button>
            ))}
          {allFolders.filter((f) => f.id !== folder.id).length === 0 && (
            <p className="text-sm text-foreground-muted text-center py-4">
              No other scrolls to move to.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}