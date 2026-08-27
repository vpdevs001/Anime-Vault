"use client";

import { cn } from "@/lib/utils";
import { Rasengan } from "@/components/fx/rasengan";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

export function LinkCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-18 rounded-full" />
      </div>
    </div>
  );
}

export function FolderCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

/**
 * The loader IS a jutsu — a Rasengan forming inside twin cursed seals.
 */
export function VaultLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative">
        {/* Outer seal rings */}
        <div className="cursed-ring absolute -inset-4" />
        <div className="cursed-ring-rev absolute -inset-8" />
        {/* The forming rasengan */}
        <Rasengan size={72} drift={false} />
      </div>
      <div className="flex items-center gap-3">
        <span className="meta-mono text-xs tracking-[0.3em] text-foreground-muted uppercase">
          Gathering chakra
        </span>
        <span className="font-[family-name:var(--font-mincho)] text-sm text-accent-rasengan animate-pulse-glow">
          螺旋丸
        </span>
      </div>
    </div>
  );
}
