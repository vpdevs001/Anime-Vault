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

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/tags", label: "Tags", icon: Tag },
  { href: "/ask", label: "Ask Vault", icon: Bot },
];

export function Sidebar({ folders }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl glass lg:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 flex flex-col",
          "bg-background-secondary border-r border-border-custom",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-64",
          // Mobile
          "max-lg:-translate-x-full max-lg:w-64",
          mobileOpen && "max-lg:translate-x-0"
        )}
      >
        {/* Logo — hanko seal mark */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border-custom shrink-0">
          <div
            className="w-8 h-8 rounded-sm border-2 border-accent-primary flex items-center justify-center shrink-0 -rotate-6"
          >
            <span className="text-accent-primary font-[family-name:var(--font-rajdhani)] text-sm leading-none">
              蔵
            </span>
          </div>
          {!collapsed && (
            <motion.span
              className="font-[family-name:var(--font-rajdhani)] text-xl tracking-wide text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Anime Vault
            </motion.span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group",
                  isActive
                    ? "bg-accent-primary/12 text-accent-primary"
                    : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-accent-primary"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <Icon size={20} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}

          {/* Folders Section */}
          {!collapsed && folders.length > 0 && (
            <div className="mt-6">
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                Folders
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
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-surface-active"
                          : "hover:bg-surface-hover"
                      )}
                    >
                      <DynamicIcon
                        name={folder.icon}
                        size={16}
                        style={{ color: folder.accentColor }}
                        className="shrink-0"
                      />
                      <span
                        className={cn(
                          "text-sm truncate flex-1",
                          isActive
                            ? "text-foreground font-medium"
                            : "text-foreground-secondary"
                        )}
                      >
                        {folder.name}
                      </span>
                      <span className="text-[11px] text-foreground-muted">
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
            <div className="mt-6 flex flex-col items-center gap-2">
              {folders.slice(0, 8).map((folder) => (
                <Link
                  key={folder.id}
                  href={`/folders/${folder.id}`}
                  className="w-3 h-3 rounded-full transition-transform hover:scale-150"
                  style={{ backgroundColor: folder.accentColor }}
                  title={folder.name}
                />
              ))}
            </div>
          )}
        </nav>

        {/* Collapse Toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-12 border-t border-border-custom text-foreground-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
}
