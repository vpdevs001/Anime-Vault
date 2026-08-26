import { NextRequest } from "next/server";
import { searchLinks, searchFolders } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || !q.trim()) {
    return Response.json({ links: [], folders: [] });
  }

  const [linkResults, folderResults] = await Promise.all([
    searchLinks(q, 10),
    searchFolders(q),
  ]);

  return Response.json({
    links: linkResults,
    folders: folderResults,
  });
}
