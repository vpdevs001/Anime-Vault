import type { Metadata } from "next";
import {
  Bebas_Neue,
  Space_Mono,
  Sora,
  Shippori_Mincho,
  Cinzel,
} from "next/font/google";
import "./globals.css";

// Body — clean geometric sans that stays out of the way of the display faces.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

// Display — bold condensed manga-cover logotype. Kept under the legacy
// --font-rajdhani variable name so existing components pick it up for free.
const bebas = Bebas_Neue({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400"],
});

// Kanji — Shippori Mincho, a brushy Japanese serif for giant background
// watermarks, seal stamps and vertical captions.
const mincho = Shippori_Mincho({
  variable: "--font-mincho",
  subsets: ["latin"],
  weight: ["600", "800"],
});

// Gothic — Cinzel engraved caps, the Death Note voice: used for ominous
// labels, the 404 page and "vault records" style headings.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

// Mono — technical captions: hostnames, timestamps, tag chips.
const spaceMono = Space_Mono({
  variable: "--font-mono-vault",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Anime Vault — 術の蔵",
  description: "Your personal resource & link vault — guarded by jutsu, sealed with ink.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${bebas.variable} ${mincho.variable} ${cinzel.variable} ${spaceMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
