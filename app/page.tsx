import type { Metadata } from "next";
import { AtelierNote } from "@/components/home/atelier-note";
import { CategoryDiscovery } from "@/components/home/category-discovery";
import { EditorialHero } from "@/components/home/editorial-hero";
import { FeaturedDrop } from "@/components/home/featured-drop";

export const metadata: Metadata = {
  // Absolute, so the layout template does not render "Modasquare | Modasquare".
  title: { absolute: "Modasquare" },
  description:
    "Atelier Series 04. Outerwear, tailoring and heavy jersey, cut wide and made in small runs.",
};

/**
 * Homepage.
 *
 * Four sections, four different layout families: asymmetric split, staggered
 * discovery grid, pinned title beside a snap rail, and an offset statement over
 * a staggered plate band. Nothing repeats.
 */
export default function HomePage() {
  return (
    <>
      <EditorialHero />
      <CategoryDiscovery />
      <FeaturedDrop />
      <AtelierNote />
    </>
  );
}
