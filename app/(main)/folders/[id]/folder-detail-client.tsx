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
    if (!confirm("Delete this folder and all its links?")) return;
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
          className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        <div className="flex items-start gap-4">
          {/* Folder Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${folder.accentColor}18` }}
          >
            <DynamicIcon
              name={folder.icon}
              size={28}
              style={{ color: folder.accentColor }}
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-rajdhani)] tracking-wide text-foreground"
            >
              {folder.name}
            </motion.h1>
            {folder.description && (
              <p className="text-sm text-foreground-muted mt-1">
                {folder.description}
              </p>
            )}
            <p className="text-xs text-foreground-muted mt-1">
              {totalLinks} {totalLinks === 1 ? "link" : "links"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowEditFolder(true)}
              className="btn-ghost p-2.5"
              title="Edit folder"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDeleteFolder}
              className="btn-ghost p-2.5 hover:text-accent-crimson hover:border-accent-crimson/30"
              title="Delete folder"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Accent line */}
        <div
          className="h-[2px] mt-4 rounded-full opacity-40"
          style={{
            background: `linear-gradient(90deg, ${folder.accentColor}, transparent)`,
          }}
        />
      </div>

      {/* Links Grid */}
      {initialLinks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 rounded-2xl border border-dashed border-border-custom"
        >
          <Link2
            size={40}
            className="mx-auto text-foreground-muted mb-3"
          />
          <p className="text-foreground-secondary text-sm mb-4">
            No links in this folder yet.
          </p>
          <button
            onClick={() => setShowAddLink(true)}
            className="btn-primary px-6"
          >
            Add First Link
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
      >
        <div className="space-y-2">
          {allFolders
            .filter((f) => f.id !== folder.id)
            .map((f) => (
              <button
                key={f.id}
                onClick={() => movingLinkId && handleMoveLink(movingLinkId, f.id)}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-hover text-foreground-secondary hover:text-foreground transition-colors"
                disabled={isPending}
              >
                {f.name}
              </button>
            ))}
          {allFolders.filter((f) => f.id !== folder.id).length === 0 && (
            <p className="text-sm text-foreground-muted text-center py-4">
              No other folders to move to.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
