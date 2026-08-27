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

const EMBER_COLORS = ["#ff4a3d", "#ff9f2e", "#f2b33d", "#9d5cff", "#3fc1ff", "#ff6b81"];

/**
 * HINOKAMI EMBERS — glowing motes of flame and cursed energy
 * endlessly rising through the night, like the aftermath of a battle.
 *
 * Server-rendered once (no client JS, no hydration surface); the animation
 * is pure CSS driven by custom properties consumed by `ember-rise`.
 */
export function EmberField({ count = 20, className }: EmberFieldProps) {
  const embers = Array.from({ length: count }, (_, i) => {
    const color = EMBER_COLORS[Math.floor(hash(i + 83) * EMBER_COLORS.length)];
    return {
      left: `${r4(hash(i + 1) * 100)}%`,
      size: `${r4(2 + hash(i + 11) * 3.5)}px`,
      duration: `${r4(9 + hash(i + 23) * 11)}s`,
      delay: `${r4(-hash(i + 37) * 20)}s`,
      sway: `${r4((hash(i + 51) - 0.5) * 90)}px`,
      opacity: r4(0.35 + hash(i + 67) * 0.45),
      glow: `${r4(4 + hash(i + 97) * 8)}px`,
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
          className="absolute rounded-full"
          style={
            {
              left: e.left,
              bottom: "-3vh",
              width: e.size,
              height: e.size,
              backgroundColor: e.color,
              boxShadow: `0 0 ${e.glow} ${e.color}`,
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
