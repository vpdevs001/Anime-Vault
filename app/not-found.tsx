import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * 404 — Death Note territory. Gothic engraved type, a candle-flicker
 * over the numbers, and Ryuk's 死 breathing behind the panel.
 */
export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-4 overflow-hidden">
      {/* Ryuk's kanji breathing behind everything */}
      <span
        className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-mincho)] font-bold text-[24rem] leading-none pointer-events-none select-none animate-kanji"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(215,38,61,0.12)",
        }}
        aria-hidden
      >
        死
      </span>

      {/* Gothic numerals — candle-flicker */}
      <h1
        className="relative font-[family-name:var(--font-cinzel)] font-black text-8xl sm:text-9xl tracking-[0.1em] text-foreground animate-gothic mb-2"
      >
        404
      </h1>

      <p className="relative font-[family-name:var(--font-mincho)] text-accent-crimson text-lg tracking-[0.4em] mb-3">
        迷 子
      </p>

      <h2 className="relative text-xl font-[family-name:var(--font-rajdhani)] tracking-[0.12em] text-foreground-secondary mb-3">
        LOST IN THE DOMAIN
      </h2>

      <p className="relative text-foreground-muted text-sm max-w-md mb-10 meta-mono">
        The scroll you seek is not written in these records. It may have been
        sealed away — or its name was never spoken.
      </p>

      <Link
        href="/"
        className="btn-primary relative inline-flex items-center gap-2 px-7 py-3"
      >
        <ArrowLeft size={16} />
        Return to the Vault
      </Link>
    </div>
  );
}
