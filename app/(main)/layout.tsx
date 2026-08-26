import { Sidebar } from "@/components/ui/sidebar";
import { getFolders } from "@/lib/db/queries";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let folders: Array<{
    id: string;
    name: string;
    icon: string;
    accentColor: string;
    linkCount: number;
  }> = [];

  try {
    folders = await getFolders();
  } catch {
    // DB might not be connected yet — render without folders
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar folders={folders} />
      <main className="flex-1 lg:ml-64 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
