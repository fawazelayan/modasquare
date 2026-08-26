import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Frame } from "@/components/ui/frame";
import { Reveal } from "@/components/ui/reveal";
import { CATEGORIES, getProductsByCategory, type AspectRatio } from "@/lib/catalog";

/**
 * Category discovery.
 *
 * Three destinations, three cells, no filler. The split is 7/5 across the top
 * with the second cell dropped vertically, then a wide plate underneath. Three
 * equal columns would be the generic answer and the ratios carry the hierarchy
 * instead: Women is the largest surface because it is the deepest collection.
 */

const LAYOUT: Record<string, { cell: string; ratio: AspectRatio; pitch: number }> = {
  women: { cell: "lg:col-span-7", ratio: "4:5", pitch: 52 },
  men: { cell: "lg:col-span-5 lg:mt-20", ratio: "3:4", pitch: 44 },
  teen: { cell: "lg:col-span-12", ratio: "16:9", pitch: 64 },
};

export function CategoryDiscovery() {
  return (
    <section aria-labelledby="collections-title" className="atelier-shell atelier-section">
      <Reveal>
        <h2
          id="collections-title"
          className="max-w-[20ch] font-display text-[length:var(--text-h1)] font-light leading-[1.08] tracking-[-0.02em] text-[var(--color-ink)]"
        >
          Three collections, one cutting table
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12 lg:gap-y-4">
        {CATEGORIES.map((category, index) => {
          const layout = LAYOUT[category.slug];
          const count = getProductsByCategory(category.slug).length;

          return (
            <Reveal key={category.slug} index={index} className={layout.cell}>
              <Link href={`/${category.slug}`} className="group block" data-testid={`discover-${category.slug}`}>
                <div className="overflow-hidden rounded-[2px]">
                  <div className="transition-transform duration-[700ms] [transition-timing-function:var(--ease-spring)] motion-safe:group-hover:scale-[1.03]">
                    <Frame
                      ratio={layout.ratio}
                      label={category.label}
                      note="Collection plate"
                      image={category.image}
                      alt={`${category.label} collection lookbook plate`}
                      pitch={layout.pitch}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-2 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-[var(--color-ink)]">
                      {category.headline}
                      <ArrowUpRight
                        aria-hidden="true"
                        weight="light"
                        size={20}
                        className="shrink-0 text-[var(--color-muted)] transition-transform duration-300 [transition-timing-function:var(--ease-spring)] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                      />
                    </h3>
                    <p className="mt-1 max-w-[52ch] text-[15px] leading-relaxed text-[var(--color-muted)]">
                      {category.note}
                    </p>
                  </div>

                  <p className="numeral shrink-0 pt-2 text-[12px] tracking-[0.14em] text-[var(--color-muted)]">
                    {count} pieces
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
