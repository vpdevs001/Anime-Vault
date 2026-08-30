import { NextRequest } from "next/server";
import OpenAI from "openai";
import { getAllLinksForAI } from "@/lib/db/queries";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "nodejs";

const MATCH_TAG_HEADER = "<!-- MATCHES:";

function getMatchTagPrefixIndex(str: string): number {
  for (let len = MATCH_TAG_HEADER.length; len >= 1; len--) {
    const prefix = MATCH_TAG_HEADER.slice(0, len);
    if (str.endsWith(prefix)) {
      return str.length - len;
    }
  }
  return -1;
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return Response.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Fetch all links from DB
    const allLinks = await getAllLinksForAI();

    if (allLinks.length === 0) {
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const emptyVaultMsg =
            "Your vault is empty! Start by adding some links, and I'll help you find them later.";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "delta", content: emptyVaultMsg })}\n\n`
            )
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "matches", matchedLinkIds: [] })}\n\n`
            )
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // Build the catalog for the prompt
    const catalog = allLinks
      .map((link: (typeof allLinks)[number], i: number) => {
        const tagList = (link as { linkTags?: { tag: { name: string } }[] })
          .linkTags
          ?.map((lt) => lt.tag.name)
          .join(", ");
        const folderName =
          (link as { folder?: { name: string } }).folder?.name ?? "Unknown";
        return `[${i + 1}] ID:${link.id} | Folder:"${folderName}" | Title:"${link.title || "Untitled"}" | URL:${link.url} | Tags:[${tagList || "none"}] | Description:"${link.description || ""}"`;
      })
      .join("\n");

    const responseStream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the Anime Vault assistant. The user has a personal link vault organized in folders. Below is their complete catalog of saved links:

${catalog}

Your job:
1. Understand the user's natural-language query about their saved links.
2. Find the most relevant link(s) from the catalog.
3. Respond conversationally using clear Markdown formatting (e.g., bullet lists, bold text, inline code, links) where helpful, referencing the matched links.
4. If no links match well, say so helpfully.

IMPORTANT: In your response, include a JSON block at the very end with the matched link IDs like this:
<!-- MATCHES: ["id1", "id2"] -->

Keep responses concise and helpful. You're an anime-themed assistant — be friendly but not overly chatty.`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let accumulated = "";
        let inMatchBlock = false;

        try {
          for await (const chunk of responseStream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (!delta) continue;

            accumulated += delta;

            const matchIndex = accumulated.indexOf("<!-- MATCHES:");
            if (matchIndex !== -1) {
              inMatchBlock = true;
            }

            if (!inMatchBlock) {
              const prefixMatch = getMatchTagPrefixIndex(accumulated);
              if (prefixMatch > 0) {
                const sendText = accumulated.slice(0, prefixMatch);
                accumulated = accumulated.slice(prefixMatch);
                if (sendText) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        type: "delta",
                        content: sendText,
                      })}\n\n`
                    )
                  );
                }
              } else if (prefixMatch === 0) {
                // Entire buffer is a potential prefix, wait for subsequent chunks
              } else {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "delta",
                      content: accumulated,
                    })}\n\n`
                  )
                );
                accumulated = "";
              }
            }
          }

          // Parse matches tag
          const matchRegex = /<!-- MATCHES: \[([^\]]*)\] -->/;
          const match = accumulated.match(matchRegex);
          let matchedLinkIds: string[] = [];

          if (match?.[1]) {
            try {
              matchedLinkIds = JSON.parse(`[${match[1]}]`);
            } catch {
              matchedLinkIds = [];
            }
          }

          const cleanRemaining = accumulated
            .replace(matchRegex, "")
            .replace(/<!--[\s\S]*?-->/g, "")
            .trimEnd();

          if (cleanRemaining) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "delta",
                  content: cleanRemaining,
                })}\n\n`
              )
            );
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "matches",
                matchedLinkIds,
              })}\n\n`
            )
          );

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Stream processing error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: errorMessage,
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Ask Vault error:", error);
    return Response.json(
      { error: "Failed to process your question" },
      { status: 500 }
    );
  }
}
