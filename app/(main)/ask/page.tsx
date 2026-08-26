import { getAllLinksForAI } from "@/lib/db/queries";
import { ChatPanel } from "@/components/ask-vault/chat-panel";

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
      <div className="mb-4">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] tracking-wide text-foreground">
          Ask Vault
        </h1>
        <p className="text-sm text-foreground-muted">
          Natural-language search powered by OpenAI. Ask about any saved resource.
        </p>
      </div>

      <div className="flex-1 glass rounded-2xl border border-glass-border overflow-hidden flex flex-col shadow-2xl">
        <ChatPanel allLinks={simplifiedLinks} />
      </div>
    </div>
  );
}
