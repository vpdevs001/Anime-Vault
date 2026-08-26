"use client";

import { useState, useTransition } from "react";
import { IconPicker } from "../ui/icon-picker";
import { ColorPicker } from "../ui/color-picker";
import { createFolder, updateFolder } from "@/lib/actions/folders";
import { DEFAULT_FOLDER_ICON, DEFAULT_ACCENT_COLOR } from "@/lib/constants";

interface FolderFormProps {
  folder?: {
    id: string;
    name: string;
    description?: string | null;
    icon: string;
    accentColor: string;
    coverImageUrl?: string | null;
  };
  onSuccess?: () => void;
}

export function FolderForm({ folder, onSuccess }: FolderFormProps) {
  const isEdit = !!folder;
  const [name, setName] = useState(folder?.name || "");
  const [description, setDescription] = useState(folder?.description || "");
  const [icon, setIcon] = useState(folder?.icon || DEFAULT_FOLDER_ICON);
  const [accentColor, setAccentColor] = useState(
    folder?.accentColor || DEFAULT_ACCENT_COLOR
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    folder?.coverImageUrl || ""
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Folder name is required");
      return;
    }
    setError("");

    startTransition(async () => {
      try {
        if (isEdit && folder) {
          await updateFolder(folder.id, {
            name: name.trim(),
            description: description.trim() || undefined,
            icon,
            accentColor,
            coverImageUrl: coverImageUrl.trim() || undefined,
          });
        } else {
          await createFolder({
            name: name.trim(),
            description: description.trim() || undefined,
            icon,
            accentColor,
            coverImageUrl: coverImageUrl.trim() || undefined,
          });
        }
        onSuccess?.();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
          Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dev Tools, Design Inspiration..."
          className="input"
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional — what goes in this folder?"
          className="input resize-none h-20"
        />
      </div>

      {/* Icon */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-2">
          Icon
        </label>
        <IconPicker value={icon} onChange={setIcon} accentColor={accentColor} />
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-2">
          Accent Color
        </label>
        <ColorPicker value={accentColor} onChange={setAccentColor} />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
          Cover Image URL
        </label>
        <input
          type="url"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="Optional — paste an image URL"
          className="input"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-accent-crimson">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending
          ? isEdit
            ? "Saving..."
            : "Creating..."
          : isEdit
            ? "Save Changes"
            : "Create Folder"}
      </button>
    </form>
  );
}
