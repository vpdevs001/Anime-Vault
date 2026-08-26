"use client";

import { useState } from "react";
import { HeroBanner } from "@/components/sections/hero-banner";
import { FavoritesStrip } from "@/components/sections/favorites-strip";
import { RecentsStrip } from "@/components/sections/recents-strip";
import { FolderGrid } from "@/components/sections/folder-grid";
import { SearchBar } from "@/components/ui/search-bar";
import { QuickAddButton } from "@/components/ui/quick-add-button";
import { Modal } from "@/components/ui/modal";
import { FolderForm } from "@/components/forms/folder-form";
import { LinkForm } from "@/components/forms/link-form";

export interface DashboardClientProps {
  folders: Array<{
    id: string;
    name: string;
    description: string | null;
    icon: string;
    accentColor: string;
    linkCount: number;
  }>;
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
  allTags: string[];
}

export function DashboardClient({
  folders,
  favorites,
  recents,
  allTags,
}: DashboardClientProps) {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6 flex justify-end">
        <SearchBar className="w-full sm:w-80" />
      </div>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Favorites Strip */}
      <FavoritesStrip favorites={favorites} />

      {/* Recents Strip */}
      <RecentsStrip recents={recents} />

      {/* Folder Grid */}
      <FolderGrid folders={folders} />

      {/* Quick Add FAB */}
      <QuickAddButton
        onAddLink={() => setShowLinkModal(true)}
        onAddFolder={() => setShowFolderModal(true)}
      />

      {/* Create Folder Modal */}
      <Modal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        title="Create Folder"
      >
        <FolderForm onSuccess={() => setShowFolderModal(false)} />
      </Modal>

      {/* Create Link Modal */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title="Add Link"
      >
        <LinkForm
          folders={folders.map((f) => ({ id: f.id, name: f.name }))}
          existingTags={allTags}
          onSuccess={() => setShowLinkModal(false)}
        />
      </Modal>
    </>
  );
}
