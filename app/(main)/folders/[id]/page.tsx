import { getFolderById, getLinksByFolder, getFolders, getAllTags } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import { FolderDetailClient, type FolderDetailClientProps } from "./folder-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FolderDetailPage({ params }: PageProps) {
  const { id } = await params;

  let folder;
  try {
    folder = await getFolderById(id);
  } catch {
    notFound();
  }

  if (!folder) notFound();

  let linksData: {
    links: FolderDetailClientProps["initialLinks"];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } = { links: [], total: 0, page: 1, pageSize: 40, totalPages: 0 };
  let allFolders: Array<{ id: string; name: string }> = [];
  let allTags: string[] = [];

  try {
    const [fetchedLinks, fetchedFolders, fetchedTags] = await Promise.all([
      getLinksByFolder(id, { page: 1, sort: "recent" }),
      getFolders(),
      getAllTags(),
    ]);
    linksData = {
      ...fetchedLinks,
      links: fetchedLinks.links.map((link) => ({
        id: link.id,
        url: link.url,
        title: link.title,
        description: link.description,
        faviconUrl: link.faviconUrl,
        previewImageUrl: link.previewImageUrl,
        isFavorite: link.isFavorite,
        folderId: link.folderId,
        linkTags: link.linkTags as FolderDetailClientProps["initialLinks"][number]["linkTags"],
      })),
    };
    allFolders = fetchedFolders.map((x: { id: string; name: string }) => ({
      id: x.id,
      name: x.name,
    }));
    allTags = fetchedTags.map((x: { name: string }) => x.name);
  } catch {
    // DB not connected
  }

  return (
    <FolderDetailClient
      folder={folder}
      initialLinks={linksData.links}
      totalLinks={linksData.total}
      totalPages={linksData.totalPages}
      allFolders={allFolders}
      allTags={allTags}
    />
  );
}
