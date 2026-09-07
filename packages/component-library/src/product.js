// Product listing / detail component variants harvested from reference projects.
// Populated by an authoring pass — see README.md for the sourcing process.
import { LIBRARY_SCHEMA_VERSION } from "./schema.js";

const b2bProducts = [
  {
    id: "sc-2201",
    sku: "SC-2201",
    name: "Precision Forceps",
    description:
      "Fine-tip stainless forceps engineered for controlled, repeatable grip in delicate procedures.",
    category: "Grasping Instruments",
    status: "In Stock",
    variant: "catalog",
    specs: [
      { label: "Material", value: "Surgical Stainless" },
      { label: "Length", value: "14 cm" },
    ],
  },
  {
    id: "sc-3110",
    sku: "SC-3110",
    name: "Articulating Retractor Set",
    description:
      "A modular retractor system built for consistent field exposure across a wide range of procedures.",
    category: "Retraction Systems",
    status: "Limited Stock",
    variant: "featured",
    specs: [
      { label: "Material", value: "Titanium Alloy" },
      { label: "Pieces", value: "6" },
    ],
  },
  {
    id: "sc-1075",
    sku: "SC-1075",
    name: "Needle Holder, Curved",
    description: "Curved-jaw needle holder with a tungsten-carbide insert for extended edge life.",
    category: "Suturing",
    status: "In Stock",
    variant: "related",
    specs: [
      { label: "Material", value: "Tungsten Carbide" },
      { label: "Length", value: "18 cm" },
    ],
  },
  {
    id: "sc-4402",
    sku: "SC-4402",
    name: "Bone Rongeur, Double Action",
    description: "Double-action jaw geometry for high-leverage, low-fatigue bone and tissue removal.",
    category: "Rongeurs",
    status: "In Stock",
    variant: "catalog",
    specs: [
      { label: "Material", value: "Surgical Stainless" },
      { label: "Jaw Width", value: "5 mm" },
    ],
  },
];

const retailProducts = [
  {
    id: "p-01",
    name: "Everyday Crewneck Tee",
    category: "Tops",
    price: "$28.00",
    compareAtPrice: null,
    priceRange: null,
    badge: null,
    rating: 4.5,
    reviewCount: 132,
  },
  {
    id: "p-02",
    name: "Lightweight Trail Jacket",
    category: "Outerwear",
    price: "$79.00",
    compareAtPrice: "$110.00",
    priceRange: null,
    badge: "sale",
    rating: 4.8,
    reviewCount: 64,
  },
  {
    id: "p-03",
    name: "Performance Jogger",
    category: "Bottoms",
    price: null,
    compareAtPrice: null,
    priceRange: ["$45.00", "$58.00"],
    badge: null,
    rating: 4.2,
    reviewCount: 41,
  },
  {
    id: "p-04",
    name: "Insulated Trail Boot",
    category: "Footwear",
    price: "$96.00",
    compareAtPrice: null,
    priceRange: null,
    badge: "out-of-stock",
    rating: 4.6,
    reviewCount: 89,
  },
];

const filterableFilters = [
  {
    id: "category",
    label: "Category",
    type: "checkbox",
    options: [
      { value: "shirts", label: "Shirts" },
      { value: "trousers", label: "Trousers" },
      { value: "accessories", label: "Accessories" },
    ],
  },
  {
    id: "material",
    label: "Material",
    type: "checkbox",
    options: [
      { value: "cotton", label: "Cotton" },
      { value: "linen", label: "Linen" },
      { value: "wool", label: "Wool" },
    ],
  },
  {
    id: "availability",
    label: "Availability",
    type: "select",
    options: [
      { value: "", label: "Any availability" },
      { value: "in-stock", label: "In stock" },
      { value: "backorder", label: "Backorder" },
    ],
  },
];

const filterableProducts = [
  { id: "1", name: "Classic Oxford Shirt", price: "$42.00", category: "shirts", material: "cotton", availability: "in-stock" },
  { id: "2", name: "Tailored Wool Trouser", price: "$68.00", category: "trousers", material: "wool", availability: "in-stock" },
  { id: "3", name: "Linen Weekend Shirt", price: "$54.00", category: "shirts", material: "linen", availability: "backorder" },
  { id: "4", name: "Woven Leather Belt", price: "$36.00", category: "accessories", material: "cotton", availability: "in-stock" },
  { id: "5", name: "Chino Trouser", price: "$49.00", category: "trousers", material: "cotton", availability: "in-stock" },
  { id: "6", name: "Wool Blend Scarf", price: "$29.00", category: "accessories", material: "wool", availability: "backorder" },
];

const detailProduct = {
  id: "gr-100",
  breadcrumb: ["Home", "Grips"],
  name: "Contour Training Grip",
  price: "$34.00",
  compareAtPrice: "$44.00",
  rating: 4.7,
  reviewCount: 218,
  description: "A textured training grip shaped to reduce slip and hand fatigue during extended sessions.",
  overview:
    "Designed around a low-profile contour, this grip distributes pressure evenly across the palm so long sets stay comfortable without sacrificing control.",
  images: ["Front", "Side", "Detail", "In Use"],
  sizes: ["S", "M", "L", "XL"],
  specs: [
    { label: "Material", value: "Textured Composite" },
    { label: "Weight", value: "38 g" },
    { label: "Fit", value: "Unisex" },
    { label: "Care", value: "Wipe clean" },
  ],
  moreOptions: [
    { id: "gr-101", name: "Contour Grip — Pro", price: "$44.00" },
    { id: "gr-102", name: "Contour Grip — Mini", price: "$26.00" },
    { id: "gr-103", name: "Grip Chalk Alternative", price: "$14.00" },
  ],
};

const showcaseCategories = [
  {
    id: "outerwear",
    name: "Outerwear",
    description: "Weather-ready layers built for daily wear and long commutes.",
    ctaLabel: "View full collection",
    accent: "violet",
    products: [
      { id: "o-1", name: "Insulated Field Coat", price: "$128.00" },
      { id: "o-2", name: "Packable Windbreaker", price: "$64.00" },
      { id: "o-3", name: "Shearling-Lined Vest", price: "$96.00" },
    ],
  },
  {
    id: "footwear",
    name: "Footwear",
    description: "Everyday shoes engineered for support without the bulk.",
    ctaLabel: "View full collection",
    accent: "amber",
    products: [
      { id: "f-1", name: "Trail Runner", price: "$89.00" },
      { id: "f-2", name: "Canvas Low-Top", price: "$58.00" },
      { id: "f-3", name: "All-Weather Boot", price: "$112.00" },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Small details that finish an outfit and last for years.",
    ctaLabel: "View full collection",
    accent: "teal",
    products: [
      { id: "a-1", name: "Waxed Canvas Belt", price: "$32.00" },
      { id: "a-2", name: "Wool Beanie", price: "$24.00" },
      { id: "a-3", name: "Leather Card Holder", price: "$28.00" },
    ],
  },
];

const comparisonAttributes = ["Material", "Length", "Weight", "Sterilization", "Warranty"];

const comparisonProducts = [
  {
    id: "standard",
    name: "Standard Series",
    price: "$89.00",
    highlight: false,
    values: ["Surgical Stainless", "14 cm", "62 g", "Autoclavable", "1 year"],
  },
  {
    id: "pro",
    name: "Pro Series",
    price: "$129.00",
    highlight: true,
    values: ["Titanium Alloy", "16 cm", "48 g", "Autoclavable", "3 years"],
  },
  {
    id: "compact",
    name: "Compact Series",
    price: "$74.00",
    highlight: false,
    values: ["Surgical Stainless", "11 cm", "40 g", "Autoclavable", "1 year"],
  },
];

export const productComponents = [
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "product.catalog-grid-b2b",
    name: "B2B Catalog Card Grid",
    category: "product",
    description:
      "Multi-variant B2B product card grid (catalog, featured, and related layouts) with inline spec tables and quote-request actions instead of prices.",
    tags: ["product", "catalog", "b2b", "card", "quote"],
    sourceProject: "aqsurgical",
    exportName: "ProductCatalogGrid",
    fileName: "ProductCatalogGrid.jsx",
    dependencies: [],
    defaultProps: {
      eyebrow: "Instrument Catalog",
      heading: "Precision instruments, ready to quote",
      products: b2bProducts,
    },
    accessibility: [
      "Every quote-request button includes the product name in its accessible label so screen reader users can distinguish repeated \"Add to Quote\" controls.",
      "The catalog grid is marked up as a semantic list (role=\"list\" with <li> items) so assistive tech announces the number of items.",
    ],
    source: `const defaultProducts = [
  {
    id: "sc-2201",
    sku: "SC-2201",
    name: "Precision Forceps",
    description:
      "Fine-tip stainless forceps engineered for controlled, repeatable grip in delicate procedures.",
    category: "Grasping Instruments",
    status: "In Stock",
    variant: "catalog",
    specs: [
      { label: "Material", value: "Surgical Stainless" },
      { label: "Length", value: "14 cm" },
    ],
  },
  {
    id: "sc-3110",
    sku: "SC-3110",
    name: "Articulating Retractor Set",
    description:
      "A modular retractor system built for consistent field exposure across a wide range of procedures.",
    category: "Retraction Systems",
    status: "Limited Stock",
    variant: "featured",
    specs: [
      { label: "Material", value: "Titanium Alloy" },
      { label: "Pieces", value: "6" },
    ],
  },
  {
    id: "sc-1075",
    sku: "SC-1075",
    name: "Needle Holder, Curved",
    description: "Curved-jaw needle holder with a tungsten-carbide insert for extended edge life.",
    category: "Suturing",
    status: "In Stock",
    variant: "related",
    specs: [
      { label: "Material", value: "Tungsten Carbide" },
      { label: "Length", value: "18 cm" },
    ],
  },
  {
    id: "sc-4402",
    sku: "SC-4402",
    name: "Bone Rongeur, Double Action",
    description: "Double-action jaw geometry for high-leverage, low-fatigue bone and tissue removal.",
    category: "Rongeurs",
    status: "In Stock",
    variant: "catalog",
    specs: [
      { label: "Material", value: "Surgical Stainless" },
      { label: "Jaw Width", value: "5 mm" },
    ],
  },
];

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function CatalogCard({ product }) {
  const { id, name, sku, description, category, status, variant, specs } = product;
  const initials = name.slice(0, 2).toUpperCase();

  if (variant === "related") {
    return (
      <li className="card card-related">
        <div className="thumb thumb-small" aria-hidden="true">
          <span>{initials}</span>
        </div>
        <div className="body">
          <p className="sku">{sku}</p>
          <h3 className="name">{name}</h3>
        </div>
        <button type="button" className="add-fab" aria-label={"Add " + name + " to quote"}>
          <PlusIcon />
        </button>
      </li>
    );
  }

  if (variant === "featured") {
    return (
      <li className="card card-featured">
        <div className="thumb thumb-tall" aria-hidden="true">
          <span className="tag">{category}</span>
          <span>{initials}</span>
        </div>
        <div className="body">
          <p className="sku">{sku}</p>
          <h3 className="name">{name}</h3>
          <p className="desc">{description}</p>
          <a className="specs-link" href={"#" + id}>
            View specs →
          </a>
        </div>
      </li>
    );
  }

  return (
    <li className="card">
      <div className="thumb" aria-hidden="true">
        <span className="status">{status}</span>
        <span>{initials}</span>
      </div>
      <div className="body">
        <p className="sku">{sku}</p>
        <h3 className="name">{name}</h3>
        <p className="desc">{description}</p>
        <dl className="specs">
          {specs.map((spec) => (
            <div className="spec-row" key={spec.label}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
        <div className="actions">
          <button type="button" className="btn" aria-label={"Add " + name + " to quote"}>
            Add to Quote
          </button>
          <a className="btn btn-outline" href={"#" + id}>
            View Specs
          </a>
        </div>
      </div>
    </li>
  );
}

export function ProductCatalogGrid({
  eyebrow = "Instrument Catalog",
  heading = "Precision instruments, ready to quote",
  products = defaultProducts,
}) {
  return (
    <section className="ofl-product-catalog-grid-b2b" aria-labelledby="b2b-catalog-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="heading" id="b2b-catalog-heading">
        {heading}
      </h2>
      <ul className="grid" role="list">
        {products.map((product) => (
          <CatalogCard product={product} key={product.id} />
        ))}
      </ul>
    </section>
  );
}
`,
    styles: `.ofl-product-catalog-grid-b2b {
  background: #0b1220;
  color: #e7ecf5;
  font-family: "Segoe UI", Arial, sans-serif;
  padding: 3.5rem clamp(1.25rem, 4vw, 3rem);
}
.ofl-product-catalog-grid-b2b .eyebrow {
  color: #5fa8ff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin: 0;
}
.ofl-product-catalog-grid-b2b .heading {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  margin: 0.5rem 0 2rem;
  max-width: 34ch;
}
.ofl-product-catalog-grid-b2b .grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}
.ofl-product-catalog-grid-b2b .card {
  background: #121b2e;
  border: 1px solid #223052;
  border-radius: 0.85rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.ofl-product-catalog-grid-b2b .card:hover {
  border-color: #3a6fd8;
  box-shadow: 0 14px 30px -12px rgba(58, 111, 216, 0.55);
  transform: translateY(-4px);
}
.ofl-product-catalog-grid-b2b .thumb {
  align-items: center;
  background: linear-gradient(135deg, #16213c, #1c2b4d);
  color: #4c6ba8;
  display: flex;
  font-size: 1.8rem;
  font-weight: 800;
  height: 9rem;
  justify-content: center;
  position: relative;
}
.ofl-product-catalog-grid-b2b .thumb-tall { height: 11rem; }
.ofl-product-catalog-grid-b2b .thumb-small { height: 4.5rem; width: 4.5rem; border-radius: 0.6rem; font-size: 1rem; flex-shrink: 0; }
.ofl-product-catalog-grid-b2b .status {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  background: rgba(95, 168, 255, 0.15);
  border: 1px solid rgba(95, 168, 255, 0.4);
  border-radius: 999px;
  color: #9cc4ff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  text-transform: uppercase;
}
.ofl-product-catalog-grid-b2b .tag {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
}
.ofl-product-catalog-grid-b2b .body { padding: 1.1rem 1.2rem 1.3rem; display: flex; flex-direction: column; flex: 1; }
.ofl-product-catalog-grid-b2b .sku { color: #6f83ab; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; margin: 0 0 0.3rem; text-transform: uppercase; }
.ofl-product-catalog-grid-b2b .name { font-size: 1.05rem; margin: 0 0 0.5rem; }
.ofl-product-catalog-grid-b2b .desc { color: #a9b6d1; font-size: 0.88rem; line-height: 1.55; margin: 0 0 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.ofl-product-catalog-grid-b2b .specs { border-top: 1px solid #223052; margin: 0 0 1rem; padding-top: 0.6rem; }
.ofl-product-catalog-grid-b2b .spec-row { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 0.25rem 0; }
.ofl-product-catalog-grid-b2b .spec-row dt { color: #7e8fb5; margin: 0; }
.ofl-product-catalog-grid-b2b .spec-row dd { color: #dbe4f5; font-weight: 600; margin: 0; }
.ofl-product-catalog-grid-b2b .actions { display: flex; gap: 0.6rem; margin-top: auto; }
.ofl-product-catalog-grid-b2b .btn { background: #3a6fd8; border: 1px solid #3a6fd8; border-radius: 0.5rem; color: white; cursor: pointer; flex: 1; font-size: 0.82rem; font-weight: 700; padding: 0.55rem 0.7rem; text-align: center; text-decoration: none; }
.ofl-product-catalog-grid-b2b .btn-outline { background: transparent; color: #9cc4ff; }
.ofl-product-catalog-grid-b2b .specs-link { color: #9cc4ff; font-size: 0.85rem; font-weight: 700; text-decoration: none; }
.ofl-product-catalog-grid-b2b .card-related { flex-direction: row; align-items: center; padding: 0.75rem; gap: 0.75rem; position: relative; }
.ofl-product-catalog-grid-b2b .card-related .body { padding: 0; }
.ofl-product-catalog-grid-b2b .add-fab { position: absolute; top: 0.5rem; right: 0.5rem; width: 1.75rem; height: 1.75rem; border-radius: 999px; background: #3a6fd8; color: white; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
@media (max-width: 640px) {
  .ofl-product-catalog-grid-b2b .grid { grid-template-columns: 1fr; }
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "product.retail-card-grid",
    name: "Retail Product Grid",
    category: "product",
    description:
      "Retail product grid with sale/out-of-stock badges, price-range and strikethrough pricing, star ratings, and a hover quick-view overlay.",
    tags: ["product", "retail", "card", "ecommerce", "sale"],
    sourceProject: "bandg",
    exportName: "RetailProductGrid",
    fileName: "RetailProductGrid.jsx",
    dependencies: [],
    defaultProps: {
      heading: "New arrivals this week",
      products: retailProducts,
    },
    accessibility: [
      "Star ratings are paired with a visually hidden text summary (e.g. \"4.5 out of 5 stars, 132 reviews\") since the rating itself is drawn with decorative SVG icons.",
      "The add-to-cart button reflects out-of-stock state with the native disabled attribute and aria-disabled, not color alone.",
    ],
    source: `const defaultProducts = [
  {
    id: "p-01",
    name: "Everyday Crewneck Tee",
    category: "Tops",
    price: "$28.00",
    compareAtPrice: null,
    priceRange: null,
    badge: null,
    rating: 4.5,
    reviewCount: 132,
  },
  {
    id: "p-02",
    name: "Lightweight Trail Jacket",
    category: "Outerwear",
    price: "$79.00",
    compareAtPrice: "$110.00",
    priceRange: null,
    badge: "sale",
    rating: 4.8,
    reviewCount: 64,
  },
  {
    id: "p-03",
    name: "Performance Jogger",
    category: "Bottoms",
    price: null,
    compareAtPrice: null,
    priceRange: ["$45.00", "$58.00"],
    badge: null,
    rating: 4.2,
    reviewCount: 41,
  },
  {
    id: "p-04",
    name: "Insulated Trail Boot",
    category: "Footwear",
    price: "$96.00",
    compareAtPrice: null,
    priceRange: null,
    badge: "out-of-stock",
    rating: 4.6,
    reviewCount: 89,
  },
];

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M10 1.6l2.47 5.24 5.76.68-4.28 4 1.15 5.7L10 14.9l-5.1 2.32 1.15-5.7-4.28-4 5.76-.68z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="20" r="1.3" fill="currentColor" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function RetailCard({ product }) {
  const { name, category, price, compareAtPrice, priceRange, badge, rating, reviewCount } = product;
  const outOfStock = badge === "out-of-stock";
  const roundedRating = Math.round(rating);

  return (
    <li className="card">
      <div className="frame">
        {badge === "sale" ? <span className="badge badge-sale">Sale</span> : null}
        {outOfStock ? <span className="badge badge-stock">Out of stock</span> : null}
        <div className="placeholder" aria-hidden="true">
          <span>{name.slice(0, 1)}</span>
        </div>
        <div className="quick-view">
          <button type="button" className="quick-view-btn" aria-label={"Quick view " + name}>
            <EyeIcon />
            See Details
          </button>
        </div>
      </div>
      <div className="info">
        <p className="category">{category}</p>
        <h3 className="name">{name}</h3>
        <div className="rating" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((index) => (
            <StarIcon filled={index < roundedRating} key={index} />
          ))}
        </div>
        <span className="review-count" aria-hidden="true">({reviewCount})</span>
        <p className="visually-hidden">
          {rating} out of 5 stars, {reviewCount} reviews
        </p>
        <div className="price-row">
          {compareAtPrice ? (
            <>
              <span className="price price-sale">{price}</span>
              <span className="price price-compare">{compareAtPrice}</span>
            </>
          ) : priceRange ? (
            <span className="price">
              {priceRange[0]} – {priceRange[1]}
            </span>
          ) : (
            <span className="price">{price}</span>
          )}
        </div>
      </div>
      <button
        type="button"
        className="cart-btn"
        disabled={outOfStock}
        aria-disabled={outOfStock}
        aria-label={(outOfStock ? "Out of stock: " : "Add ") + name + (outOfStock ? "" : " to cart")}
      >
        <CartIcon />
      </button>
    </li>
  );
}

export function RetailProductGrid({ heading = "New arrivals this week", products = defaultProducts }) {
  return (
    <section className="ofl-product-retail-card-grid" aria-labelledby="retail-grid-heading">
      <h2 className="heading" id="retail-grid-heading">
        {heading}
      </h2>
      <ul className="grid" role="list">
        {products.map((product) => (
          <RetailCard product={product} key={product.id} />
        ))}
      </ul>
    </section>
  );
}
`,
    styles: `.ofl-product-retail-card-grid {
  background: #fbf8f4;
  color: #201b16;
  font-family: Georgia, "Times New Roman", serif;
  padding: 3.5rem clamp(1.25rem, 4vw, 3rem);
}
.ofl-product-retail-card-grid .heading {
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  margin: 0 0 2rem;
  font-weight: 400;
}
.ofl-product-retail-card-grid .grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fill, minmax(14.5rem, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}
.ofl-product-retail-card-grid .card { position: relative; }
.ofl-product-retail-card-grid .frame {
  background: #f1ece3;
  border-radius: 1.1rem;
  overflow: hidden;
  position: relative;
  aspect-ratio: 1 / 1;
}
.ofl-product-retail-card-grid .placeholder {
  align-items: center;
  color: #c9bfae;
  display: flex;
  font-size: 3rem;
  font-weight: 700;
  height: 100%;
  justify-content: center;
  transition: transform 0.35s ease;
}
.ofl-product-retail-card-grid .card:hover .placeholder { transform: scale(1.06); }
.ofl-product-retail-card-grid .badge {
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  left: 0.7rem;
  padding: 0.25rem 0.65rem;
  position: absolute;
  top: 0.7rem;
  text-transform: uppercase;
  z-index: 2;
}
.ofl-product-retail-card-grid .badge-sale { background: #b3452f; color: white; }
.ofl-product-retail-card-grid .badge-stock { background: #201b16; color: white; }
.ofl-product-retail-card-grid .quick-view {
  align-items: flex-end;
  background: linear-gradient(to top, rgba(32, 27, 22, 0.55), transparent 55%);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  opacity: 0;
  padding-bottom: 1rem;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.25s ease;
}
.ofl-product-retail-card-grid .card:hover .quick-view { opacity: 1; }
.ofl-product-retail-card-grid .quick-view-btn {
  align-items: center;
  background: white;
  border: none;
  border-radius: 999px;
  color: #201b16;
  cursor: pointer;
  display: flex;
  font-size: 0.78rem;
  font-weight: 700;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
}
.ofl-product-retail-card-grid .info { padding-top: 0.85rem; }
.ofl-product-retail-card-grid .category { color: #8a8072; font-size: 0.72rem; letter-spacing: 0.08em; margin: 0 0 0.25rem; text-transform: uppercase; }
.ofl-product-retail-card-grid .name { font-size: 1rem; font-weight: 600; margin: 0 0 0.4rem; }
.ofl-product-retail-card-grid .rating { color: #b3452f; display: inline-flex; gap: 0.1rem; vertical-align: middle; }
.ofl-product-retail-card-grid .review-count { color: #8a8072; display: inline-block; font-size: 0.78rem; margin: 0 0 0.4rem 0.35rem; }
.ofl-product-retail-card-grid .price-row { display: flex; gap: 0.5rem; }
.ofl-product-retail-card-grid .price { font-size: 0.98rem; font-weight: 700; }
.ofl-product-retail-card-grid .price-compare { color: #8a8072; font-weight: 400; text-decoration: line-through; }
.ofl-product-retail-card-grid .price-sale { color: #b3452f; }
.ofl-product-retail-card-grid .cart-btn {
  align-items: center;
  background: #201b16;
  border: none;
  border-radius: 999px;
  bottom: 6.2rem;
  color: white;
  cursor: pointer;
  display: flex;
  height: 2.2rem;
  justify-content: center;
  position: absolute;
  right: 0.6rem;
  width: 2.2rem;
}
.ofl-product-retail-card-grid .cart-btn[disabled] { background: #c9bfae; cursor: not-allowed; }
.ofl-product-retail-card-grid .visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
@media (max-width: 640px) {
  .ofl-product-retail-card-grid .grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "product.catalog-filterable",
    name: "Filterable Product Catalog",
    category: "product",
    description:
      "Filterable product catalog with a sticky sidebar of checkbox and select filters, live sort controls, and an empty state.",
    tags: ["product", "catalog", "filters", "grid", "sort"],
    sourceProject: "allahrakhaandco",
    exportName: "FilterableCatalog",
    fileName: "FilterableCatalog.jsx",
    dependencies: [],
    defaultProps: {
      heading: "Shop the collection",
      filters: filterableFilters,
      products: filterableProducts,
    },
    accessibility: [
      "Checkbox filters are grouped inside a <fieldset> with a <legend> naming the filter category.",
      "The result count updates inside an aria-live=\"polite\" region so filter and sort changes are announced to screen reader users.",
    ],
    source: `import { useMemo, useState } from "react";

const defaultFilters = [
  {
    id: "category",
    label: "Category",
    type: "checkbox",
    options: [
      { value: "shirts", label: "Shirts" },
      { value: "trousers", label: "Trousers" },
      { value: "accessories", label: "Accessories" },
    ],
  },
  {
    id: "material",
    label: "Material",
    type: "checkbox",
    options: [
      { value: "cotton", label: "Cotton" },
      { value: "linen", label: "Linen" },
      { value: "wool", label: "Wool" },
    ],
  },
  {
    id: "availability",
    label: "Availability",
    type: "select",
    options: [
      { value: "", label: "Any availability" },
      { value: "in-stock", label: "In stock" },
      { value: "backorder", label: "Backorder" },
    ],
  },
];

const defaultProducts = [
  { id: "1", name: "Classic Oxford Shirt", price: "$42.00", category: "shirts", material: "cotton", availability: "in-stock" },
  { id: "2", name: "Tailored Wool Trouser", price: "$68.00", category: "trousers", material: "wool", availability: "in-stock" },
  { id: "3", name: "Linen Weekend Shirt", price: "$54.00", category: "shirts", material: "linen", availability: "backorder" },
  { id: "4", name: "Woven Leather Belt", price: "$36.00", category: "accessories", material: "cotton", availability: "in-stock" },
  { id: "5", name: "Chino Trouser", price: "$49.00", category: "trousers", material: "cotton", availability: "in-stock" },
  { id: "6", name: "Wool Blend Scarf", price: "$29.00", category: "accessories", material: "wool", availability: "backorder" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

function priceToNumber(price) {
  return parseFloat(price.replace(/[^0-9.]/g, ""));
}

export function FilterableCatalog({
  heading = "Shop the collection",
  filters = defaultFilters,
  products = defaultProducts,
}) {
  const [checked, setChecked] = useState({});
  const [selects, setSelects] = useState({});
  const [sort, setSort] = useState("featured");

  const activeCount =
    Object.values(checked).reduce((total, set) => total + (set ? set.size : 0), 0) +
    Object.values(selects).filter(Boolean).length;

  function toggleCheckbox(filterId, value) {
    setChecked((previous) => {
      const next = { ...previous };
      const set = new Set(next[filterId] || []);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      next[filterId] = set;
      return next;
    });
  }

  function updateSelect(filterId, value) {
    setSelects((previous) => ({ ...previous, [filterId]: value }));
  }

  function clearAll() {
    setChecked({});
    setSelects({});
  }

  const visible = useMemo(() => {
    const filtered = products.filter((product) =>
      filters.every((filter) => {
        if (filter.type === "checkbox") {
          const set = checked[filter.id];
          if (!set || set.size === 0) return true;
          return set.has(product[filter.id]);
        }
        const value = selects[filter.id];
        if (!value) return true;
        return product[filter.id] === value;
      }),
    );

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
    if (sort === "price-desc") sorted.sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [checked, selects, sort, products, filters]);

  return (
    <section className="ofl-product-catalog-filterable" aria-labelledby="filterable-heading">
      <h2 className="heading" id="filterable-heading">
        {heading}
      </h2>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-head">
            <h3>Filters</h3>
            <button type="button" className="clear-btn" onClick={clearAll}>
              Clear all ({activeCount})
            </button>
          </div>
          {filters.map((filter) =>
            filter.type === "checkbox" ? (
              <fieldset className="filter-group" key={filter.id}>
                <legend>{filter.label}</legend>
                {filter.options.map((option) => (
                  <label className="checkbox-row" key={option.value}>
                    <input
                      type="checkbox"
                      checked={Boolean(checked[filter.id] && checked[filter.id].has(option.value))}
                      onChange={() => toggleCheckbox(filter.id, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </fieldset>
            ) : (
              <div className="filter-group" key={filter.id}>
                <label htmlFor={"filter-" + filter.id}>{filter.label}</label>
                <select
                  id={"filter-" + filter.id}
                  value={selects[filter.id] || ""}
                  onChange={(event) => updateSelect(filter.id, event.target.value)}
                >
                  {filter.options.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ),
          )}
        </aside>
        <div className="main">
          <div className="controls">
            <p aria-live="polite" className="count">
              Showing {visible.length} products
            </p>
            <label className="sort-label">
              Sort by
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                {sortOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {visible.length === 0 ? (
            <div className="empty">
              <span aria-hidden="true" className="empty-icon">
                ◎
              </span>
              <h3>No products match your filters</h3>
              <button type="button" className="clear-btn" onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          ) : (
            <ul className="grid" role="list">
              {visible.map((product) => (
                <li className="card" key={product.id}>
                  <div className="thumb" aria-hidden="true">
                    {product.name.slice(0, 1)}
                  </div>
                  <p className="category">{product.category}</p>
                  <h3 className="name">{product.name}</h3>
                  <p className="price">{product.price}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
`,
    styles: `.ofl-product-catalog-filterable {
  background: #ffffff;
  color: #1c1c1c;
  font-family: Arial, sans-serif;
  padding: 3rem clamp(1.25rem, 4vw, 3rem);
}
.ofl-product-catalog-filterable .heading { font-size: clamp(1.5rem, 3vw, 2.1rem); margin: 0 0 2rem; }
.ofl-product-catalog-filterable .layout { display: grid; gap: 2.5rem; grid-template-columns: 16rem 1fr; align-items: start; }
.ofl-product-catalog-filterable .sidebar { position: sticky; top: 1.5rem; border: 1px solid #e4e4e4; border-radius: 0.75rem; padding: 1.25rem; }
.ofl-product-catalog-filterable .sidebar-head { align-items: center; display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
.ofl-product-catalog-filterable .sidebar-head h3 { font-size: 1rem; margin: 0; }
.ofl-product-catalog-filterable .clear-btn { background: none; border: none; color: #6f6f6f; cursor: pointer; font-size: 0.78rem; padding: 0; text-decoration: underline; }
.ofl-product-catalog-filterable .filter-group { border: none; border-top: 1px solid #eee; margin: 0; padding: 0.9rem 0; }
.ofl-product-catalog-filterable .filter-group:first-of-type { border-top: none; padding-top: 0; }
.ofl-product-catalog-filterable .filter-group legend,
.ofl-product-catalog-filterable .filter-group > label:first-child {
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  padding: 0;
}
.ofl-product-catalog-filterable .checkbox-row { align-items: center; display: flex; font-size: 0.85rem; gap: 0.5rem; padding: 0.3rem 0; }
.ofl-product-catalog-filterable .filter-group select { display: block; margin-top: 0.4rem; padding: 0.4rem; width: 100%; }
.ofl-product-catalog-filterable .controls { align-items: center; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; margin-bottom: 1.25rem; }
.ofl-product-catalog-filterable .count { color: #6f6f6f; font-size: 0.88rem; margin: 0; }
.ofl-product-catalog-filterable .sort-label { align-items: center; display: flex; font-size: 0.85rem; gap: 0.5rem; }
.ofl-product-catalog-filterable .sort-label select { padding: 0.35rem 0.5rem; }
.ofl-product-catalog-filterable .grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr)); list-style: none; margin: 0; padding: 0; }
.ofl-product-catalog-filterable .card { border: 1px solid #ececec; border-radius: 0.6rem; padding: 0.9rem; }
.ofl-product-catalog-filterable .thumb { align-items: center; background: #f4f4f4; border-radius: 0.5rem; color: #b8b8b8; display: flex; font-size: 1.6rem; font-weight: 700; height: 7rem; justify-content: center; margin-bottom: 0.7rem; }
.ofl-product-catalog-filterable .category { color: #8a8a8a; font-size: 0.7rem; margin: 0 0 0.2rem; text-transform: uppercase; }
.ofl-product-catalog-filterable .name { font-size: 0.92rem; margin: 0 0 0.3rem; }
.ofl-product-catalog-filterable .price { font-size: 0.92rem; font-weight: 700; margin: 0; }
.ofl-product-catalog-filterable .empty { border: 1px dashed #ddd; border-radius: 0.75rem; padding: 3rem 1.5rem; text-align: center; }
.ofl-product-catalog-filterable .empty-icon { display: block; font-size: 2.2rem; margin-bottom: 0.75rem; }
.ofl-product-catalog-filterable .empty h3 { margin: 0 0 1rem; }
@media (max-width: 720px) {
  .ofl-product-catalog-filterable .layout { grid-template-columns: 1fr; }
  .ofl-product-catalog-filterable .sidebar { position: static; }
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "product.detail-page",
    name: "Product Detail Page",
    category: "product",
    description:
      "Product detail page layout with a sticky image gallery, size and quantity selectors, a buy action, a horizontal related-options rail, and tabbed overview/specifications content.",
    tags: ["product", "detail", "gallery", "pdp", "tabs"],
    sourceProject: "FitGrips-Frontend",
    exportName: "ProductDetailPage",
    fileName: "ProductDetailPage.jsx",
    dependencies: [],
    defaultProps: {
      product: detailProduct,
    },
    accessibility: [
      "The Overview/Specifications toggle uses proper tab semantics (role=\"tablist\"/\"tab\"/\"tabpanel\" with aria-selected) instead of unlabeled clickable text.",
      "Gallery navigation controls have explicit \"Previous image\"/\"Next image\" accessible labels rather than relying on chevron icon shape alone.",
    ],
    source: `import { useState } from "react";

const defaultProduct = {
  id: "gr-100",
  breadcrumb: ["Home", "Grips"],
  name: "Contour Training Grip",
  price: "$34.00",
  compareAtPrice: "$44.00",
  rating: 4.7,
  reviewCount: 218,
  description: "A textured training grip shaped to reduce slip and hand fatigue during extended sessions.",
  overview:
    "Designed around a low-profile contour, this grip distributes pressure evenly across the palm so long sets stay comfortable without sacrificing control.",
  images: ["Front", "Side", "Detail", "In Use"],
  sizes: ["S", "M", "L", "XL"],
  specs: [
    { label: "Material", value: "Textured Composite" },
    { label: "Weight", value: "38 g" },
    { label: "Fit", value: "Unisex" },
    { label: "Care", value: "Wipe clean" },
  ],
  moreOptions: [
    { id: "gr-101", name: "Contour Grip — Pro", price: "$44.00" },
    { id: "gr-102", name: "Contour Grip — Mini", price: "$26.00" },
    { id: "gr-103", name: "Grip Chalk Alternative", price: "$14.00" },
  ],
};

function ChevronIcon({ direction }) {
  const d = direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7";
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M10 1.6l2.47 5.24 5.76.68-4.28 4 1.15 5.7L10 14.9l-5.1 2.32 1.15-5.7-4.28-4 5.76-.68z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductDetailPage({ product = defaultProduct }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("overview");

  const imageCount = product.images.length;

  function showPrevious() {
    setImageIndex((index) => (index - 1 + imageCount) % imageCount);
  }

  function showNext() {
    setImageIndex((index) => (index + 1) % imageCount);
  }

  const roundedRating = Math.round(product.rating);

  return (
    <section className="ofl-product-detail-page" aria-labelledby="detail-heading">
      <div className="layout">
        <div className="gallery">
          <div className="main-image" aria-hidden="true">
            <span>{product.images[imageIndex]}</span>
            <button type="button" className="nav-btn nav-prev" onClick={showPrevious} aria-label="Previous image">
              <ChevronIcon direction="left" />
            </button>
            <button type="button" className="nav-btn nav-next" onClick={showNext} aria-label="Next image">
              <ChevronIcon direction="right" />
            </button>
          </div>
          <div className="dots" role="tablist" aria-label="Product images">
            {product.images.map((image, index) => (
              <button
                type="button"
                key={image}
                className={index === imageIndex ? "dot dot-active" : "dot"}
                aria-label={"Show image " + (index + 1) + " of " + imageCount}
                aria-current={index === imageIndex}
                onClick={() => setImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="info">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            {product.breadcrumb.join(" / ")}
          </nav>
          <h1 className="name" id="detail-heading">
            {product.name}
          </h1>
          <div className="rating" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((index) => (
              <StarIcon filled={index < roundedRating} key={index} />
            ))}
          </div>
          <span className="review-count" aria-hidden="true">
            {product.reviewCount} reviews
          </span>
          <p className="visually-hidden">
            {product.rating} out of 5 stars from {product.reviewCount} reviews
          </p>
          <div className="price-row">
            <span className="price">{product.price}</span>
            {product.compareAtPrice ? <span className="compare">{product.compareAtPrice}</span> : null}
          </div>
          <p className="description">{product.description}</p>

          <fieldset className="size-select">
            <legend>Size</legend>
            {product.sizes.map((option) => (
              <button
                type="button"
                key={option}
                className={option === size ? "size-pill size-pill-active" : "size-pill"}
                aria-pressed={option === size}
                onClick={() => setSize(option)}
              >
                {option}
              </button>
            ))}
          </fieldset>

          <div className="buy-row">
            <div className="stepper" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span aria-live="polite">{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button type="button" className="buy-btn">
              Buy Now
            </button>
          </div>

          <div className="more-options">
            <p className="more-label">More options</p>
            <div className="more-scroll">
              {product.moreOptions.map((option) => (
                <div className="more-card" key={option.id}>
                  <p className="more-name">{option.name}</p>
                  <p className="more-price">{option.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <div role="tablist" aria-label="Product information" className="tab-list">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "overview"}
            className={tab === "overview" ? "tab tab-active" : "tab"}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "specifications"}
            className={tab === "specifications" ? "tab tab-active" : "tab"}
            onClick={() => setTab("specifications")}
          >
            Specifications
          </button>
        </div>
        {tab === "overview" ? (
          <div role="tabpanel" className="tab-panel">
            <p>{product.overview}</p>
          </div>
        ) : (
          <div role="tabpanel" className="tab-panel">
            <dl className="spec-list">
              {product.specs.map((spec) => (
                <div className="spec-row" key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
`,
    styles: `.ofl-product-detail-page {
  background: #ffffff;
  color: #16181c;
  font-family: "Helvetica Neue", Arial, sans-serif;
  padding: 3rem clamp(1.25rem, 4vw, 3rem) 4rem;
}
.ofl-product-detail-page .layout { display: grid; gap: 2.5rem; grid-template-columns: 2fr 1fr; align-items: start; }
.ofl-product-detail-page .gallery { position: relative; }
.ofl-product-detail-page .main-image {
  align-items: center;
  aspect-ratio: 4 / 3;
  background: linear-gradient(160deg, #f1f3f6, #e2e6ec);
  border-radius: 1rem;
  color: #9aa4b2;
  display: flex;
  font-size: 1.4rem;
  font-weight: 700;
  justify-content: center;
  position: relative;
}
.ofl-product-detail-page .nav-btn {
  align-items: center;
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.6);
  border: none;
  border-radius: 999px;
  color: #16181c;
  cursor: pointer;
  display: flex;
  height: 2.5rem;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
}
.ofl-product-detail-page .nav-prev { left: 0.75rem; }
.ofl-product-detail-page .nav-next { right: 0.75rem; }
.ofl-product-detail-page .dots { display: flex; gap: 0.4rem; justify-content: center; margin-top: 0.9rem; }
.ofl-product-detail-page .dot { background: #d7dbe2; border: none; border-radius: 999px; cursor: pointer; height: 0.45rem; width: 0.45rem; padding: 0; }
.ofl-product-detail-page .dot-active { background: #16181c; width: 1.3rem; }
.ofl-product-detail-page .info { position: sticky; top: 1.25rem; }
.ofl-product-detail-page .breadcrumb { color: #8a93a3; font-size: 0.78rem; margin-bottom: 0.6rem; }
.ofl-product-detail-page .name { font-size: 1.55rem; margin: 0 0 0.5rem; }
.ofl-product-detail-page .rating { color: #d99a1b; display: inline-flex; gap: 0.1rem; vertical-align: middle; }
.ofl-product-detail-page .review-count { color: #8a93a3; font-size: 0.8rem; margin-left: 0.4rem; }
.ofl-product-detail-page .price-row { align-items: baseline; display: flex; gap: 0.6rem; margin: 0.75rem 0; }
.ofl-product-detail-page .price { font-size: 1.5rem; font-weight: 800; }
.ofl-product-detail-page .compare { color: #8a93a3; text-decoration: line-through; }
.ofl-product-detail-page .description { color: #4b5563; line-height: 1.6; margin: 0 0 1.25rem; }
.ofl-product-detail-page .size-select { border: none; margin: 0 0 1.25rem; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
.ofl-product-detail-page .size-select legend { font-size: 0.78rem; font-weight: 700; margin-bottom: 0.5rem; width: 100%; }
.ofl-product-detail-page .size-pill { background: white; border: 1px solid #d7dbe2; border-radius: 999px; cursor: pointer; padding: 0.4rem 0.9rem; }
.ofl-product-detail-page .size-pill-active { background: #16181c; border-color: #16181c; color: white; }
.ofl-product-detail-page .buy-row { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
.ofl-product-detail-page .stepper { align-items: center; border: 1px solid #d7dbe2; border-radius: 999px; display: flex; gap: 0.75rem; padding: 0.4rem 0.9rem; }
.ofl-product-detail-page .stepper button { background: none; border: none; cursor: pointer; font-size: 1.1rem; }
.ofl-product-detail-page .buy-btn { background: #16181c; border: none; border-radius: 999px; color: white; cursor: pointer; flex: 1; font-weight: 700; }
.ofl-product-detail-page .more-label { font-size: 0.82rem; font-weight: 700; margin: 0 0 0.6rem; }
.ofl-product-detail-page .more-scroll { display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.4rem; }
.ofl-product-detail-page .more-card { background: #f4f5f7; border-radius: 0.6rem; flex: 0 0 auto; padding: 0.6rem 0.8rem; min-width: 8rem; }
.ofl-product-detail-page .more-name { font-size: 0.8rem; margin: 0 0 0.2rem; }
.ofl-product-detail-page .more-price { color: #4b5563; font-size: 0.78rem; margin: 0; }
.ofl-product-detail-page .tabs { margin-top: 3rem; max-width: 46rem; }
.ofl-product-detail-page .tab-list { border-bottom: 1px solid #e4e6ea; display: flex; gap: 1.5rem; }
.ofl-product-detail-page .tab { background: none; border: none; cursor: pointer; font-size: 0.92rem; font-weight: 600; padding: 0.75rem 0; position: relative; color: #8a93a3; }
.ofl-product-detail-page .tab-active { color: #16181c; }
.ofl-product-detail-page .tab-active::after { background: #16181c; bottom: -1px; content: ""; height: 2px; left: 0; position: absolute; right: 0; }
.ofl-product-detail-page .tab-panel { color: #4b5563; line-height: 1.65; padding-top: 1.25rem; }
.ofl-product-detail-page .spec-list { margin: 0; }
.ofl-product-detail-page .spec-row { border-top: 1px solid #eef0f2; display: flex; justify-content: space-between; padding: 0.7rem 0; }
.ofl-product-detail-page .spec-row dt { color: #8a93a3; margin: 0; }
.ofl-product-detail-page .spec-row dd { font-weight: 600; margin: 0; }
.ofl-product-detail-page .visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
@media (max-width: 800px) {
  .ofl-product-detail-page .layout { grid-template-columns: 1fr; }
  .ofl-product-detail-page .info { position: static; }
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "product.category-showcase",
    name: "Category Showcase Bands",
    category: "product",
    description:
      "Category showcase made of stacked full-width gradient banners, each followed by a preview grid of that category's products.",
    tags: ["product", "category", "showcase", "banner", "grid"],
    sourceProject: "allahrakhaandco",
    exportName: "CategoryShowcase",
    fileName: "CategoryShowcase.jsx",
    dependencies: [],
    defaultProps: {
      categories: showcaseCategories,
    },
    accessibility: [
      "Decorative gradient circles on each banner are marked aria-hidden so they are not announced as content.",
      "Each category call-to-action includes the category name in its accessible label to disambiguate repeated \"View full collection\" links.",
    ],
    source: `const defaultCategories = [
  {
    id: "outerwear",
    name: "Outerwear",
    description: "Weather-ready layers built for daily wear and long commutes.",
    ctaLabel: "View full collection",
    accent: "violet",
    products: [
      { id: "o-1", name: "Insulated Field Coat", price: "$128.00" },
      { id: "o-2", name: "Packable Windbreaker", price: "$64.00" },
      { id: "o-3", name: "Shearling-Lined Vest", price: "$96.00" },
    ],
  },
  {
    id: "footwear",
    name: "Footwear",
    description: "Everyday shoes engineered for support without the bulk.",
    ctaLabel: "View full collection",
    accent: "amber",
    products: [
      { id: "f-1", name: "Trail Runner", price: "$89.00" },
      { id: "f-2", name: "Canvas Low-Top", price: "$58.00" },
      { id: "f-3", name: "All-Weather Boot", price: "$112.00" },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Small details that finish an outfit and last for years.",
    ctaLabel: "View full collection",
    accent: "teal",
    products: [
      { id: "a-1", name: "Waxed Canvas Belt", price: "$32.00" },
      { id: "a-2", name: "Wool Beanie", price: "$24.00" },
      { id: "a-3", name: "Leather Card Holder", price: "$28.00" },
    ],
  },
];

export function CategoryShowcase({ categories = defaultCategories }) {
  return (
    <div className="ofl-product-category-showcase">
      {categories.map((category, index) => (
        <section
          className="band"
          data-accent={category.accent}
          aria-labelledby={"category-" + category.id}
          key={category.id}
          style={{ animationDelay: index * 0.12 + "s" }}
        >
          <span className="decor decor-a" aria-hidden="true" />
          <span className="decor decor-b" aria-hidden="true" />
          <div className="band-content">
            <h2 id={"category-" + category.id}>{category.name}</h2>
            <p>{category.description}</p>
            <a className="cta" href={"#" + category.id} aria-label={category.ctaLabel + ": " + category.name}>
              {category.ctaLabel}
            </a>
          </div>
          <ul className="grid" role="list">
            {category.products.map((product) => (
              <li className="card" key={product.id}>
                <div className="thumb" aria-hidden="true">
                  {product.name.slice(0, 1)}
                </div>
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
`,
    styles: `.ofl-product-category-showcase {
  background: #0d0d10;
  color: #f4f2ee;
  font-family: "Segoe UI", Arial, sans-serif;
  padding: 2.5rem clamp(1.25rem, 4vw, 3rem) 4rem;
}
.ofl-product-category-showcase .band {
  animation: ofl-product-category-showcase-rise 0.6s ease both;
  border-radius: 1.25rem;
  margin-bottom: 1.25rem;
  overflow: hidden;
  padding: 3rem 2.25rem;
  position: relative;
}
.ofl-product-category-showcase .band[data-accent="violet"] { background: linear-gradient(120deg, #3a2e6b, #6a3fae); }
.ofl-product-category-showcase .band[data-accent="amber"] { background: linear-gradient(120deg, #7a4a12, #c9862f); }
.ofl-product-category-showcase .band[data-accent="teal"] { background: linear-gradient(120deg, #0f4a4a, #1f8f83); }
.ofl-product-category-showcase .decor { border-radius: 999px; position: absolute; opacity: 0.18; background: white; }
.ofl-product-category-showcase .decor-a { height: 9rem; width: 9rem; right: -2rem; top: -3rem; }
.ofl-product-category-showcase .decor-b { height: 5rem; width: 5rem; right: 5rem; top: 2rem; }
.ofl-product-category-showcase .band-content { max-width: 32rem; position: relative; z-index: 1; }
.ofl-product-category-showcase .band-content h2 { font-size: 1.7rem; margin: 0 0 0.6rem; }
.ofl-product-category-showcase .band-content p { color: rgba(244, 242, 238, 0.85); margin: 0 0 1.25rem; }
.ofl-product-category-showcase .cta {
  background: white;
  border-radius: 999px;
  color: #16181c;
  display: inline-block;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.6rem 1.2rem;
  text-decoration: none;
}
.ofl-product-category-showcase .grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  list-style: none;
  margin: 1.75rem 0 0;
  padding: 0;
  position: relative;
  z-index: 1;
}
.ofl-product-category-showcase .card { background: rgba(255, 255, 255, 0.12); border-radius: 0.75rem; padding: 1rem; }
.ofl-product-category-showcase .thumb {
  align-items: center;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 0.5rem;
  display: flex;
  font-size: 1.4rem;
  font-weight: 700;
  height: 5rem;
  justify-content: center;
  margin-bottom: 0.75rem;
}
.ofl-product-category-showcase .card h3 { font-size: 0.92rem; margin: 0 0 0.25rem; }
.ofl-product-category-showcase .card p { color: rgba(244, 242, 238, 0.85); font-size: 0.85rem; margin: 0; }
@keyframes ofl-product-category-showcase-rise {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 720px) {
  .ofl-product-category-showcase .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .ofl-product-category-showcase .band { animation: none; }
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "product.spec-comparison-table",
    name: "Product Comparison Table",
    category: "product",
    description: "Side-by-side product specification comparison table with a highlighted recommended column.",
    tags: ["product", "comparison", "spec-table", "table"],
    sourceProject: "aqsurgical",
    exportName: "ProductComparisonTable",
    fileName: "ProductComparisonTable.jsx",
    dependencies: [],
    defaultProps: {
      heading: "Compare instrument series",
      attributes: comparisonAttributes,
      products: comparisonProducts,
    },
    accessibility: [
      "The comparison table uses scope=\"col\" and scope=\"row\" so screen readers can announce which product and attribute a given cell belongs to.",
      "A visually hidden caption states how many products are being compared, for non-visual users who cannot see the column count.",
    ],
    source: `const defaultAttributes = ["Material", "Length", "Weight", "Sterilization", "Warranty"];

const defaultProducts = [
  {
    id: "standard",
    name: "Standard Series",
    price: "$89.00",
    highlight: false,
    values: ["Surgical Stainless", "14 cm", "62 g", "Autoclavable", "1 year"],
  },
  {
    id: "pro",
    name: "Pro Series",
    price: "$129.00",
    highlight: true,
    values: ["Titanium Alloy", "16 cm", "48 g", "Autoclavable", "3 years"],
  },
  {
    id: "compact",
    name: "Compact Series",
    price: "$74.00",
    highlight: false,
    values: ["Surgical Stainless", "11 cm", "40 g", "Autoclavable", "1 year"],
  },
];

export function ProductComparisonTable({
  heading = "Compare instrument series",
  attributes = defaultAttributes,
  products = defaultProducts,
}) {
  return (
    <section className="ofl-product-spec-comparison-table" aria-labelledby="comparison-heading">
      <h2 id="comparison-heading">{heading}</h2>
      <div className="scroll">
        <table>
          <caption className="visually-hidden">Specification comparison across {products.length} products</caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">Specification</span>
              </th>
              {products.map((product) => (
                <th scope="col" className={product.highlight ? "col col-highlight" : "col"} key={product.id}>
                  {product.highlight ? <span className="ribbon">Recommended</span> : null}
                  <span className="pname">{product.name}</span>
                  <span className="pprice">{product.price}</span>
                  <button type="button" className="select-btn" aria-label={"Select " + product.name}>
                    Select
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attribute, rowIndex) => (
              <tr key={attribute}>
                <th scope="row">{attribute}</th>
                {products.map((product) => (
                  <td className={product.highlight ? "col-highlight" : undefined} key={product.id}>
                    {product.values[rowIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
`,
    styles: `.ofl-product-spec-comparison-table {
  background: #f7f8fa;
  color: #1b1f27;
  font-family: "Segoe UI", Arial, sans-serif;
  padding: 3rem clamp(1.25rem, 4vw, 3rem);
}
.ofl-product-spec-comparison-table h2 { font-size: clamp(1.4rem, 3vw, 2rem); margin: 0 0 1.5rem; }
.ofl-product-spec-comparison-table .scroll {
  background: white;
  border: 1px solid #e2e5eb;
  border-radius: 0.9rem;
  overflow-x: auto;
  padding: 0.5rem;
}
.ofl-product-spec-comparison-table table { border-collapse: collapse; min-width: 40rem; width: 100%; }
.ofl-product-spec-comparison-table th,
.ofl-product-spec-comparison-table td { padding: 0.85rem 1.1rem; text-align: left; }
.ofl-product-spec-comparison-table thead th { border-bottom: 2px solid #e2e5eb; vertical-align: top; }
.ofl-product-spec-comparison-table .col { position: relative; }
.ofl-product-spec-comparison-table .col-highlight { background: #eef4ff; }
.ofl-product-spec-comparison-table .ribbon {
  background: #3a6fd8;
  border-radius: 999px;
  color: white;
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  padding: 0.2rem 0.6rem;
  text-transform: uppercase;
}
.ofl-product-spec-comparison-table .pname { display: block; font-size: 1rem; font-weight: 700; }
.ofl-product-spec-comparison-table .pprice { color: #5c6474; display: block; font-size: 0.85rem; margin: 0.2rem 0 0.7rem; }
.ofl-product-spec-comparison-table .select-btn {
  background: #16181c;
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.45rem 0.9rem;
}
.ofl-product-spec-comparison-table tbody tr th,
.ofl-product-spec-comparison-table tbody tr td { border-top: 1px solid #edeff3; }
.ofl-product-spec-comparison-table tbody th { color: #5c6474; font-weight: 600; }
.ofl-product-spec-comparison-table .visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
@media (max-width: 640px) {
  .ofl-product-spec-comparison-table table { min-width: 34rem; }
}
`,
  },
];
