"use client";

import { useEffect, useState } from "react";

/* The six seals — vault, shinobi, curse, destroy, death, titan */
const KANJI_CYCLE = ["蔵", "忍", "呪", "滅", "死", "巨"] as const;

/**
 * KANJI VEIL — a giant Mincho-brushed character breathing behind the app,
 * slowly cycling through the seals of the five series. Outlined, never solid:
 * a ghost in the page, not a wall.
 *
 * The crossfade + breathing are pure CSS (`animate-kanji`), so this renders
 * no inline transform styles — keeping SSR and client output byte-identical.
 */
export function KanjiVeil() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      // Fade the current seal out, swap, fade the next one in
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % KANJI_CYCLE.length);
        setVisible(true);
      }, 1200);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 flex items-center justify-end pr-[2vw] pointer-events-none overflow-hidden"
      aria-hidden
    >
      <span
        className="kanji-veil animate-kanji text-[42vw] lg:text-[34vw] leading-none select-none transition-opacity duration-[1200ms] ease-in-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {KANJI_CYCLE[index]}
      </span>
    </div>
  );
}
