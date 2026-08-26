"use client";

import { useState, useTransition, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { TagInput } from "../ui/tag-input";
import { createLink, updateLink } from "@/lib/actions/links";

interface LinkFormFolder {
  id: string;
  name: string;
}

interface LinkFormProps {
  link?: {
    id: string;
    url: string;
    title?: string | null;
    description?: string | null;
    faviconUrl?: string | null;
    previewImageUrl?: string | null;
    isFavorite?: boolean;
    folderId: string;
    linkTags?: { tag: { id: string; name: string } }[];
  };
  folders: LinkFormFolder[];
  defaultFolderId?: string;
  existingTags?: string[];
  onSuccess?: () => void;
}

export function LinkForm({
  link,
  folders,
  defaultFolderId,
  existingTags = [],
  onSuccess,
}: LinkFormProps) {
  const isEdit = !!link;
  const [url, setUrl] = useState(link?.url || "");
  const [title, setTitle] = useState(link?.title || "");
  const [description, setDescription] = useState(link?.description || "");
  const [faviconUrl, setFaviconUrl] = useState(link?.faviconUrl || "");
  const [previewImageUrl, setPreviewImageUrl] = useState(
    link?.previewImageUrl || ""
  );
  const [folderId, setFolderId] = useState(
    link?.folderId || defaultFolderId || folders[0]?.id || ""
  );
  const [tagNames, setTagNames] = useState<string[]>(
    link?.linkTags?.map((lt) => lt.tag.name) || []
  );
  const [isFavorite, setIsFavorite] = useState(link?.isFavorite || false);
  const [unfurling, setUnfurling] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const unfurlUrl = useCallback(async (urlToUnfurl: string) => {
    if (!urlToUnfurl.trim()) return;
    // Basic URL validation
    try {
      new URL(urlToUnfurl);
    } catch {
      return;
    }

    setUnfurling(true);
    try {
      const res = await fetch("/api/unfurl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToUnfurl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title && !title) setTitle(data.title);
        if (data.description && !description)
          setDescription(data.description);
        if (data.favicon) setFaviconUrl(data.favicon);
        if (data.image) setPreviewImageUrl(data.image);
      }
    } catch {
      // Silent fail — user can fill in manually
    } finally {
      setUnfurling(false);
    }
  }, [title, description]);

  function handleUrlBlur() {
    if (url && !isEdit) {
      unfurlUrl(url);
    }
  }

  function handleUrlPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text");
    if (pasted && !isEdit) {
      // Wait for state to update
      setTimeout(() => unfurlUrl(pasted), 100);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setError("URL is required");
      return;
    }
    if (!folderId) {
      setError("Please select a folder");
      return;
    }
    setError("");

    startTransition(async () => {
      try {
        if (isEdit && link) {
          await updateLink(link.id, {
            url: url.trim(),
            title: title.trim() || undefined,
            description: description.trim() || undefined,
            faviconUrl: faviconUrl.trim() || undefined,
            previewImageUrl: previewImageUrl.trim() || undefined,
            folderId,
            isFavorite,
            tagNames,
          });
        } else {
          await createLink({
            url: url.trim(),
            title: title.trim() || undefined,
            description: description.trim() || undefined,
            faviconUrl: faviconUrl.trim() || undefined,
            previewImageUrl: previewImageUrl.trim() || undefined,
            folderId,
            isFavorite,
            tagNames,
          });
        }
        onSuccess?.();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
          URL *
        </label>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur}
            onPaste={handleUrlPaste}
            placeholder="https://..."
            className="input pr-10"
            autoFocus={!isEdit}
          />
          {unfurling && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 size={16} className="animate-spin text-accent-primary" />
            </div>
          )}
        </div>
        {unfurling && (
          <p className="text-xs text-accent-primary mt-1">
            Fetching page info...
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Auto-fetched or enter manually"
          className="input"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
          Description / Notes
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional notes about this link"
          className="input resize-none h-16"
        />
      </div>

      {/* Folder */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
          Folder *
        </label>
        <select
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="input appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Select a folder
          </option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
          Tags
        </label>
        <TagInput
          value={tagNames}
          onChange={setTagNames}
          suggestions={existingTags}
        />
      </div>

      {/* Preview (collapsible) */}
      {(faviconUrl || previewImageUrl) && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary border border-border-custom">
          {faviconUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={faviconUrl}
              alt="Favicon"
              className="w-6 h-6 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          {previewImageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewImageUrl}
              alt="Preview"
              className="h-12 rounded object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <span className="text-xs text-foreground-muted">Auto-detected</span>
        </div>
      )}

      {/* Favorite Toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
          className="w-4 h-4 rounded border-border-custom accent-star-active"
        />
        <span className="text-sm text-foreground-secondary">
          Add to favorites
        </span>
      </label>

      {/* Error */}
      {error && <p className="text-sm text-accent-crimson">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || unfurling}
        className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending
          ? isEdit
            ? "Saving..."
            : "Adding Link..."
          : isEdit
            ? "Save Changes"
            : "Add Link"}
      </button>
    </form>
  );
}
