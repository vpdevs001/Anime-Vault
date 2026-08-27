-- De-duplicate any existing (link_id, tag_id) pairs before enforcing uniqueness.
-- Without this, the PRIMARY KEY constraint below would fail if duplicate rows
-- were ever inserted (previously possible since no constraint existed to
-- upsert against).
DELETE FROM "link_tags" a USING "link_tags" b
  WHERE a.ctid < b.ctid
  AND a.link_id = b.link_id
  AND a.tag_id = b.tag_id;
--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "accent_color" SET DEFAULT '#E63946';--> statement-breakpoint
ALTER TABLE "link_tags" ADD CONSTRAINT "link_tags_link_id_tag_id_pk" PRIMARY KEY("link_id","tag_id");