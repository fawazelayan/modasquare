"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { EmptyResults } from "@/components/plp/empty-results";
import { FilterBar } from "@/components/plp/filter-bar";
import { ProductGrid } from "@/components/plp/product-grid";
import type { Category, Product } from "@/lib/catalog";
import { applyFilters, parseFilters } from "@/lib/filters";

interface CollectionViewProps {
  readonly category: Category;
  readonly initialProducts: ReadonlyArray<Product>;
}

function CollectionViewInner({ category, initialProducts }: CollectionViewProps) {
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const raw: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      raw[key] = value;
    });
    return parseFilters(raw);
  }, [searchParams]);

  const products = useMemo(() => {
    return applyFilters(initialProducts, filters);
  }, [initialProducts, filters]);

  return (
    <>
      <FilterBar
        filters={filters}
        resultCount={products.length}
        totalCount={initialProducts.length}
      />

      <section
        aria-label={`${category.label} products`}
        className="atelier-shell pb-[clamp(4rem,9vw,7rem)] pt-10"
      >
        {products.length === 0 ? (
          <EmptyResults filters={filters} collectionLabel={category.label} />
        ) : (
          <ProductGrid products={products} view={filters.view} />
        )}
      </section>
    </>
  );
}

export function CollectionView(props: CollectionViewProps) {
  return (
    <Suspense
      fallback={
        <>
          <FilterBar
            filters={{ sizes: [], fits: [], bands: [], view: "editorial" }}
            resultCount={props.initialProducts.length}
            totalCount={props.initialProducts.length}
          />
          <section
            aria-label={`${props.category.label} products`}
            className="atelier-shell pb-[clamp(4rem,9vw,7rem)] pt-10"
          >
            <ProductGrid products={props.initialProducts} view="editorial" />
          </section>
        </>
      }
    >
      <CollectionViewInner {...props} />
    </Suspense>
  );
}
