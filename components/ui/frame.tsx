import { cn } from "@/lib/cn";
import type { AspectRatio } from "@/lib/catalog";

/**
 * Structured media placeholder.
 *
 * The brief rules out external imagery, so every visual slot in the prototype is
 * a declared frame: an explicit aspect ratio, a hairline boundary, a drafting
 * grid and a minimal label. Because the ratio is set in CSS the box reserves its
 * own height before paint, which is what keeps cumulative layout shift at zero
 * when real photography is dropped in later.
 */

const RATIO_VALUE: Record<AspectRatio, string> = {
  "3:4": "3 / 4",
  "4:5": "4 / 5",
  "16:9": "16 / 9",
  "1:1": "1 / 1",
  "9:16": "9 / 16",
};

export interface FrameProps {
  readonly ratio: AspectRatio;
  readonly label: string;
  /** Rendered under the label. Use for shot notes such as "Fabric macro". */
  readonly note?: string;
  /** `field` is the recessed default, `raised` sits on an elevated surface. */
  readonly tone?: "field" | "raised";
  readonly className?: string;
  /** Grid pitch in pixels. Larger frames carry a coarser rule. */
  readonly pitch?: number;
}

export function Frame({
  ratio,
  label,
  note,
  tone = "field",
  className,
  pitch = 40,
}: FrameProps) {
  return (
    <div
      // Decorative by construction: the surrounding card already names the
      // product, so a screen reader gains nothing from the placeholder text.
      aria-hidden="true"
      className={cn(
        "relative isolate w-full overflow-hidden rounded-[2px] border border-[var(--color-hairline)]",
        tone === "field" ? "bg-[var(--color-wireframe)]" : "bg-[var(--color-surface)]",
        className,
      )}
      style={{ aspectRatio: RATIO_VALUE[ratio] }}
    >
      {/* Drafting rule. Two repeating gradients, no extra DOM node. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(to right, var(--color-wireframe-rule) 0 1px, transparent 1px ${pitch}px), repeating-linear-gradient(to bottom, var(--color-wireframe-rule) 0 1px, transparent 1px ${pitch}px)`,
        }}
      />

      {/* Registration marks at the corners, the way a cutting plan is marked. */}
      <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[var(--color-hairline-strong)]" />
      <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[var(--color-hairline-strong)]" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[var(--color-hairline-strong)]" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[var(--color-hairline-strong)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center">
        <span className="numeral text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {label}
        </span>
        {note ? (
          <span className="numeral text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)] opacity-70">
            {note}
          </span>
        ) : null}
        <span className="numeral mt-1 text-[10px] tracking-[0.14em] text-[var(--color-muted)] opacity-60">
          {ratio}
        </span>
      </div>
    </div>
  );
}
