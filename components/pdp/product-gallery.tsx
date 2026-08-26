import { Frame } from "@/components/ui/frame";
import type { Product } from "@/lib/catalog";

/**
 * Product gallery.
 *
 * Two pieces. A sticky shot index pinned at the far left, and the plate stack
 * that scrolls beside it. The index is built from ordinary anchors, so it works
 * before hydration, keeps Cmd-click behaviour, and needs no scroll listener to
 * stay useful. `scroll-margin-top` on each plate keeps the sticky header from
 * covering the target.
 *
 * Below `lg` the stack becomes a horizontal snap rail: a tall column of four
 * plates on a phone would push the size selector far off screen.
 */
export function ProductGallery({ product }: { readonly product: Product }) {
  return (
    <div className="min-w-0 xl:grid xl:grid-cols-[7rem_minmax(0,1fr)] xl:gap-6">
      {/* ------------------------------------------------------- shot index */}
      {/* Named, not numbered. "Collar detail" tells the customer what they are
          jumping to; "02 / 04" tells them something they can already see. The
          index only appears from `xl`, where taking 7rem off the plate width
          costs nothing. */}
      <nav
        aria-label="Gallery shots"
        className="sticky top-[calc(var(--header-height)+2rem)] hidden self-start xl:block"
      >
        <ol className="flex flex-col items-start gap-1 border-l border-[var(--color-hairline)]">
          {product.gallery.map((shot, index) => (
            <li key={shot.label}>
              <a
                href={`#shot-${index}`}
                data-testid={`shot-link-${index}`}
                className={
                  "-ml-px flex min-h-[44px] items-center border-l border-transparent pl-3 " +
                  "text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] " +
                  "transition-[color,border-color] duration-200 " +
                  "[transition-timing-function:var(--ease-quiet)] " +
                  "hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                }
              >
                {shot.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ------------------------------------------------------ plate stack */}
      <ul
        className={
          "scroll-contained -mx-[var(--spacing-gutter)] flex snap-x snap-mandatory gap-3 " +
          "overflow-x-auto px-[var(--spacing-gutter)] pb-3 " +
          "lg:mx-0 lg:block lg:space-y-3 lg:overflow-visible lg:px-0 lg:pb-0"
        }
        data-testid="pdp-gallery"
      >
        {product.gallery.map((shot, index) => (
          <li
            key={shot.label}
            id={`shot-${index}`}
            className="w-[82vw] shrink-0 snap-start scroll-mt-[calc(var(--header-height)+2rem)] sm:w-[62vw] lg:w-auto"
          >
            <Frame
              ratio={shot.ratio}
              label={shot.label}
              note={index === 0 ? product.colour : undefined}
              image={shot.image}
              alt={`${product.name} - ${shot.label}`}
              priority={index === 0}
              pitch={shot.ratio === "1:1" ? 34 : 48}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
