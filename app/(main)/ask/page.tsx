import { getAllLinksForAI } from "@/lib/db/queries";
import { ChatPanel } from "@/components/ask-vault/chat-panel";
import { PageHeader } from "@/components/ui/page-header";
import { ShinigamiEye } from "@/components/fx/shinigami-eye";
import { Bot } from "lucide-react";

export default async function AskPage() {
  let allLinks: Awaited<ReturnType<typeof getAllLinksForAI>> = [];

  try {
    allLinks = await getAllLinksForAI();
  } catch {
    // DB not connected
  }

  const simplifiedLinks = allLinks.map((link: {
    id: string;
    url: string;
    title: string | null;
    faviconUrl: string | null;
    isFavorite: boolean;
  }) => ({
    id: link.id,
    url: link.url,
    title: link.title,
    faviconUrl: link.faviconUrl,
    isFavorite: link.isFavorite,
  }));

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        icon={<Bot size={24} style={{ color: "#9d5cff" }} />}
        title="Ask the Vault"
        kanji="問"
        accent="#9d5cff"
        subtitle="Speak to the vault spirit — natural-language search over your sealed scrolls"
      >
        <ShinigamiEye size={52} />
      </PageHeader>

      <div className="flex-1 glass rounded-2xl border border-glass-border overflow-hidden flex flex-col shadow-2xl relative">
        {/* Cursed energy edge */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] animate-energy z-10"
          style={{
            background:
              "linear-gradient(90deg, #9d5cff, #c77bff, #ff4a3d, #9d5cff)",
            backgroundSize: "200% 100%",
          }}
          aria-hidden
        />
        <ChatPanel allLinks={simplifiedLinks} />
      </div>
    </div>
  );
}
