import type { Metadata } from "next";
import { Inter, Bebas_Neue, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Bold condensed impact face — reads like a manga chapter title / cover logotype.
// Kept under the existing --font-rajdhani variable name so every component that
// already references it (headers, nav, greetings) picks up the new face for free.
const rajdhani = Bebas_Neue({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400"],
});

// Technical mono face for captions — hostnames, timestamps, tag chips — evoking
// the small printed labels on a manga page rather than a generic UI font.
const spaceMono = Space_Mono({
  variable: "--font-mono-vault",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Anime Vault",
  description: "Your personal resource & link vault",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${rajdhani.variable} ${spaceMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
