"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { AspectRatio } from "@/lib/catalog";

/**
 * Structured media frame.
 *
 * Supports high-resolution photography with exact aspect-ratio reservation to
 * prevent layout shift (CLS: 0), with architectural wireframe fallback when
 * photography is not supplied or fails to load.
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
  /** High-resolution image URL. */
  readonly image?: string;
  /** Accessible alt text for real images. */
  readonly alt?: string;
  /** Preload above-the-fold hero images. */
  readonly priority?: boolean;
  /** Responsive image sizes hint. */
  readonly sizes?: string;
}

export function Frame({
  ratio,
  label,
  note,
  tone = "field",
  className,
  pitch = 40,
  image,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: FrameProps) {
  const [hasError, setHasError] = useState(false);

  // Normalize image path to handle subpath / basePath configurations
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const resolvedSrc =
    image && image.startsWith("/") && !image.startsWith("//") && basePath
      ? `${basePath}${image}`
      : image;

  const showImage = Boolean(resolvedSrc) && !hasError;

  return (
    <div
      aria-hidden={showImage ? undefined : "true"}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-[2px] border border-[var(--color-hairline)]",
        tone === "field" ? "bg-[var(--color-wireframe)]" : "bg-[var(--color-surface)]",
        className,
      )}
      style={{ aspectRatio: RATIO_VALUE[ratio] }}
    >
      {showImage ? (
        <Image
          src={resolvedSrc!}
          alt={alt ?? label}
          fill
          priority={priority}
          sizes={sizes}
          onError={() => setHasError(true)}
          className="object-cover object-center transition-transform duration-700 [transition-timing-function:var(--ease-spring)]"
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
