import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { CompleteTheLook } from "@/components/pdp/complete-the-look";
import { ProductGallery } from "@/components/pdp/product-gallery";
import { PurchasePanel } from "@/components/pdp/purchase-panel";
import { PRODUCTS, getCategory, getProduct } from "@/lib/catalog";

/**
 * Product detail page.
 *
 * Server-rendered shell with two client islands: the purchase panel and the
 * quick-size controls inside the cross-sell tiles. The gallery, the breadcrumb
 * and every string on the page stay on the server.
 */

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) return { title: "Piece not found" };

  return {
    title: product.name,
    description: product.summary,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const category = getCategory(product.category);

  return (
    <>
      <nav aria-label="Breadcrumb" className="atelier-shell pt-6">
        <ol className="flex flex-wrap items-center gap-1 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
          <li>
            <Link href="/" className="link-ghost decoration-transparent">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="px-1">
            <CaretRight weight="light" size={11} />
          </li>
          <li>
            <Link href={`/${product.category}`} className="link-ghost decoration-transparent">
              {category?.label ?? product.category}
            </Link>
          </li>
          <li aria-hidden="true" className="px-1">
            <CaretRight weight="light" size={11} />
          </li>
          {/* The current page is named but not linked. */}
          <li aria-current="page" className="min-w-0 truncate text-[var(--color-ink)]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Split screen. The gallery column scrolls, the purchase column sticks.
          Below `lg` the two stack and the gallery becomes a snap rail. */}
      <div className="atelier-shell grid grid-cols-1 gap-x-16 gap-y-10 pb-[clamp(3rem,7vw,5rem)] pt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,26rem)] xl:gap-x-24">
        <ProductGallery product={product} />
        <PurchasePanel product={product} />
      </div>

      <CompleteTheLook product={product} />
    </>
  );
}
