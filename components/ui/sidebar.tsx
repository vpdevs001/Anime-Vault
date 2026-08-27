"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Heart,
  Tag,
  Bot,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarFolder {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
  linkCount: number;
}

interface SidebarProps {
  folders: SidebarFolder[];
}

/* Each route carries its own seal — a mincho kanji beside the label */
const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home, kanji: "蔵" },
  { href: "/favorites", label: "Favorites", icon: Heart, kanji: "印" },
  { href: "/tags", label: "Tags", icon: Tag, kanji: "札" },
  { href: "/ask", label: "Ask Vault", icon: Bot, kanji: "問" },
];

export function Sidebar({ folders }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl glass lg:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 flex flex-col",
          "bg-background-secondary/90 backdrop-blur-md",
          "border-r border-[rgba(178,168,255,0.12)]",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-[76px]" : "w-64",
          "max-lg:-translate-x-full max-lg:w-64",
          mobileOpen && "max-lg:translate-x-0"
        )}
      >
        {/* Cursed edge — violet energy line down the right border */}
        <div
          className="absolute top-0 right-0 bottom-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(157,92,255,0.4) 30%, rgba(255,74,61,0.35) 70%, transparent)",
          }}
          aria-hidden
        />

        {/* Logo — rotating cursed ring around 蔵 */}
        <div className="flex items-center gap-3 px-5 h-20 border-b border-border-custom shrink-0 relative overflow-hidden">
          <div className="relative w-10 h-10 shrink-0">
            <div className="cursed-ring absolute -inset-1" />
            <div className="absolute inset-0 rounded-sm border-2 border-accent-primary flex items-center justify-center -rotate-6 bg-accent-primary/10 glow-ember">
              <span className="font-[family-name:var(--font-mincho)] font-bold text-accent-primary text-lg leading-none">
                蔵
              </span>
            </div>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-[family-name:var(--font-rajdhani)] text-2xl tracking-wide text-foreground leading-none">
                Anime Vault
              </span>
              <span className="font-[family-name:var(--font-mincho)] text-[10px] text-foreground-muted tracking-[0.3em] mt-0.5">
                術の蔵
              </span>
            </motion.div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "text-foreground"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface-hover"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg border border-accent-primary/40"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,74,61,0.16), rgba(255,159,46,0.06))",
                      boxShadow: "0 0 18px rgba(255,74,61,0.15)",
                    }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-blade"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full"
                    style={{
                      background: "var(--gradient-primary)",
                      boxShadow: "0 0 10px rgba(255,74,61,0.7)",
                    }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  />
                )}
                <Icon
                  size={20}
                  className={cn(
                    "shrink-0 relative transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
                    isActive && "text-accent-primary"
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="text-sm font-medium relative flex-1">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "font-[family-name:var(--font-mincho)] text-xs relative transition-all duration-300",
                        isActive
                          ? "text-accent-primary opacity-100"
                          : "text-foreground-muted opacity-40 group-hover:opacity-90"
                      )}
                    >
                      {item.kanji}
                    </span>
                  </>
                )}
              </Link>
            );
          })}

          {/* Folders Section */}
          {!collapsed && folders.length > 0 && (
            <div className="mt-7">
              <div className="px-3 mb-2.5 flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                  Scrolls
                </span>
                <span className="font-[family-name:var(--font-mincho)] text-[10px] text-foreground-muted/60">
                  巻物
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-[rgba(178,168,255,0.18)] to-transparent" />
              </div>
              <div className="space-y-0.5">
                {folders.map((folder) => {
                  const isActive = pathname === `/folders/${folder.id}`;

                  return (
                    <Link
                      key={folder.id}
                      href={`/folders/${folder.id}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                        isActive ? "bg-surface-active" : "hover:bg-surface-hover"
                      )}
                    >
                      <DynamicIcon
                        name={folder.icon}
                        size={16}
                        style={{
                          color: folder.accentColor,
                          filter: isActive
                            ? `drop-shadow(0 0 6px ${folder.accentColor})`
                            : undefined,
                        }}
                        className="shrink-0 transition-all duration-300 group-hover:scale-110"
                      />
                      <span
                        className={cn(
                          "text-sm truncate flex-1",
                          isActive
                            ? "text-foreground font-medium"
                            : "text-foreground-secondary group-hover:text-foreground"
                        )}
                      >
                        {folder.name}
                      </span>
                      <span className="text-[11px] text-foreground-muted meta-mono">
                        {folder.linkCount}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Collapsed folder dots */}
          {collapsed && folders.length > 0 && (
            <div className="mt-7 flex flex-col items-center gap-2.5">
              {folders.slice(0, 8).map((folder) => (
                <Link
                  key={folder.id}
                  href={`/folders/${folder.id}`}
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-[1.7]"
                  style={{
                    backgroundColor: folder.accentColor,
                    boxShadow: `0 0 8px ${folder.accentColor}66`,
                  }}
                  title={folder.name}
                />
              ))}
            </div>
          )}
        </nav>

        {/* Seigaiha wave strip — Demon Slayer footer */}
        {!collapsed && (
          <div
            className="h-6 mx-3 mb-2 rounded opacity-60 animate-wave seigaiha"
            aria-hidden
          />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-12 border-t border-border-custom text-foreground-muted hover:text-accent-primary transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
}