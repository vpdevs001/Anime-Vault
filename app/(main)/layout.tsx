import { Sidebar } from "@/components/ui/sidebar";
import { EmberField } from "@/components/fx/ember-field";
import { KanjiVeil } from "@/components/fx/kanji-veil";
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
    <div className="flex min-h-screen relative">
      {/* ── Ambient Cursed Night — nebulas + halftone veil ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div
          className="absolute -top-40 -left-40 w-[42rem] h-[42rem] rounded-full animate-curse"
          style={{
            background:
              "radial-gradient(circle, rgba(91,43,224,0.17) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-52 w-[38rem] h-[38rem] rounded-full animate-curse"
          style={{
            background:
              "radial-gradient(circle, rgba(255,74,61,0.10) 0%, transparent 65%)",
            animationDelay: "-3s",
          }}
        />
        <div
          className="absolute -bottom-52 left-1/4 w-[36rem] h-[36rem] rounded-full animate-curse"
          style={{
            background:
              "radial-gradient(circle, rgba(63,193,255,0.09) 0%, transparent 65%)",
            animationDelay: "-5.5s",
          }}
        />
        {/* Halftone print veil over the void */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(242,239,228,0.032) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />
      </div>

      {/* Giant breathing kanji, cycling through the six seals */}
      <KanjiVeil />

      {/* Hinokami embers + cursed sparks rising through the night */}
      <EmberField count={20} />

      <Sidebar folders={folders} />
      <main className="relative z-10 flex-1 lg:ml-64 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
