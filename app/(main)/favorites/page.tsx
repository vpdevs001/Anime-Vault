import { getFavorites } from "@/lib/db/queries";
import { FavoritesClient, type FavoritesClientProps } from "./favorites-client";

export default async function FavoritesPage() {
  let favorites: FavoritesClientProps["favorites"] = [];
  let total = 0;
  let totalPages = 0;

  try {
    const data = await getFavorites({ page: 1 });
    total = data.total;
    totalPages = data.totalPages;
    favorites = data.favorites.map((link) => ({
      id: link.id,
      url: link.url,
      title: link.title,
      description: link.description,
      faviconUrl: link.faviconUrl,
      previewImageUrl: link.previewImageUrl,
      isFavorite: link.isFavorite,
      linkTags: link.linkTags as FavoritesClientProps["favorites"][number]["linkTags"],
      folder: link.folder as FavoritesClientProps["favorites"][number]["folder"],
    }));
  } catch {
    // DB not connected
  }

  return <FavoritesClient favorites={favorites} total={total} totalPages={totalPages} />;
}
