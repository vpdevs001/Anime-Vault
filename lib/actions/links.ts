"use server";

import { db } from "../db/index";
import { links, linkTags, tags } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getLinksByFolder, getFavorites } from "../db/queries";

export async function createLink(data: {
  folderId: string;
  url: string;
  title?: string;
  description?: string;
  faviconUrl?: string;
  previewImageUrl?: string;
  isFavorite?: boolean;
  tagNames?: string[];
}) {
  const { tagNames, ...linkData } = data;

  const [link] = await db
    .insert(links)
    .values({
      folderId: linkData.folderId,
      url: linkData.url,
      title: linkData.title || null,
      description: linkData.description || null,
      faviconUrl: linkData.faviconUrl || null,
      previewImageUrl: linkData.previewImageUrl || null,
      isFavorite: linkData.isFavorite || false,
    })
    .returning();

  // Handle tags
  if (tagNames && tagNames.length > 0) {
    for (const tagName of tagNames) {
      const trimmed = tagName.trim().toLowerCase();
      if (!trimmed) continue;

      // Upsert tag
      const [tag] = await db
        .insert(tags)
        .values({ name: trimmed })
        .onConflictDoNothing({ target: tags.name })
        .returning();

      const existingTag =
        tag ??
        (await db.query.tags.findFirst({
          where: eq(tags.name, trimmed),
        }));

      if (existingTag) {
        await db
          .insert(linkTags)
          .values({ linkId: link.id, tagId: existingTag.id })
          .onConflictDoNothing();
      }
    }
  }

  revalidatePath("/");
  revalidatePath(`/folders/${data.folderId}`);
  return link;
}

export async function updateLink(
  id: string,
  data: {
    url?: string;
    title?: string;
    description?: string;
    faviconUrl?: string;
    previewImageUrl?: string;
    isFavorite?: boolean;
    folderId?: string;
    tagNames?: string[];
  }
) {
  const { tagNames, ...linkData } = data;

  const [link] = await db
    .update(links)
    .set(linkData)
    .where(eq(links.id, id))
    .returning();

  // Replace tags if provided
  if (tagNames !== undefined) {
    // Remove all existing tags for this link
    await db.delete(linkTags).where(eq(linkTags.linkId, id));

    // Add new tags
    for (const tagName of tagNames) {
      const trimmed = tagName.trim().toLowerCase();
      if (!trimmed) continue;

      const [tag] = await db
        .insert(tags)
        .values({ name: trimmed })
        .onConflictDoNothing({ target: tags.name })
        .returning();

      const existingTag =
        tag ??
        (await db.query.tags.findFirst({
          where: eq(tags.name, trimmed),
        }));

      if (existingTag) {
        await db
          .insert(linkTags)
          .values({ linkId: id, tagId: existingTag.id })
          .onConflictDoNothing();
      }
    }
  }

  revalidatePath("/");
  if (link?.folderId) {
    revalidatePath(`/folders/${link.folderId}`);
  }
  return link;
}

export async function deleteLink(id: string) {
  const [link] = await db.delete(links).where(eq(links.id, id)).returning();
  revalidatePath("/");
  if (link?.folderId) {
    revalidatePath(`/folders/${link.folderId}`);
  }
}

export async function toggleFavorite(id: string) {
  const existing = await db.query.links.findFirst({
    where: eq(links.id, id),
  });
  if (!existing) return;

  const [link] = await db
    .update(links)
    .set({ isFavorite: !existing.isFavorite })
    .where(eq(links.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath("/favorites");
  if (link?.folderId) {
    revalidatePath(`/folders/${link.folderId}`);
  }
  return link;
}

export async function moveLink(id: string, newFolderId: string) {
  const existing = await db.query.links.findFirst({
    where: eq(links.id, id),
  });

  const [link] = await db
    .update(links)
    .set({ folderId: newFolderId })
    .where(eq(links.id, id))
    .returning();

  revalidatePath("/");
  if (existing?.folderId) {
    revalidatePath(`/folders/${existing.folderId}`);
  }
  revalidatePath(`/folders/${newFolderId}`);
  return link;
}

export async function trackLinkOpen(id: string) {
  await db
    .update(links)
    .set({ lastOpenedAt: new Date() })
    .where(eq(links.id, id));

  revalidatePath("/");
}

// Fetches an additional page of links for a folder — used by the "Load More"
// control on the folder detail view so folders aren't silently capped at
// DEFAULT_PAGE_SIZE links with no way to see the rest.
export async function getFolderLinksPage(
  folderId: string,
  page: number,
  sort: "recent" | "alphabetical" | "favorites" = "recent"
) {
  return getLinksByFolder(folderId, { page, sort });
}

// Same idea for the Favorites view — favorites were previously hard-capped
// at 100 with no way to see the rest.
export async function getFavoritesPage(page: number) {
  return getFavorites({ page });
}
