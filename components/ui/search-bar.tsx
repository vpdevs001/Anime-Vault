"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ExternalLink, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Link as LinkType, Folder as FolderType } from "@/lib/db/schema";

interface SearchResult {
  links: (LinkType & { folder?: FolderType; linkTags?: { tag: { name: string } }[] })[];
  folders: (FolderType & { linkCount: number })[];
}

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults(null);
  }, []);

  // Cmd+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 250);
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl",
          "bg-surface border border-border-custom",
          "text-foreground-muted text-sm",
          "hover:border-border-hover hover:bg-surface-hover",
          "transition-all duration-200",
          className
        )}
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search your vault...</span>
        <span className="sm:hidden">Search...</span>
        <kbd className="hidden sm:inline-flex ml-auto text-xs px-1.5 py-0.5 rounded bg-background-secondary border border-border-custom text-foreground-muted">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            <div
              className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4 pointer-events-none"
            >
              <motion.div
                className="w-full max-w-xl glass rounded-2xl overflow-hidden shadow-2xl pointer-events-auto"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border-custom">
                  <Search size={18} className="text-accent-primary shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Search links, folders, tags..."
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground-muted"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setResults(null);
                        inputRef.current?.focus();
                      }}
                      className="text-foreground-muted hover:text-foreground transition-colors p-1"
                      title="Clear search query"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-foreground-muted hover:text-foreground transition-colors text-xs px-1.5 py-0.5 rounded bg-background-secondary border border-border-custom hover:bg-surface-hover"
                    title="Close (Esc)"
                  >
                    ESC
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto">
                  {loading && (
                    <div className="p-6 text-center text-foreground-muted text-sm">
                      Searching...
                    </div>
                  )}

                  {!loading && results && (
                    <div className="py-2">
                      {/* Folders */}
                      {results.folders.length > 0 && (
                        <div>
                          <div className="px-5 py-1.5 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                            Folders
                          </div>
                          {results.folders.map((folder) => (
                            <a
                              key={folder.id}
                              href={`/folders/${folder.id}`}
                              className="flex items-center gap-3 px-5 py-2.5 hover:bg-surface-hover transition-colors"
                              onClick={handleClose}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${folder.accentColor}20` }}
                              >
                                <Folder
                                  size={16}
                                  style={{ color: folder.accentColor }}
                                />
                              </div>
                              <div>
                                <div className="text-sm text-foreground">
                                  {folder.name}
                                </div>
                                <div className="text-xs text-foreground-muted">
                                  {folder.linkCount} links
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      {results.links.length > 0 && (
                        <div>
                          <div className="px-5 py-1.5 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                            Links
                          </div>
                          {results.links.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-5 py-2.5 hover:bg-surface-hover transition-colors"
                              onClick={handleClose}
                            >
                              {link.faviconUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={link.faviconUrl}
                                  alt=""
                                  className="w-5 h-5 rounded"
                                />
                              ) : (
                                <ExternalLink
                                  size={16}
                                  className="text-foreground-muted"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-foreground truncate">
                                  {link.title || link.url}
                                </div>
                                {link.linkTags && link.linkTags.length > 0 && (
                                  <div className="flex gap-1 mt-0.5">
                                    {link.linkTags.slice(0, 3).map((lt: { tag: { name: string } }) => (
                                      <span
                                        key={lt.tag.name}
                                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary"
                                      >
                                        {lt.tag.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <ExternalLink
                                size={14}
                                className="text-foreground-muted shrink-0"
                              />
                            </a>
                          ))}
                        </div>
                      )}

                      {results.links.length === 0 &&
                        results.folders.length === 0 && (
                          <div className="p-6 text-center text-foreground-muted text-sm">
                            No results found for &ldquo;{query}&rdquo;
                          </div>
                        )}
                    </div>
                  )}

                  {!loading && !results && query === "" && (
                    <div className="p-6 text-center text-foreground-muted text-sm">
                      Start typing to search your vault
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
