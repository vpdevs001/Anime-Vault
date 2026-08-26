import { NextRequest } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Fetch the page with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let html: string;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; AnimeVault/1.0; +https://anime-vault.app)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });
      html = await res.text();
    } catch {
      // If fetch fails, return minimal data
      return Response.json({
        title: null,
        description: null,
        image: null,
        favicon: null,
      });
    } finally {
      clearTimeout(timeout);
    }

    const $ = cheerio.load(html);

    // Extract Open Graph / meta data
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      null;

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      null;

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      null;

    // Resolve relative image URLs
    let resolvedImage = image;
    if (image && !image.startsWith("http")) {
      try {
        resolvedImage = new URL(image, url).href;
      } catch {
        resolvedImage = null;
      }
    }

    // Favicon
    const faviconLink =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href");

    let favicon: string | null = null;
    if (faviconLink) {
      try {
        favicon = new URL(faviconLink, url).href;
      } catch {
        favicon = null;
      }
    }

    // Fallback: use Google's favicon service
    if (!favicon) {
      try {
        const origin = new URL(url).origin;
        favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(origin)}&sz=64`;
      } catch {
        favicon = null;
      }
    }

    return Response.json({
      title: title?.trim() || null,
      description: description?.trim() || null,
      image: resolvedImage,
      favicon,
    });
  } catch {
    return Response.json(
      { error: "Failed to unfurl URL" },
      { status: 500 }
    );
  }
}
