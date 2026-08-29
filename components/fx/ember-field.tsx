import { cn } from "@/lib/utils";

interface EmberFieldProps {
  count?: number;
  className?: string;
}

/* Deterministic hash — stable output for a given seed */
function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* Round to 4 decimals and emit as a STRING — React's SSR float serializer
   rounds differently than the client pass (62.9702% vs 62.970217…%), which
   is what triggered the hydration mismatch. Fixed-precision strings are
   byte-identical on both sides. */
const r4 = (n: number) => n.toFixed(4);

/* Flame palette ONLY — orange / red / yellow (hinokami fire), no cool hues.
   Richer, more varied warm tones for a convincing flame field. */
const EMBER_COLORS = [
  "#ff3a1a",  /* deep ember red */
  "#ff5722",  /* hot orange */
  "#ff6b1f",  /* burning orange */
  "#ff8a00",  /* bright orange */
  "#ff9f2e",  /* warm amber */
  "#ffb74d",  /* golden flame */
  "#ffc23d",  /* flame gold */
  "#ffd54f",  /* pale yellow flame */
  "#f2b33d",  /* cursed gold */
  "#ff4a3d",  /* hinokami ember */
];

/**
 * HINOKAMI EMBERS — glowing motes of flame endlessly rising through the
 * night, like the aftermath of a Sun Breathing strike. Pure fire palette
 * (orange/red/yellow), bigger and softer-glowing, with a flame-like teardrop
 * shape via border-radius. Each ember flickers in brightness as it rises.
 *
 * Server-rendered once (no client JS, no hydration surface); the animation
 * is pure CSS driven by custom properties consumed by `ember-rise`.
 */
export function EmberField({ count = 24, className }: EmberFieldProps) {
  const embers = Array.from({ length: count }, (_, i) => {
    const color = EMBER_COLORS[Math.floor(hash(i + 83) * EMBER_COLORS.length)];
    /* Slightly bigger embers: 4–9px base size for a more visible flame-mote */
    const baseSize = 4 + hash(i + 11) * 5;
    return {
      left: `${r4(hash(i + 1) * 100)}%`,
      width: `${r4(baseSize)}px`,
      height: `${r4(baseSize * (1.2 + hash(i + 71) * 0.6))}px`,
      duration: `${r4(8 + hash(i + 23) * 10)}s`,
      delay: `${r4(-hash(i + 37) * 20)}s`,
      sway: `${r4((hash(i + 51) - 0.5) * 100)}px`,
      opacity: r4(0.4 + hash(i + 67) * 0.45),
      glow: `${r4(8 + hash(i + 97) * 14)}px`,
      color,
    };
  });

  return (
    <div
      className={cn(
        "fixed inset-0 z-20 pointer-events-none overflow-hidden",
        className
      )}
      aria-hidden
    >
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute"
          style={
            {
              left: e.left,
              bottom: "-3vh",
              width: e.width,
              height: e.height,
              /* Flame-like teardrop: rounder on top, tapers at bottom */
              borderRadius: "50% 50% 20% 20%",
              backgroundColor: e.color,
              boxShadow: `0 0 ${e.glow} ${e.color}, 0 0 ${r4(parseFloat(e.glow) * 2)}px ${e.color}40`,
              "--ember-sway": e.sway,
              "--ember-opacity": e.opacity,
              animation: `ember-rise ${e.duration} linear ${e.delay} infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
