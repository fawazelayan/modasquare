/**
 * Static catalogue for the MODASQUARE prototype.
 *
 * All products, categories, specs, and curated editorial photography assets
 * are typed and colocated.
 */

export type AspectRatio = "3:4" | "4:5" | "16:9" | "1:1" | "9:16";

export type CategorySlug = "women" | "men" | "teen";

export type SubcategorySlug = "tops" | "jeans" | "trousers" | "outerwear" | "knits" | "sweats";

export type SizeLabel = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type FitLabel = "Oversized" | "Relaxed" | "Tailored" | "Cropped";

export type PriceBandId = "band-1" | "band-2" | "band-3" | "band-4";

export interface SizeOption {
  readonly label: SizeLabel;
  readonly inStock: boolean;
}

export interface Frame {
  /** Minimalist caption or shot description. */
  readonly label: string;
  readonly ratio: AspectRatio;
  readonly image?: string;
  readonly note?: string;
}

export interface SpecPanel {
  readonly id: string;
  readonly title: string;
  readonly rows: ReadonlyArray<{ readonly term: string; readonly value: string }>;
}

export interface Product {
  readonly slug: string;
  readonly name: string;
  /** Collection line shown as metadata under the product name. */
  readonly line: string;
  readonly category: CategorySlug;
  /** Minor units, JOD (Jordanian Dinar). Formatted through Intl at render time. */
  readonly price: number;
  readonly colour: string;
  readonly fabric: string;
  readonly fit: FitLabel;
  readonly sizes: ReadonlyArray<SizeOption>;
  /** Primary card ratio. Portrait only, per DESIGN.md product tile rules. */
  readonly ratio: Extract<AspectRatio, "3:4" | "4:5">;
  readonly gallery: ReadonlyArray<Frame>;
  readonly summary: string;
  readonly specs: ReadonlyArray<SpecPanel>;
  /** Slugs rendered by the Complete the Look module on the PDP. */
  readonly pairsWith: ReadonlyArray<string>;
  readonly subcategory?: SubcategorySlug;
  readonly isNew?: boolean;
}

export interface Category {
  readonly slug: CategorySlug;
  readonly label: string;
  readonly headline: string;
  readonly note: string;
  readonly image?: string;
}

export const CATEGORIES: ReadonlyArray<Category> = [
  {
    slug: "men",
    label: "Men",
    headline: "Men",
    note: "Utility layers, pleated trousers and loomstate denim built to hold their shape.",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=1600",
  },
  {
    slug: "women",
    label: "Women",
    headline: "Women",
    note: "Structured outerwear, column tailoring and heavyweight jersey cut for volume.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600",
  },
  {
    slug: "teen",
    label: "Kids",
    headline: "Kids",
    note: "Lighter constructions, wider silhouettes and technical nylon in the same palette.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1600",
  },
];

export interface SubcategoryItem {
  readonly slug: SubcategorySlug | "all";
  readonly label: string;
  readonly query: string;
}

export interface Department {
  readonly slug: CategorySlug;
  readonly label: string;
  readonly headline: string;
  readonly note: string;
  readonly subcategories: ReadonlyArray<SubcategoryItem>;
}

export const DEPARTMENTS: ReadonlyArray<Department> = [
  {
    slug: "men",
    label: "Men",
    headline: "Men's Atelier",
    note: "Utility layers, pleated trousers and loomstate denim built to hold their shape.",
    subcategories: [
      { slug: "all", label: "All Men", query: "" },
      { slug: "tops", label: "Tops & Shirts", query: "sub=tops" },
      { slug: "jeans", label: "Jeans & Denim", query: "sub=jeans" },
      { slug: "trousers", label: "Trousers & Pants", query: "sub=trousers" },
      { slug: "outerwear", label: "Jackets & Outerwear", query: "sub=outerwear" },
      { slug: "knits", label: "Knits & Sweaters", query: "sub=knits" },
      { slug: "sweats", label: "Sweats & Hoodies", query: "sub=sweats" },
    ],
  },
  {
    slug: "women",
    label: "Women",
    headline: "Women's Atelier",
    note: "Structured outerwear, column tailoring and heavyweight jersey cut for volume.",
    subcategories: [
      { slug: "all", label: "All Women", query: "" },
      { slug: "tops", label: "Tops & Tanks", query: "sub=tops" },
      { slug: "jeans", label: "Jeans & Skirts", query: "sub=jeans" },
      { slug: "trousers", label: "Trousers & Tailoring", query: "sub=trousers" },
      { slug: "outerwear", label: "Jackets & Outerwear", query: "sub=outerwear" },
      { slug: "knits", label: "Knits & Sweaters", query: "sub=knits" },
      { slug: "sweats", label: "Sweats & Hoodies", query: "sub=sweats" },
    ],
  },
  {
    slug: "teen",
    label: "Kids",
    headline: "Kids & Youth",
    note: "Lighter constructions, wider silhouettes and technical nylon in the same palette.",
    subcategories: [
      { slug: "all", label: "All Kids", query: "" },
      { slug: "tops", label: "Graphic Tees & Tops", query: "sub=tops" },
      { slug: "jeans", label: "Baggy Jeans & Denim", query: "sub=jeans" },
      { slug: "trousers", label: "Parachute Pants", query: "sub=trousers" },
      { slug: "outerwear", label: "Jackets & Windbreakers", query: "sub=outerwear" },
      { slug: "sweats", label: "Fleeces & Sweats", query: "sub=sweats" },
    ],
  },
];

export const SIZE_ORDER: ReadonlyArray<SizeLabel> = ["XS", "S", "M", "L", "XL", "XXL"];

export const FIT_OPTIONS: ReadonlyArray<FitLabel> = ["Oversized", "Relaxed", "Tailored", "Cropped"];

export interface PriceBand {
  readonly id: PriceBandId;
  readonly label: string;
  readonly min: number;
  readonly max: number;
}

export const PRICE_BANDS: ReadonlyArray<PriceBand> = [
  { id: "band-1", label: "Under 200 JOD", min: 0, max: 199 },
  { id: "band-2", label: "200 to 400 JOD", min: 200, max: 399 },
  { id: "band-3", label: "400 to 800 JOD", min: 400, max: 799 },
  { id: "band-4", label: "800 JOD and above", min: 800, max: Number.POSITIVE_INFINITY },
];

/** Free-shipping threshold in JOD used by the cart drawer tracker. */
export const FREE_SHIPPING_THRESHOLD: number = 350;

const allSizes = (stocked: ReadonlyArray<SizeLabel>, offered: ReadonlyArray<SizeLabel>): SizeOption[] =>
  offered.map((label) => ({ label, inStock: stocked.includes(label) }));

const APPAREL: ReadonlyArray<SizeLabel> = ["XS", "S", "M", "L", "XL"];
const APPAREL_WIDE: ReadonlyArray<SizeLabel> = ["XS", "S", "M", "L", "XL", "XXL"];

const careRows = (fabric: string, origin: string) => [
  { term: "Composition", value: fabric },
  { term: "Care", value: "Cold wash, reshape flat, warm iron on the reverse" },
  { term: "Made in", value: origin },
];

export const PRODUCTS: ReadonlyArray<Product> = [
  /* ------------------------------------------------------------------ Women */
  {
    slug: "anvers-cropped-bomber",
    subcategory: "outerwear",
    name: "Anvers Cropped Bomber",
    line: "Atelier Series 04",
    category: "women",
    price: 690,
    colour: "Bone",
    fabric: "Bonded cotton canvas",
    fit: "Cropped",
    sizes: allSizes(["XS", "S", "M", "XL"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" },
      { label: "Back", ratio: "3:4", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200" },
      { label: "Collar detail", ratio: "1:1", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A short bomber cut with a raised collar and a dropped shoulder. The canvas is bonded so the body holds a clean line away from the waist.",
    specs: [
      {
        id: "materials",
        title: "Materials and care",
        rows: careRows("62% cotton, 38% recycled polyamide bonding", "Portugal"),
      },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Cropped through the body, dropped shoulder" },
          { term: "Model", value: "1.78 m, wearing S" },
          { term: "Length", value: "52 cm at centre back, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["sablon-wool-trouser", "aster-ribbed-tank", "petra-denim-column-skirt"],
    isNew: true,
  },
  {
    slug: "sablon-wool-trouser",
    subcategory: "trousers",
    name: "Sablon Wool Trouser",
    line: "Atelier Series 04",
    category: "women",
    price: 420,
    colour: "Charcoal",
    fabric: "Italian wool flannel",
    fit: "Tailored",
    sizes: allSizes(["XS", "S", "M", "L", "XL"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200" },
      { label: "Side", ratio: "3:4", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=1200" },
      { label: "Waistband", ratio: "1:1", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A single-pleat trouser in a dry flannel. The leg falls straight from a high waistband with no taper below the knee.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% virgin wool", "Italy") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "High rise, straight leg, single pleat" },
          { term: "Model", value: "1.78 m, wearing S" },
          { term: "Inseam", value: "78 cm, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["anvers-cropped-bomber", "meridian-boxy-knit", "nord-quilted-liner"],
  },
  {
    slug: "meridian-boxy-knit",
    subcategory: "knits",
    name: "Meridian Boxy Knit",
    line: "Core Atelier",
    category: "women",
    price: 285,
    colour: "Ash Olive",
    fabric: "Compact merino",
    fit: "Oversized",
    sizes: allSizes(["S", "M", "L"], APPAREL),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1200" },
      { label: "Sleeve", ratio: "4:5", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200" },
      { label: "Rib detail", ratio: "1:1", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A square-bodied crew knitted in compact merino, so the shoulder stays flat and the hem holds without a heavy rib.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% extra-fine merino wool", "Scotland") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Boxy, wide through the chest" },
          { term: "Model", value: "1.75 m, wearing M" },
          { term: "Length", value: "58 cm at centre back, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["sablon-wool-trouser", "petra-denim-column-skirt", "halden-cargo-trouser"],
  },
  {
    slug: "kessel-zip-hoodie",
    subcategory: "sweats",
    name: "Kessel Zip Hoodie",
    line: "Heavy Jersey",
    category: "women",
    price: 245,
    colour: "Fog",
    fabric: "Japanese loopback cotton",
    fit: "Relaxed",
    sizes: allSizes(["XS", "S", "L", "XL"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200" },
      { label: "Hood", ratio: "3:4", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200" },
      { label: "Cuff", ratio: "1:1", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A 480 gsm loopback hoodie with a two-panel hood and a metal zip that runs to the chin.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% organic cotton, 480 gsm", "Japan") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Relaxed, straight through the body" },
          { term: "Model", value: "1.75 m, wearing S" },
          { term: "Length", value: "64 cm at centre back, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["halden-cargo-trouser", "aster-ribbed-tank", "meridian-boxy-knit"],
  },
  {
    slug: "petra-denim-column-skirt",
    subcategory: "jeans",
    name: "Petra Denim Column Skirt",
    line: "Atelier Series 04",
    category: "women",
    price: 310,
    colour: "Raw Indigo",
    fabric: "Japanese selvedge denim",
    fit: "Tailored",
    sizes: allSizes(["XS", "S", "M", "L"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200" },
      { label: "Back", ratio: "3:4", image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=1200" },
      { label: "Hem", ratio: "1:1", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=1200" },
      { label: "Selvedge", ratio: "1:1", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A floor-skimming column in loomstate denim. The side seam is left unwashed so the skirt breaks in against the wearer.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% cotton selvedge denim, 13.5 oz", "Japan") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Straight column, high waist" },
          { term: "Model", value: "1.78 m, wearing S" },
          { term: "Length", value: "96 cm, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["meridian-boxy-knit", "anvers-cropped-bomber", "nord-quilted-liner"],
    isNew: true,
  },
  {
    slug: "nord-quilted-liner",
    subcategory: "outerwear",
    name: "Nord Quilted Liner",
    line: "Outer Atelier",
    category: "women",
    price: 880,
    colour: "Slate",
    fabric: "Recycled ripstop with wool wadding",
    fit: "Oversized",
    sizes: allSizes(["S", "M", "L", "XL"], APPAREL),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1200" },
      { label: "Open", ratio: "4:5", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1200" },
      { label: "Quilting", ratio: "1:1", image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=1200" },
      { label: "Lining", ratio: "1:1", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A long quilted liner that wears as an outer layer. Wool wadding keeps the weight down without collapsing the channel lines.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("Shell 100% recycled polyamide, wadding 70% wool", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Oversized, falls below the knee" },
          { term: "Model", value: "1.78 m, wearing S" },
          { term: "Length", value: "112 cm at centre back, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["sablon-wool-trouser", "meridian-boxy-knit", "kessel-zip-hoodie"],
  },
  {
    slug: "aster-ribbed-tank",
    subcategory: "tops",
    name: "Aster Ribbed Tank",
    line: "Core Atelier",
    category: "women",
    price: 130,
    colour: "Bone",
    fabric: "Mercerised cotton rib",
    fit: "Cropped",
    sizes: allSizes(["XS", "S", "M", "L", "XL"], APPAREL),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1200" },
      { label: "Back", ratio: "4:5", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200" },
      { label: "Neckline", ratio: "1:1", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A narrow rib tank with a bound neckline. Mercerised so the surface stays even after repeated washing.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("95% mercerised cotton, 5% elastane", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Close, cropped at the hip bone" },
          { term: "Model", value: "1.75 m, wearing S" },
          { term: "Length", value: "44 cm at centre back, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["halden-cargo-trouser", "anvers-cropped-bomber", "sablon-wool-trouser"],
  },
  {
    slug: "halden-cargo-trouser",
    subcategory: "trousers",
    name: "Halden Cargo Trouser",
    line: "Utility Atelier",
    category: "women",
    price: 365,
    colour: "Ash Olive",
    fabric: "Cotton ventile",
    fit: "Relaxed",
    sizes: allSizes(["XS", "M", "L", "XL"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=1200" },
      { label: "Pocket", ratio: "3:4", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1200" },
      { label: "Hem cinch", ratio: "1:1", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A wide cargo in tightly woven ventile, with bellows pockets set back on the thigh so the leg line stays clean from the front.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% long-staple cotton ventile", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Mid rise, wide leg, cinched hem" },
          { term: "Model", value: "1.78 m, wearing S" },
          { term: "Inseam", value: "76 cm, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["kessel-zip-hoodie", "aster-ribbed-tank", "meridian-boxy-knit"],
  },
  {
    slug: "lumen-sheer-layer-top",
    subcategory: "tops",
    name: "Lumen Sheer Layer Top",
    line: "Atelier Series 04",
    category: "women",
    price: 195,
    colour: "Smoke",
    fabric: "Silk-blend georgette",
    fit: "Relaxed",
    sizes: allSizes(["XS", "S", "M"], APPAREL),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200" },
      { label: "Layered", ratio: "4:5", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" },
      { label: "Seam", ratio: "1:1", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A long-sleeved georgette layer with French seams throughout, cut to sit over a tank without adding bulk at the shoulder.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("62% silk, 38% viscose", "Italy") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Relaxed, semi-sheer" },
          { term: "Model", value: "1.75 m, wearing XS" },
          { term: "Length", value: "60 cm at centre back, size XS" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["sablon-wool-trouser", "petra-denim-column-skirt", "aster-ribbed-tank"],
  },
  {
    slug: "vestry-poplin-overshirt",
    subcategory: "tops",
    name: "Vestry Poplin Overshirt",
    line: "Core Atelier",
    category: "women",
    price: 260,
    colour: "Chalk",
    fabric: "Compact cotton poplin",
    fit: "Oversized",
    sizes: allSizes(["S", "M", "L", "XL"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200" },
      { label: "Open", ratio: "3:4", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200" },
      { label: "Placket", ratio: "1:1", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A shirt cut to overshirt proportions, with a hidden placket and a squared hem that reads as a jacket when left open.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% compact cotton poplin", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Oversized, dropped shoulder" },
          { term: "Model", value: "1.75 m, wearing S" },
          { term: "Length", value: "76 cm at centre back, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["halden-cargo-trouser", "aster-ribbed-tank", "sablon-wool-trouser"],
  },

  /* -------------------------------------------------------------------- Men */
  {
    slug: "halden-utility-overshirt",
    subcategory: "tops",
    name: "Halden Utility Overshirt",
    line: "Utility Atelier",
    category: "men",
    price: 395,
    colour: "Ash Olive",
    fabric: "Cotton ventile",
    fit: "Relaxed",
    sizes: allSizes(["S", "M", "L", "XXL"], APPAREL_WIDE),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "/images/products/halden-utility-overshirt.jpg" },
      { label: "Back", ratio: "3:4", image: "/images/products/halden-utility-overshirt.jpg" },
      { label: "Pocket", ratio: "1:1", image: "/images/products/halden-utility-overshirt.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/halden-utility-overshirt.jpg" },
    ],
    summary:
      "A square overshirt in ventile with two chest pockets set wide. Heavy enough to wear as the outer layer into autumn.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% long-staple cotton ventile", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Relaxed, squared hem" },
          { term: "Model", value: "1.86 m, wearing M" },
          { term: "Length", value: "74 cm at centre back, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["corso-pleated-trouser", "rundle-boxy-tee", "ardent-selvedge-denim"],
    isNew: true,
  },
  {
    slug: "brix-heavyweight-hoodie",
    subcategory: "sweats",
    name: "Brix Heavyweight Hoodie",
    line: "Heavy Jersey",
    category: "men",
    price: 265,
    colour: "Charcoal",
    fabric: "Japanese loopback cotton",
    fit: "Oversized",
    sizes: allSizes(["S", "M", "L", "XL", "XXL"], APPAREL_WIDE),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "/images/products/brix-heavyweight-hoodie.jpg" },
      { label: "Hood", ratio: "3:4", image: "/images/products/brix-heavyweight-hoodie.jpg" },
      { label: "Cuff", ratio: "1:1", image: "/images/products/brix-heavyweight-hoodie.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/brix-heavyweight-hoodie.jpg" },
    ],
    summary:
      "A 520 gsm hoodie with a three-panel hood and a flat drawcord. The body is cut wide and stops at the hip.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% organic cotton, 520 gsm", "Japan") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Oversized, dropped shoulder" },
          { term: "Model", value: "1.86 m, wearing M" },
          { term: "Length", value: "70 cm at centre back, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["slate-track-pant", "rundle-boxy-tee", "fenwick-nylon-anorak"],
  },
  {
    slug: "corso-pleated-trouser",
    subcategory: "trousers",
    name: "Corso Pleated Trouser",
    line: "Atelier Series 04",
    category: "men",
    price: 445,
    colour: "Slate",
    fabric: "Italian wool flannel",
    fit: "Tailored",
    sizes: allSizes(["S", "M", "L", "XL"], APPAREL_WIDE),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "/images/products/corso-pleated-trouser.jpg" },
      { label: "Side", ratio: "3:4", image: "/images/products/corso-pleated-trouser.jpg" },
      { label: "Pleat", ratio: "1:1", image: "/images/products/corso-pleated-trouser.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/corso-pleated-trouser.jpg" },
    ],
    summary:
      "A double-pleat trouser with a wide waistband and a half-inch cuff. The flannel is milled dry so the crease holds.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% virgin wool flannel", "Italy") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "High rise, double pleat, cuffed" },
          { term: "Model", value: "1.86 m, wearing M" },
          { term: "Inseam", value: "82 cm, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["halden-utility-overshirt", "marlow-cable-crew", "rundle-boxy-tee"],
  },
  {
    slug: "rundle-boxy-tee",
    subcategory: "tops",
    name: "Rundle Boxy Tee",
    line: "Core Atelier",
    category: "men",
    price: 115,
    colour: "Bone",
    fabric: "Tubular cotton jersey",
    fit: "Oversized",
    sizes: allSizes(["S", "M", "L", "XL", "XXL"], APPAREL_WIDE),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "/images/products/rundle-boxy-tee.jpg" },
      { label: "Back", ratio: "4:5", image: "/images/products/rundle-boxy-tee.jpg" },
      { label: "Collar", ratio: "1:1", image: "/images/products/rundle-boxy-tee.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/rundle-boxy-tee.jpg" },
    ],
    summary:
      "A tubular-knit tee with no side seams, so the body stays square through the wash. Ribbed collar set by hand.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% organic cotton, 240 gsm", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Boxy, wide sleeve" },
          { term: "Model", value: "1.86 m, wearing M" },
          { term: "Length", value: "70 cm at centre back, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["ardent-selvedge-denim", "halden-utility-overshirt", "brix-heavyweight-hoodie"],
  },
  {
    slug: "fenwick-nylon-anorak",
    subcategory: "outerwear",
    name: "Fenwick Nylon Anorak",
    line: "Outer Atelier",
    category: "men",
    price: 940,
    colour: "Smoke",
    fabric: "Coated nylon ripstop",
    fit: "Oversized",
    sizes: allSizes(["M", "L", "XL"], APPAREL_WIDE),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "/images/products/fenwick-nylon-anorak.jpg" },
      { label: "Hood up", ratio: "4:5", image: "/images/products/fenwick-nylon-anorak.jpg" },
      { label: "Seam tape", ratio: "1:1", image: "/images/products/fenwick-nylon-anorak.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/fenwick-nylon-anorak.jpg" },
    ],
    summary:
      "A half-zip anorak in coated ripstop with fully taped seams and a single kangaroo pocket across the front.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% recycled nylon ripstop, PU coated", "Japan") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Oversized, hip length" },
          { term: "Model", value: "1.86 m, wearing M" },
          { term: "Length", value: "76 cm at centre back, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["slate-track-pant", "brix-heavyweight-hoodie", "rundle-boxy-tee"],
    isNew: true,
  },
  {
    slug: "marlow-cable-crew",
    subcategory: "knits",
    name: "Marlow Cable Crew",
    line: "Core Atelier",
    category: "men",
    price: 340,
    colour: "Oat",
    fabric: "Lambswool",
    fit: "Relaxed",
    sizes: allSizes(["S", "L", "XL"], APPAREL_WIDE),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1200" },
      { label: "Shoulder", ratio: "4:5", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200" },
      { label: "Cable", ratio: "1:1", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A five-gauge cable crew in undyed lambswool. Saddle shoulders keep the cable running unbroken to the neck.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% undyed lambswool", "Scotland") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Relaxed, saddle shoulder" },
          { term: "Model", value: "1.86 m, wearing M" },
          { term: "Length", value: "68 cm at centre back, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["corso-pleated-trouser", "ardent-selvedge-denim", "halden-utility-overshirt"],
  },
  {
    slug: "ardent-selvedge-denim",
    subcategory: "jeans",
    name: "Ardent Selvedge Denim",
    line: "Utility Atelier",
    category: "men",
    price: 330,
    colour: "Raw Indigo",
    fabric: "Japanese selvedge denim",
    fit: "Relaxed",
    sizes: allSizes(["S", "M", "L", "XL", "XXL"], APPAREL_WIDE),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "/images/products/ardent-selvedge-denim.jpg" },
      { label: "Back", ratio: "3:4", image: "/images/products/ardent-selvedge-denim.jpg" },
      { label: "Selvedge", ratio: "1:1", image: "/images/products/ardent-selvedge-denim.jpg" },
      { label: "Hardware", ratio: "1:1", image: "/images/products/ardent-selvedge-denim.jpg" },
    ],
    summary:
      "A straight five-pocket in 14 oz loomstate denim, unwashed so the indigo settles against the way it is worn.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% cotton selvedge denim, 14 oz", "Japan") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Mid rise, straight leg" },
          { term: "Model", value: "1.86 m, wearing M" },
          { term: "Inseam", value: "84 cm, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["rundle-boxy-tee", "marlow-cable-crew", "halden-utility-overshirt"],
  },
  {
    slug: "slate-track-pant",
    subcategory: "trousers",
    name: "Slate Track Pant",
    line: "Heavy Jersey",
    category: "men",
    price: 185,
    colour: "Charcoal",
    fabric: "Brushed cotton fleece",
    fit: "Relaxed",
    sizes: allSizes(["S", "M", "XL", "XXL"], APPAREL_WIDE),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1200" },
      { label: "Side", ratio: "3:4", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200" },
      { label: "Waistband", ratio: "1:1", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200" },
      { label: "Fabric", ratio: "1:1", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200" },
    ],
    summary:
      "A brushed-back fleece pant with a flat waistband and an open hem, cut wide enough to sit over a boot.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% organic cotton fleece, 420 gsm", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Relaxed, open hem" },
          { term: "Model", value: "1.86 m, wearing M" },
          { term: "Inseam", value: "80 cm, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["brix-heavyweight-hoodie", "fenwick-nylon-anorak", "rundle-boxy-tee"],
  },

  /* ------------------------------------------------------------------- Teen / Kids */
  {
    slug: "volta-graphic-tee",
    subcategory: "tops",
    name: "Volta Graphic Tee",
    line: "Teen Studio",
    category: "teen",
    price: 85,
    colour: "Chalk",
    fabric: "Cotton jersey",
    fit: "Oversized",
    sizes: allSizes(["XS", "S", "M", "L"], APPAREL),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "/images/products/volta-graphic-tee.jpg" },
      { label: "Detail", ratio: "4:5", image: "/images/products/volta-graphic-tee.jpg" },
      { label: "Print", ratio: "1:1", image: "/images/products/volta-graphic-tee.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/volta-graphic-tee.jpg" },
    ],
    summary:
      "A wide tee with a discharge print at the back yoke, washed once so the hand stays soft against the skin.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% organic cotton, 200 gsm", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Oversized, dropped shoulder" },
          { term: "Model", value: "1.70 m, wearing S" },
          { term: "Length", value: "68 cm at centre back, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["ridge-baggy-denim", "onda-fleece-half-zip", "kite-parachute-pant"],
  },
  {
    slug: "nyx-cropped-windbreaker",
    subcategory: "outerwear",
    name: "Nyx Cropped Windbreaker",
    line: "Teen Studio",
    category: "teen",
    price: 220,
    colour: "Smoke",
    fabric: "Coated nylon ripstop",
    fit: "Cropped",
    sizes: allSizes(["XS", "S", "L"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "/images/products/nyx-cropped-windbreaker.jpg" },
      { label: "Back", ratio: "3:4", image: "/images/products/nyx-cropped-windbreaker.jpg" },
      { label: "Zip pull", ratio: "1:1", image: "/images/products/nyx-cropped-windbreaker.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/nyx-cropped-windbreaker.jpg" },
    ],
    summary:
      "A short windbreaker with an elasticated hem and a stand collar. Packs into its own left-hand pocket.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% recycled nylon ripstop", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Cropped, elasticated hem" },
          { term: "Model", value: "1.70 m, wearing S" },
          { term: "Length", value: "54 cm at centre back, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["ridge-baggy-denim", "volta-graphic-tee", "static-boxy-sweat"],
    isNew: true,
  },
  {
    slug: "ridge-baggy-denim",
    subcategory: "jeans",
    name: "Ridge Baggy Denim",
    line: "Teen Studio",
    category: "teen",
    price: 175,
    colour: "Stone Wash",
    fabric: "Rigid cotton denim",
    fit: "Oversized",
    sizes: allSizes(["XS", "S", "M", "L", "XL"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "/images/products/ridge-baggy-denim.jpg" },
      { label: "Back", ratio: "3:4", image: "/images/products/ridge-baggy-denim.jpg" },
      { label: "Hem", ratio: "1:1", image: "/images/products/ridge-baggy-denim.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/ridge-baggy-denim.jpg" },
    ],
    summary:
      "A wide five-pocket in rigid denim, stone washed to a flat mid tone with no whiskering at the hip.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% cotton denim, 12 oz", "Turkey") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Low rise, very wide leg" },
          { term: "Model", value: "1.70 m, wearing S" },
          { term: "Inseam", value: "80 cm, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["volta-graphic-tee", "nyx-cropped-windbreaker", "static-boxy-sweat"],
  },
  {
    slug: "onda-fleece-half-zip",
    subcategory: "sweats",
    name: "Onda Fleece Half-Zip",
    line: "Teen Studio",
    category: "teen",
    price: 165,
    colour: "Fog",
    fabric: "Recycled polar fleece",
    fit: "Relaxed",
    sizes: allSizes(["S", "M", "L", "XL"], APPAREL),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "/images/products/onda-fleece-half-zip.jpg" },
      { label: "Collar", ratio: "4:5", image: "/images/products/onda-fleece-half-zip.jpg" },
      { label: "Zip", ratio: "1:1", image: "/images/products/onda-fleece-half-zip.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/onda-fleece-half-zip.jpg" },
    ],
    summary:
      "A deep half-zip in recycled polar fleece with a bound collar that stands without a wire.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% recycled polyester fleece, 300 gsm", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Relaxed, hip length" },
          { term: "Model", value: "1.72 m, wearing M" },
          { term: "Length", value: "66 cm at centre back, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["kite-parachute-pant", "ridge-baggy-denim", "volta-graphic-tee"],
  },
  {
    slug: "kite-parachute-pant",
    subcategory: "trousers",
    name: "Kite Parachute Pant",
    line: "Teen Studio",
    category: "teen",
    price: 195,
    colour: "Ash Olive",
    fabric: "Nylon taffeta",
    fit: "Oversized",
    sizes: allSizes(["XS", "M", "L"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "/images/products/kite-parachute-pant.jpg" },
      { label: "Cinched", ratio: "3:4", image: "/images/products/kite-parachute-pant.jpg" },
      { label: "Toggle", ratio: "1:1", image: "/images/products/kite-parachute-pant.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/kite-parachute-pant.jpg" },
    ],
    summary:
      "A parachute pant in light taffeta with cord channels at the knee and hem, so the volume can be pulled in or left to fall.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% recycled nylon taffeta", "Turkey") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Oversized, adjustable at knee and hem" },
          { term: "Model", value: "1.70 m, wearing S" },
          { term: "Inseam", value: "78 cm, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["onda-fleece-half-zip", "volta-graphic-tee", "nyx-cropped-windbreaker"],
  },
  {
    slug: "static-boxy-sweat",
    subcategory: "sweats",
    name: "Static Boxy Sweat",
    line: "Teen Studio",
    category: "teen",
    price: 145,
    colour: "Bone",
    fabric: "Brushed cotton fleece",
    fit: "Oversized",
    sizes: allSizes(["XS", "S", "M", "L", "XL"], APPAREL),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "/images/products/static-boxy-sweat.jpg" },
      { label: "Back", ratio: "4:5", image: "/images/products/static-boxy-sweat.jpg" },
      { label: "Rib", ratio: "1:1", image: "/images/products/static-boxy-sweat.jpg" },
      { label: "Fabric", ratio: "1:1", image: "/images/products/static-boxy-sweat.jpg" },
    ],
    summary:
      "A square crew sweat with set-in sleeves and a wide rib at the hem that stops the body from riding up.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% organic cotton fleece, 400 gsm", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Boxy, wide rib hem" },
          { term: "Model", value: "1.72 m, wearing S" },
          { term: "Length", value: "62 cm at centre back, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["ridge-baggy-denim", "kite-parachute-pant", "onda-fleece-half-zip"],
  },
  {
    slug: "dune-corduroy-shacket",
    subcategory: "outerwear",
    name: "Dune Corduroy Shacket",
    line: "Teen Studio",
    category: "teen",
    price: 240,
    colour: "Oat",
    fabric: "Wide-wale corduroy",
    fit: "Relaxed",
    sizes: allSizes(["S", "M", "L"], APPAREL),
    ratio: "3:4",
    gallery: [
      { label: "Front", ratio: "3:4", image: "/images/products/dune-corduroy-shacket.jpg" },
      { label: "Open", ratio: "3:4", image: "/images/products/dune-corduroy-shacket.jpg" },
      { label: "Wale", ratio: "1:1", image: "/images/products/dune-corduroy-shacket.jpg" },
      { label: "Lining", ratio: "1:1", image: "/images/products/dune-corduroy-shacket.jpg" },
    ],
    summary:
      "An unlined shacket in eight-wale corduroy with a flannel-backed yoke and horn-look buttons.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% cotton corduroy, 8 wale", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Relaxed, squared hem" },
          { term: "Model", value: "1.72 m, wearing M" },
          { term: "Length", value: "72 cm at centre back, size M" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["ridge-baggy-denim", "static-boxy-sweat", "volta-graphic-tee"],
  },
  {
    slug: "pilot-mesh-layer",
    subcategory: "tops",
    name: "Pilot Mesh Layer",
    line: "Teen Studio",
    category: "teen",
    price: 95,
    colour: "Smoke",
    fabric: "Open cotton mesh",
    fit: "Relaxed",
    sizes: allSizes(["XS", "S", "L", "XL"], APPAREL),
    ratio: "4:5",
    gallery: [
      { label: "Front", ratio: "4:5", image: "/images/products/pilot-mesh-layer.jpg" },
      { label: "Detail", ratio: "4:5", image: "/images/products/pilot-mesh-layer.jpg" },
      { label: "Mesh", ratio: "1:1", image: "/images/products/pilot-mesh-layer.jpg" },
      { label: "Hem", ratio: "1:1", image: "/images/products/pilot-mesh-layer.jpg" },
    ],
    summary:
      "A long-sleeved open mesh worn as a layer under jersey. Knitted flat so the openings keep their grid.",
    specs: [
      { id: "materials", title: "Materials and care", rows: careRows("100% cotton open mesh", "Portugal") },
      {
        id: "fit",
        title: "Fit and measurements",
        rows: [
          { term: "Fit", value: "Relaxed, long sleeve" },
          { term: "Model", value: "1.70 m, wearing S" },
          { term: "Length", value: "64 cm at centre back, size S" },
        ],
      },
      {
        id: "delivery",
        title: "Delivery and returns",
        rows: [
          { term: "Standard", value: "3 to 5 working days" },
          { term: "Express", value: "Next working day, ordered before 14:00" },
          { term: "Returns", value: "30 days, collection booked from your address" },
        ],
      },
    ],
    pairsWith: ["volta-graphic-tee", "kite-parachute-pant", "nyx-cropped-windbreaker"],
  },
];

export const FEATURED_DROP_SLUGS: ReadonlyArray<string> = [
  "anvers-cropped-bomber",
  "halden-utility-overshirt",
  "petra-denim-column-skirt",
  "nyx-cropped-windbreaker",
];

const BY_SLUG = new Map(PRODUCTS.map((product) => [product.slug, product]));

export function getProduct(slug: string): Product | undefined {
  return BY_SLUG.get(slug);
}

export function getProducts(slugs: ReadonlyArray<string>): Product[] {
  return slugs.map((slug) => BY_SLUG.get(slug)).filter((p): p is Product => Boolean(p));
}

export function getCategory(slug: string): Category | undefined {
  if (slug === "kids") return CATEGORIES.find((category) => category.slug === "teen");
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: CategorySlug | "kids"): Product[] {
  const target = slug === "kids" ? "teen" : slug;
  return PRODUCTS.filter((product) => product.category === target);
}

export function isCategorySlug(value: string): value is CategorySlug {
  if (value === "kids") return true;
  return CATEGORIES.some((category) => category.slug === value);
}

