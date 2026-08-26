import { db } from "./index";
import { folders, links, tags, linkTags } from "./schema";
import { eq, desc, sql, ilike, or, and } from "drizzle-orm";
import { DEFAULT_PAGE_SIZE } from "../constants";

// ── Folders ──

export async function getFolders() {
  const result = await db
    .select({
      id: folders.id,
      name: folders.name,
      description: folders.description,
      icon: folders.icon,
      accentColor: folders.accentColor,
      coverImageUrl: folders.coverImageUrl,
      createdAt: folders.createdAt,
      updatedAt: folders.updatedAt,
      linkCount: sql<number>`cast(count(${links.id}) as int)`,
    })
    .from(folders)
    .leftJoin(links, eq(folders.id, links.folderId))
    .groupBy(folders.id)
    .orderBy(desc(folders.updatedAt));

  return result;
}

export async function getFolderById(id: string) {
  const result = await db.query.folders.findFirst({
    where: eq(folders.id, id),
  });
  return result ?? null;
}

// ── Links ──

export async function getLinksByFolder(
  folderId: string,
  options: {
    page?: number;
    pageSize?: number;
    sort?: "recent" | "alphabetical" | "favorites";
    tagFilter?: string;
  } = {}
) {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    sort = "recent",
    tagFilter,
  } = options;

  const offset = (page - 1) * pageSize;

  // Build conditions
  const conditions = [eq(links.folderId, folderId)];

  // If filtering by tag, join through linkTags
  if (tagFilter) {
    const taggedLinkIds = db
      .select({ linkId: linkTags.linkId })
      .from(linkTags)
      .innerJoin(tags, eq(linkTags.tagId, tags.id))
      .where(eq(tags.name, tagFilter));

    conditions.push(sql`${links.id} in (${taggedLinkIds})`);
  }

  // Order clause
  const orderBy =
    sort === "alphabetical"
      ? sql`${links.title} asc nulls last`
      : sort === "favorites"
        ? sql`${links.isFavorite} desc, ${links.createdAt} desc`
        : sql`${links.createdAt} desc`;

  const result = await db.query.links.findMany({
    where: and(...conditions),
    with: {
      linkTags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: () => [orderBy],
    limit: pageSize,
    offset,
  });

  // Get total count for pagination
  const [{ total }] = await db
    .select({ total: sql<number>`cast(count(*) as int)` })
    .from(links)
    .where(and(...conditions));

  return {
    links: result,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getFavorites(limit?: number) {
  const result = await db.query.links.findMany({
    where: eq(links.isFavorite, true),
    with: {
      linkTags: {
        with: {
          tag: true,
        },
      },
      folder: true,
    },
    orderBy: [desc(links.createdAt)],
    limit: limit ?? 100,
  });
  return result;
}

export async function getRecents(limit: number = 10) {
  const result = await db.query.links.findMany({
    with: {
      linkTags: {
        with: {
          tag: true,
        },
      },
      folder: true,
    },
    orderBy: [desc(links.createdAt)],
    limit,
  });
  return result;
}

export async function getLinkById(id: string) {
  const result = await db.query.links.findFirst({
    where: eq(links.id, id),
    with: {
      linkTags: {
        with: {
          tag: true,
        },
      },
      folder: true,
    },
  });
  return result ?? null;
}

export async function getAllLinksForAI() {
  const result = await db.query.links.findMany({
    with: {
      linkTags: {
        with: {
          tag: true,
        },
      },
      folder: true,
    },
    orderBy: [desc(links.createdAt)],
  });
  return result;
}

// ── Tags ──

export async function getTagsWithCounts() {
  const result = await db
    .select({
      id: tags.id,
      name: tags.name,
      count: sql<number>`cast(count(${linkTags.linkId}) as int)`,
    })
    .from(tags)
    .leftJoin(linkTags, eq(tags.id, linkTags.tagId))
    .groupBy(tags.id)
    .orderBy(desc(sql`count(${linkTags.linkId})`));

  return result;
}

export async function getAllTags() {
  return db.query.tags.findMany({
    orderBy: [tags.name],
  });
}

// ── Search ──

export async function searchLinks(query: string, limit: number = 20) {
  const pattern = `%${query}%`;

  const result = await db.query.links.findMany({
    where: or(
      ilike(links.title, pattern),
      ilike(links.description, pattern),
      ilike(links.url, pattern)
    ),
    with: {
      linkTags: {
        with: {
          tag: true,
        },
      },
      folder: true,
    },
    orderBy: [desc(links.createdAt)],
    limit,
  });

  return result;
}

export async function searchFolders(query: string) {
  const pattern = `%${query}%`;

  return db
    .select({
      id: folders.id,
      name: folders.name,
      description: folders.description,
      icon: folders.icon,
      accentColor: folders.accentColor,
      coverImageUrl: folders.coverImageUrl,
      createdAt: folders.createdAt,
      updatedAt: folders.updatedAt,
      linkCount: sql<number>`cast(count(${links.id}) as int)`,
    })
    .from(folders)
    .leftJoin(links, eq(folders.id, links.folderId))
    .where(or(ilike(folders.name, pattern), ilike(folders.description, pattern)))
    .groupBy(folders.id)
    .orderBy(desc(folders.updatedAt));
}
