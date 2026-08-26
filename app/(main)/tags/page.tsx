import { getTagsWithCounts } from "@/lib/db/queries";
import { TagsClient } from "./tags-client";

export default async function TagsPage() {
  let tagsData: Awaited<ReturnType<typeof getTagsWithCounts>> = [];

  try {
    tagsData = await getTagsWithCounts();
  } catch {
    // DB not connected
  }

  return <TagsClient tags={tagsData} />;
}
