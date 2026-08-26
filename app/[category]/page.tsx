import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/plp/collection-view";
import { CATEGORIES, getCategory, getProductsByCategory, isCategorySlug } from "@/lib/catalog";

type PageProps = {
  params: Promise<{ category: string }>;
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

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;

  if (!isCategorySlug(slug)) notFound();

  const category = getCategory(slug);
  if (!category) notFound();

  const allProducts = getProductsByCategory(slug);

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

      <CollectionView category={category} initialProducts={allProducts} />
    </>
  );
}
