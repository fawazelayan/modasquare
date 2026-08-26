import { ProductCard } from "@/components/plp/product-card";
import { Reveal } from "@/components/ui/reveal";
import { getProducts, type Product } from "@/lib/catalog";

/**
 * Complete the look.
 *
 * Three hand-paired pieces, laid out as one wide tile beside two narrow ones so
 * it does not repeat the even grid used on the listing page. Each tile carries
 * its own quick-size control, so a pairing can go into the bag without leaving
 * the product being viewed.
 */
export function CompleteTheLook({ product }: { readonly product: Product }) {
  const pairings = getProducts(product.pairsWith).filter((item) => item.slug !== product.slug);

  if (pairings.length === 0) return null;

  const [lead, ...rest] = pairings;

  return (
    <section
      aria-labelledby="complete-the-look-title"
      className="atelier-shell border-t border-[var(--color-hairline)] py-[clamp(3.5rem,8vw,6rem)]"
    >
      <Reveal>
        <h2
          id="complete-the-look-title"
          className="font-display text-[length:var(--text-h2)] font-light leading-tight tracking-[-0.01em] text-[var(--color-ink)]"
        >
          Complete the look
        </h2>
        <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-[var(--color-muted)]">
          {`Cut and finished alongside the ${product.name.toLowerCase()}, in the same weight of cloth.`}
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Reveal index={0}>
          <ProductCard product={lead} />
        </Reveal>

        {rest.map((item, index) => (
          <Reveal key={item.slug} index={index + 1} className="lg:pt-16">
            <ProductCard product={item} density="dense" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
