import type { Metadata } from "next";
import { AtelierNote } from "@/components/home/atelier-note";
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
 */
export default function HomePage() {
  return (
    <>
      <EditorialHero />
      <FeaturedDrop />
      <AtelierNote />
    </>
  );
}
