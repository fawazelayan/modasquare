import { ProductCard } from "@/components/plp/product-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/catalog";
import type { GridView } from "@/lib/filters";

/**
 * PLP grid.
 *
 * Two densities from one markup tree. Editorial runs two wide columns with the
 * right-hand column dropped, which is the offset rhythm DESIGN.md 1 asks for.
 * Dense drops the stagger and the fabric note and packs to four columns, where
 * the offset would read as misalignment rather than composition.
 *
 * No virtualisation here on purpose: the largest collection is ten tiles, well
 * under the threshold in AGENTS.md, and a windowing layer would cost more than
 * it saves.
 */
export function ProductGrid({
  products,
  view,
}: {
  readonly products: ReadonlyArray<Product>;
  readonly view: GridView;
}) {
  const isEditorial = view === "editorial";

  return (
    <ul
      data-testid="product-grid"
      data-view={view}
      className={cn(
        "grid",
        isEditorial
          ? "grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-12"
          : "grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-4",
      )}
    >
      {products.map((product, index) => (
        <Reveal
          as="li"
          key={product.slug}
          index={index}
          className={cn(
            // Odd tiles drop by a fixed amount so the two columns never line up
            // across the page. Applied above `lg` only, because on a single
            // column the offset would just be a stray gap.
            isEditorial && index % 2 === 1 && "lg:mt-20",
          )}
        >
          <ProductCard product={product} density={isEditorial ? "editorial" : "dense"} />
        </Reveal>
      ))}
    </ul>
  );
}
