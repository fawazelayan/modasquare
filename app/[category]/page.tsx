import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyResults } from "@/components/plp/empty-results";
import { FilterBar } from "@/components/plp/filter-bar";
import { ProductGrid } from "@/components/plp/product-grid";
import { CATEGORIES, getCategory, getProductsByCategory, isCategorySlug } from "@/lib/catalog";
import { applyFilters, parseFilters } from "@/lib/filters";

/**
 * Product listing page.
 *
 * A Server Component. The filter rail below writes the query string; this page
 * reads it back, applies the predicate, and renders the result. The grid is
 * therefore server-rendered at the requested filter state, so a shared link
 * arrives showing exactly what the sender was looking at.
 */

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) return { title: "Collection not found" };

  return {
    title: category.label,
    description: category.note,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: slug } = await params;

  if (!isCategorySlug(slug)) notFound();

  const category = getCategory(slug);
  if (!category) notFound();

  const filters = parseFilters(await searchParams);
  const allProducts = getProductsByCategory(slug);
  const products = applyFilters(allProducts, filters);

  return (
    <>
      {/* --------------------------------------------------- collection head */}
      <section
        aria-labelledby="collection-title"
        className="atelier-shell pb-10 pt-[clamp(2.5rem,6vw,4.5rem)]"
      >
        <div className="grid grid-cols-1 gap-x-16 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
          <h1
            id="collection-title"
            className="font-display text-[length:var(--text-h1)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)]"
          >
            {category.headline}
          </h1>
          <p className="max-w-[52ch] text-[15px] leading-relaxed text-[var(--color-muted)] lg:pb-2">
            {category.note}
          </p>
        </div>
      </section>

      <FilterBar
        filters={filters}
        resultCount={products.length}
        totalCount={allProducts.length}
      />

      <section aria-label={`${category.label} products`} className="atelier-shell pb-[clamp(4rem,9vw,7rem)] pt-10">
        {products.length === 0 ? (
          <EmptyResults filters={filters} collectionLabel={category.label} />
        ) : (
          <ProductGrid products={products} view={filters.view} />
        )}
      </section>
    </>
  );
}
