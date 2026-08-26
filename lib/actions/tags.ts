"use server";

import { db } from "../db/index";
import { tags } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTag(name: string) {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return null;

  const [tag] = await db
    .insert(tags)
    .values({ name: trimmed })
    .onConflictDoNothing({ target: tags.name })
    .returning();

  // If conflict (already exists), fetch it
  if (!tag) {
    return db.query.tags.findFirst({
      where: eq(tags.name, trimmed),
    });
  }

  revalidatePath("/tags");
  return tag;
}

export async function deleteTag(id: string) {
  // linkTags cascade on tag delete
  await db.delete(tags).where(eq(tags.id, id));
  revalidatePath("/tags");
  revalidatePath("/");
}
