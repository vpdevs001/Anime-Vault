import { getFolders, getFavorites, getRecents, getAllTags } from "@/lib/db/queries";
import { DashboardClient, type DashboardClientProps } from "./dashboard-client";

export default async function DashboardPage() {
  let folders: DashboardClientProps["folders"] = [];
  let favorites: DashboardClientProps["favorites"] = [];
  let recents: DashboardClientProps["recents"] = [];
  let allTags: string[] = [];

  try {
    const [fData, favData, recData, tagsData] = await Promise.all([
      getFolders(),
      getFavorites(12),
      getRecents(10),
      getAllTags(),
    ]);
    folders = fData.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      icon: f.icon,
      accentColor: f.accentColor,
      linkCount: f.linkCount,
    }));
    favorites = favData.map((link) => ({
      id: link.id,
      url: link.url,
      title: link.title,
      description: link.description,
      faviconUrl: link.faviconUrl,
      previewImageUrl: link.previewImageUrl,
      isFavorite: link.isFavorite,
      linkTags: link.linkTags as DashboardClientProps["favorites"][number]["linkTags"],
      folder: link.folder as DashboardClientProps["favorites"][number]["folder"],
    }));
    recents = recData.map((link) => ({
      id: link.id,
      url: link.url,
      title: link.title,
      description: link.description,
      faviconUrl: link.faviconUrl,
      previewImageUrl: link.previewImageUrl,
      isFavorite: link.isFavorite,
      linkTags: link.linkTags as DashboardClientProps["recents"][number]["linkTags"],
      folder: link.folder as DashboardClientProps["recents"][number]["folder"],
    }));
    allTags = tagsData.map((t: { name: string }) => t.name);
  } catch {
    // DB not connected yet — render empty state
  }

  return (
    <DashboardClient
      folders={folders}
      favorites={favorites}
      recents={recents}
      allTags={allTags}
    />
  );
}
