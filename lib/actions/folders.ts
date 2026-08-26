"use server";

import { db } from "../db/index";
import { folders } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createFolder(data: {
  name: string;
  description?: string;
  icon?: string;
  accentColor?: string;
  coverImageUrl?: string;
}) {
  const [folder] = await db
    .insert(folders)
    .values({
      name: data.name,
      description: data.description || null,
      icon: data.icon || "Folder",
      accentColor: data.accentColor || "#A855F7",
      coverImageUrl: data.coverImageUrl || null,
    })
    .returning();

  revalidatePath("/");
  return folder;
}

export async function updateFolder(
  id: string,
  data: {
    name?: string;
    description?: string;
    icon?: string;
    accentColor?: string;
    coverImageUrl?: string;
  }
) {
  const [folder] = await db
    .update(folders)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(folders.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath(`/folders/${id}`);
  return folder;
}

export async function deleteFolder(id: string) {
  await db.delete(folders).where(eq(folders.id, id));
  revalidatePath("/");
}
