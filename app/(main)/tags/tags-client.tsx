"use client";

import { useTransition } from "react";
import { motion } from "motion/react";
import { Tag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteTag } from "@/lib/actions/tags";
import { useRouter } from "next/navigation";

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
    if (!confirm(`Delete the tag "${tagName}"? This will untag all links.`)) return;
    startTransition(async () => {
      await deleteTag(tagId);
      router.refresh();
    });
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-accent-primary/15 flex items-center justify-center">
          <Tag size={20} className="text-accent-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] tracking-wide text-foreground">
            Tags
          </h1>
          <p className="text-sm text-foreground-muted">
            {tags.length} {tags.length === 1 ? "tag" : "tags"}
          </p>
        </div>
      </motion.div>

      {tags.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 rounded-2xl border border-dashed border-border-custom"
        >
          <Tag size={40} className="mx-auto text-foreground-muted mb-3" />
          <p className="text-foreground-secondary text-sm">
            No tags yet. Add tags to your links to organize them!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tags.map((tag, i) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl",
                "bg-surface border border-border-custom",
                "hover:border-border-hover hover:bg-surface-hover",
                "transition-all duration-200 group"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="tag-chip text-sm px-3 py-1">{tag.name}</div>
                <span className="text-xs text-foreground-muted">
                  {tag.count} {tag.count === 1 ? "link" : "links"}
                </span>
              </div>

              <button
                onClick={() => handleDelete(tag.id, tag.name)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-accent-crimson/15 text-foreground-muted hover:text-accent-crimson transition-all"
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
