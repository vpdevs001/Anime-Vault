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
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
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
      {/* Trigger — a sealed scroll tag */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2.5 px-4 py-2.5 rounded-lg group",
          "bg-surface/80 border border-[var(--ink-line)]",
          "text-foreground-muted text-sm",
          "hover:border-accent-cursed/50 hover:bg-surface-hover hover:shadow-[0_0_16px_rgba(157,92,255,0.12)]",
          "transition-all duration-300",
          className
        )}
      >
        <Search size={16} className="group-hover:text-accent-hollow transition-colors" />
        <span className="hidden sm:inline">Search the vault...</span>
        <span className="sm:hidden">Search...</span>
        <span className="hidden sm:inline font-[family-name:var(--font-mincho)] text-xs text-foreground-muted/50 group-hover:text-accent-hollow/70 transition-colors">
          検索
        </span>
        <kbd className="hidden sm:inline-flex ml-auto text-xs px-1.5 py-0.5 rounded bg-background-secondary border border-border-custom text-foreground-muted meta-mono">
          ⌘K
        </kbd>
      </button>

      {/* Search Domain */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] backdrop-blur-md"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 20%, rgba(91,43,224,0.18) 0%, rgba(6,6,11,0.8) 70%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4 pointer-events-none">
              <motion.div
                className="w-full max-w-xl glass rounded-2xl border border-glass-border shadow-2xl overflow-hidden pointer-events-auto relative"
                initial={{ opacity: 0, scale: 0.95, y: -18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -18 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] animate-energy"
                  style={{
                    background:
                      "linear-gradient(90deg, #3fc1ff, #9d5cff, #ff4a3d, #3fc1ff)",
                    backgroundSize: "200% 100%",
                  }}
                  aria-hidden
                />

                {/* Input row */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border-custom">
                  <Search size={18} className="text-accent-hollow shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Seek a scroll by name, tag, or domain..."
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground-muted text-sm"
                  />
                  <button
                    onClick={handleClose}
                    className="p-1 rounded-md hover:bg-surface-hover text-foreground-muted hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto">
                  {loading && (
                    <div className="p-6 flex items-center justify-center gap-3 text-foreground-muted text-sm">
                      <span className="w-4 h-4 rounded-full border-2 border-accent-cursed/30 border-t-accent-hollow animate-spin" />
                      Unsealing records...
                    </div>
                  )}

                  {!loading && results && (
                    <div className="py-2">
                      {results.folders.length > 0 && (
                        <div className="mb-1">
                          <div className="px-5 py-1.5 text-xs font-semibold text-foreground-muted uppercase tracking-wider flex items-center gap-2">
                            Scrolls
                            <span className="font-[family-name:var(--font-mincho)] normal-case tracking-normal text-accent-slayer/60">
                              巻物
                            </span>
                          </div>
                          {results.folders.map((folder) => (
                            <a
                              key={folder.id}
                              href={`/folders/${folder.id}`}
                              className="flex items-center gap-3 px-5 py-2.5 hover:bg-surface-hover transition-colors"
                              onClick={handleClose}
                            >
                              <Folder size={16} style={{ color: folder.accentColor }} />
                              <span className="text-sm text-foreground flex-1 truncate">
                                {folder.name}
                              </span>
                              <span className="text-[11px] text-foreground-muted meta-mono">
                                {folder.linkCount} sealed
                              </span>
                            </a>
                          ))}
                        </div>
                      )}

                      {results.links.length > 0 && (
                        <div>
                          <div className="px-5 py-1.5 text-xs font-semibold text-foreground-muted uppercase tracking-wider flex items-center gap-2">
                            Links
                            <span className="font-[family-name:var(--font-mincho)] normal-case tracking-normal text-accent-chakra/60">
                              鎖
                            </span>
                          </div>
                          {results.links.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-5 py-2.5 hover:bg-surface-hover transition-colors group"
                              onClick={handleClose}
                            >
                              {link.faviconUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={link.faviconUrl} alt="" className="w-5 h-5 rounded" />
                              ) : (
                                <ExternalLink size={16} className="text-foreground-muted" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-foreground truncate group-hover:text-accent-chakra transition-colors">
                                  {link.title || link.url}
                                </div>
                                {link.linkTags && link.linkTags.length > 0 && (
                                  <div className="flex gap-1 mt-0.5">
                                    {link.linkTags.slice(0, 3).map((lt: { tag: { name: string } }) => (
                                      <span
                                        key={lt.tag.name}
                                        className="text-[10px] px-1.5 py-0.5 rounded-sm bg-accent-chakra/10 text-accent-chakra border border-accent-chakra/25"
                                      >
                                        {lt.tag.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <ExternalLink size={14} className="text-foreground-muted shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}

                      {results.links.length === 0 && results.folders.length === 0 && (
                        <div className="p-8 text-center">
                          <p className="text-foreground-muted text-sm">
                            No scrolls answer to &ldquo;{query}&rdquo;
                          </p>
                          <p className="font-[family-name:var(--font-mincho)] text-foreground-muted/50 text-xs mt-2">
                            見つからない
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!loading && !results && query === "" && (
                    <div className="p-8 text-center text-foreground-muted text-sm">
                      Speak the name of what you seek
                      <span className="block font-[family-name:var(--font-mincho)] text-xs text-foreground-muted/50 mt-2">
                        名を唱えよ
                      </span>
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