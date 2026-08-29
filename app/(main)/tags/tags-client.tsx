"use client";

import { useTransition } from "react";
import { motion } from "motion/react";
import { Tag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteTag } from "@/lib/actions/tags";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { NichirinMist } from "@/components/fx/nichirin-mist";

interface TagsClientProps {
  tags: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

export function TagsClient({ tags }: TagsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(tagId: string, tagName: string) {
    if (!confirm(`Burn the talisman "${tagName}"? This will untag all links.`)) return;
    startTransition(async () => {
      await deleteTag(tagId);
      router.refresh();
    });
  }

  return (
    <div>
      <PageHeader
        icon={<Tag size={24} style={{ color: "#ff9f2e" }} />}
        title="Ofuda Talismans"
        kanji="札"
        accent="#ff9f2e"
        subtitle={`${tags.length} ${tags.length === 1 ? "talisman" : "talismans"} in circulation`}
      >
        <NichirinMist size={52} />
      </PageHeader>

      {tags.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center py-24 rounded-2xl border border-dashed border-[rgba(178,168,255,0.2)] overflow-hidden"
        >
          <div className="absolute inset-0 ichimatsu opacity-30 pointer-events-none" />
          <Tag size={40} className="mx-auto text-accent-chakra/50 mb-4 relative animate-float" />
          <p className="text-foreground-secondary text-sm relative">
            No talismans written yet. Tag your links to bind them together!
          </p>
          <p className="font-[family-name:var(--font-mincho)] text-foreground-muted/50 text-xs mt-2 relative">
            札はまだない
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tags.map((tag, i) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, y: 12, rotate: -1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.03, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg",
                "bg-surface border-[1.5px] border-[var(--ink-line)]",
                "hover:border-accent-chakra/40 hover:bg-surface-hover",
                "hover:shadow-[3px_3px_0_rgba(255,159,46,0.15)]",
                "transition-all duration-200 group"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="tag-chip text-sm px-3 py-1">{tag.name}</span>
                <span className="text-xs text-foreground-muted meta-mono">
                  ×{tag.count}
                </span>
              </div>

              <button
                onClick={() => handleDelete(tag.id, tag.name)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-accent-crimson/15 text-foreground-muted hover:text-accent-crimson transition-all"
                title="Burn talisman"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
