"use client";

import { useId, useState } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";
import type { SpecPanel } from "@/lib/catalog";

/**
 * Disclosure group for the PDP specification panels.
 *
 * Built on the WAI-ARIA accordion pattern: a real `<button>` inside the heading,
 * `aria-expanded` on the control, `aria-controls` pointing at the region, and
 * the region labelled back by the control.
 *
 * The panel height is not animated. AGENTS.md rules out animating layout
 * properties, and a height transition is exactly that, so the panel appears at
 * its final height and only its contents fade the last few pixels into place.
 * The caret rotation is a transform, which the compositor handles for free.
 */
export function SpecAccordion({
  panels,
  defaultOpenId,
}: {
  readonly panels: ReadonlyArray<SpecPanel>;
  readonly defaultOpenId?: string;
}) {
  const groupId = useId();
  const [openIds, setOpenIds] = useState<ReadonlyArray<string>>(
    defaultOpenId ? [defaultOpenId] : [],
  );

  const toggle = (id: string) =>
    setOpenIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );

  return (
    <div className="border-t border-[var(--color-hairline)]">
      {panels.map((panel) => {
        const isOpen = openIds.includes(panel.id);
        const controlId = `${groupId}-${panel.id}-control`;
        const regionId = `${groupId}-${panel.id}-region`;

        return (
          <div key={panel.id} className="border-b border-[var(--color-hairline)]">
            <h3>
              <button
                type="button"
                id={controlId}
                aria-expanded={isOpen}
                aria-controls={regionId}
                onClick={() => toggle(panel.id)}
                data-testid={`accordion-trigger-${panel.id}`}
                className={cn(
                  "group flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left",
                  "font-sans text-[13px] font-semibold uppercase tracking-[0.12em]",
                  "text-[var(--color-ink)]",
                )}
              >
                <span>{panel.title}</span>
                {/* The label already sits at maximum contrast, so the hover
                    affordance is carried by the caret resolving from taupe to
                    ink rather than by tinting the text down. */}
                <CaretDown
                  aria-hidden="true"
                  weight="light"
                  size={16}
                  className={cn(
                    "shrink-0 text-[var(--color-muted)] transition-[transform,color] duration-300",
                    "[transition-timing-function:var(--ease-spring)]",
                    "group-hover:text-[var(--color-ink)]",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>

            <div
              id={regionId}
              role="region"
              aria-labelledby={controlId}
              hidden={!isOpen}
              data-testid={`accordion-panel-${panel.id}`}
            >
              <dl className={cn("pb-6", isOpen && "panel-in")}>
                {panel.rows.map((row) => (
                  <div
                    key={row.term}
                    className="grid grid-cols-1 gap-x-6 gap-y-1 py-2 sm:grid-cols-[10rem_minmax(0,1fr)]"
                  >
                    <dt className="numeral text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      {row.term}
                    </dt>
                    <dd className="min-w-0 text-[15px] leading-relaxed text-[var(--color-ink)]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
}
