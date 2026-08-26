import { NextRequest } from "next/server";
import OpenAI from "openai";
import { getAllLinksForAI } from "@/lib/db/queries";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      return Response.json({
        message:
          "Your vault is empty! Start by adding some links, and I'll help you find them later.",
        matchedLinkIds: [],
      });
    }

    // Build the catalog for the prompt
    const catalog = allLinks
      .map((link: (typeof allLinks)[number], i: number) => {
        const tagList = (link as { linkTags?: { tag: { name: string } }[] }).linkTags
          ?.map((lt) => lt.tag.name)
          .join(", ");
        const folderName =
          (link as { folder?: { name: string } }).folder?.name ??
          "Unknown";
        return `[${i + 1}] ID:${link.id} | Folder:"${folderName}" | Title:"${link.title || "Untitled"}" | URL:${link.url} | Tags:[${tagList || "none"}] | Description:"${link.description || ""}"`;
      })
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the Anime Vault assistant. The user has a personal link vault organized in folders. Below is their complete catalog of saved links:

${catalog}

Your job:
1. Understand the user's natural-language query about their saved links.
2. Find the most relevant link(s) from the catalog.
3. Respond conversationally, referencing the matched links by their ID.
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
    });

    const responseText = completion.choices[0]?.message?.content || "";

    // Extract matched link IDs from the response
    const matchRegex = /<!-- MATCHES: \[([^\]]*)\] -->/;
    const match = responseText.match(matchRegex);
    let matchedLinkIds: string[] = [];

    if (match?.[1]) {
      try {
        matchedLinkIds = JSON.parse(`[${match[1]}]`);
      } catch {
        matchedLinkIds = [];
      }
    }

    // Clean the response text (remove the matches marker)
    const cleanMessage = responseText.replace(matchRegex, "").trim();

    return Response.json({
      message: cleanMessage,
      matchedLinkIds,
    });
  } catch (error) {
    console.error("Ask Vault error:", error);
    return Response.json(
      { error: "Failed to process your question" },
      { status: 500 }
    );
  }
}
