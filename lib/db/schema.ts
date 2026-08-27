import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Folders ──
export const folders = pgTable("folders", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull().default("Folder"),
  accentColor: text("accent_color").notNull().default("#E63946"),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const foldersRelations = relations(folders, ({ many }) => ({
  links: many(links),
}));

// ── Links ──
export const links = pgTable("links", {
  id: uuid("id").defaultRandom().primaryKey(),
  folderId: uuid("folder_id")
    .notNull()
    .references(() => folders.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  faviconUrl: text("favicon_url"),
  previewImageUrl: text("preview_image_url"),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastOpenedAt: timestamp("last_opened_at", { withTimezone: true }),
});

export const linksRelations = relations(links, ({ one, many }) => ({
  folder: one(folders, {
    fields: [links.folderId],
    references: [folders.id],
  }),
  linkTags: many(linkTags),
}));

// ── Tags ──
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  linkTags: many(linkTags),
}));

// ── Link-Tags Join Table ──
export const linkTags = pgTable(
  "link_tags",
  {
    linkId: uuid("link_id")
      .notNull()
      .references(() => links.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.linkId, table.tagId] })]
);

export const linkTagsRelations = relations(linkTags, ({ one }) => ({
  link: one(links, {
    fields: [linkTags.linkId],
    references: [links.id],
  }),
  tag: one(tags, {
    fields: [linkTags.tagId],
    references: [tags.id],
  }),
}));

// ── Types ──
export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type LinkTag = typeof linkTags.$inferSelect;

// Extended types with relations
export type LinkWithTags = Link & {
  linkTags: (LinkTag & { tag: Tag })[];
};

export type FolderWithCount = Folder & {
  linkCount: number;
};
