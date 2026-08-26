"use client";

import { usePathname, useRouter } from "next/navigation";
import { Frame } from "@/components/ui/frame";
import { Button } from "@/components/ui/button";
import { serialiseFilters, type PlpFilters } from "@/lib/filters";

/**
 * Filtered-to-nothing state.
 *
 * Names the combination that failed, then hands back a working way out. A
 * filtered grid that renders as blank space is the dead end AGENTS.md rules out.
 */
export function EmptyResults({
  filters,
  collectionLabel,
}: {
  readonly filters: PlpFilters;
  readonly collectionLabel: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const parts: string[] = [];
  if (filters.sizes.length > 0) parts.push(`size ${filters.sizes.join(", ")}`);
  if (filters.fits.length > 0) parts.push(`fit ${filters.fits.join(", ").toLowerCase()}`);
  if (filters.bands.length > 0) {
    parts.push(filters.bands.length === 1 ? "that price band" : "those price bands");
  }

  const clearAll = () => {
    const next: PlpFilters = { ...filters, sizes: [], fits: [], bands: [] };
    const query = serialiseFilters(next);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div
      data-testid="empty-results"
      className="grid grid-cols-1 items-center gap-10 py-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
    >
      <Frame ratio="4:5" label="No match" pitch={32} />

      <div className="max-w-[46ch]">
        <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-[var(--color-ink)]">
          Nothing in the {collectionLabel.toLowerCase()} collection matches
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">
          {parts.length > 0
            ? `No piece is currently on the shelf in ${parts.join(" and ")}.`
            : "No piece matches the current combination."}{" "}
          Loosening one of the filters usually brings the run back.
        </p>

        <Button variant="secondary" className="mt-6" onClick={clearAll} data-testid="empty-clear">
          Clear filters
        </Button>
      </div>
    </div>
  );
}
