// Navigation / header component variants harvested from reference projects.
// Populated by an authoring pass — see README.md for the sourcing process.

const ecommerceUtilitySource = `import { useState } from "react";

const defaultNavLinks = [
  { label: "All Products", href: "#products" },
  { label: "Bundles", href: "#bundles" },
  { label: "Blog", href: "#blog" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function EcommerceUtilityNav({
  brand = "Northfield",
  promoText = "Free shipping over $75 -- refer a friend and earn credit",
  navLinks = defaultNavLinks,
  cartCount = 2,
  isSignedIn = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="ofl-nav-ecommerce-utility">
      <div className="ofl-nav-ecommerce-utility__utility">
        <span className="ofl-nav-ecommerce-utility__promo">{promoText}</span>
        <div className="ofl-nav-ecommerce-utility__utility-links">
          <a href="mailto:support@example.com">Mail Us</a>
          <a href="#contact">Contact Us</a>
        </div>
      </div>

      <div className="ofl-nav-ecommerce-utility__main">
        <div className="ofl-nav-ecommerce-utility__main-row">
          <button
            type="button"
            className="ofl-nav-ecommerce-utility__burger"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="ecommerce-utility-drawer"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          <a href="/" className="ofl-nav-ecommerce-utility__brand">{brand}</a>

          <div className="ofl-nav-ecommerce-utility__search">
            <input type="search" placeholder="Search products..." aria-label="Search products" />
          </div>

          <div className="ofl-nav-ecommerce-utility__actions">
            {isSignedIn ? (
              <a href="#account" className="ofl-nav-ecommerce-utility__ghost-btn">My Account</a>
            ) : (
              <a href="#signup" className="ofl-nav-ecommerce-utility__ghost-btn">Sign up</a>
            )}
            <a href="#cart" className="ofl-nav-ecommerce-utility__cart" aria-label={"Cart, " + cartCount + " items"}>
              <CartIcon />
              {cartCount > 0 && <span className="ofl-nav-ecommerce-utility__cart-badge">{cartCount}</span>}
            </a>
          </div>
        </div>
      </div>

      <nav className="ofl-nav-ecommerce-utility__links-bar" aria-label="Primary">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>

      <div
        id="ecommerce-utility-drawer"
        className={menuOpen ? "ofl-nav-ecommerce-utility__drawer ofl-nav-ecommerce-utility__drawer--open" : "ofl-nav-ecommerce-utility__drawer"}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <button type="button" className="ofl-nav-ecommerce-utility__drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <CloseIcon />
        </button>
        <nav className="ofl-nav-ecommerce-utility__drawer-links" aria-label="Mobile">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
        </nav>
        {isSignedIn ? (
          <a href="#account" className="ofl-nav-ecommerce-utility__drawer-cta">My Account</a>
        ) : (
          <a href="#signup" className="ofl-nav-ecommerce-utility__drawer-cta">Sign up</a>
        )}
      </div>
      {menuOpen && (
        <button
          type="button"
          className="ofl-nav-ecommerce-utility__scrim"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
`;

const ecommerceUtilityStyles = `.ofl-nav-ecommerce-utility {
  --ofl-ink: #1f1a2e;
  --ofl-accent: #6d28d9;
  --ofl-line: #e6e1f2;
  --ofl-muted: #6b7280;
  font-family: Arial, sans-serif;
  color: var(--ofl-ink);
  position: relative;
}
.ofl-nav-ecommerce-utility * { box-sizing: border-box; }
.ofl-nav-ecommerce-utility__utility {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 1.5rem;
  background: #f4f1fb;
  border-bottom: 1px solid var(--ofl-line);
  font-size: 0.8rem;
  color: var(--ofl-muted);
}
.ofl-nav-ecommerce-utility__utility-links { display: flex; gap: 1rem; }
.ofl-nav-ecommerce-utility__utility-links a,
.ofl-nav-ecommerce-utility__promo { color: inherit; text-decoration: none; }
.ofl-nav-ecommerce-utility__main { padding: 0.85rem 1.5rem; background: #fff; position: sticky; top: 0; z-index: 30; }
.ofl-nav-ecommerce-utility__main-row { display: flex; align-items: center; gap: 1.25rem; max-width: 76rem; margin: 0 auto; }
.ofl-nav-ecommerce-utility__brand { font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em; color: var(--ofl-ink); text-decoration: none; }
.ofl-nav-ecommerce-utility__search { flex: 1; }
.ofl-nav-ecommerce-utility__search input {
  width: 100%;
  height: 2.6rem;
  border: 1px solid var(--ofl-line);
  border-radius: 999px;
  padding: 0 1.1rem;
  font-size: 0.9rem;
  background: #f8f7fc;
}
.ofl-nav-ecommerce-utility__actions { display: flex; align-items: center; gap: 1rem; }
.ofl-nav-ecommerce-utility__ghost-btn {
  height: 2.4rem;
  padding: 0 1.1rem;
  border: 1px solid var(--ofl-ink);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--ofl-ink);
  text-decoration: none;
  white-space: nowrap;
}
.ofl-nav-ecommerce-utility__cart { position: relative; display: inline-flex; color: var(--ofl-ink); }
.ofl-nav-ecommerce-utility__cart-badge {
  position: absolute; top: -0.5rem; right: -0.6rem;
  background: var(--ofl-accent); color: #fff;
  font-size: 0.65rem; font-weight: 700;
  min-width: 1.1rem; height: 1.1rem; border-radius: 999px;
  display: flex; align-items: center; justify-content: center; padding: 0 0.25rem;
}
.ofl-nav-ecommerce-utility__burger { display: none; background: none; border: none; padding: 0.35rem; color: var(--ofl-ink); cursor: pointer; }
.ofl-nav-ecommerce-utility__links-bar {
  display: flex; gap: 1.75rem; padding: 0.7rem 1.5rem;
  background: #faf9fd; border-top: 1px solid var(--ofl-line); border-bottom: 1px solid var(--ofl-line);
  max-width: 76rem; margin: 0 auto;
}
.ofl-nav-ecommerce-utility__links-bar a { color: var(--ofl-muted); text-decoration: none; font-size: 0.88rem; font-weight: 600; }
.ofl-nav-ecommerce-utility__links-bar a:hover { color: var(--ofl-accent); }
.ofl-nav-ecommerce-utility__drawer {
  position: fixed; top: 0; left: 0; height: 100%; width: min(20rem, 85vw);
  background: #fff; box-shadow: 0.5rem 0 2rem rgba(31,26,46,0.18);
  transform: translateX(-100%); transition: transform 0.28s ease;
  z-index: 60; padding: 1.5rem; border-radius: 0 1.5rem 1.5rem 0;
}
.ofl-nav-ecommerce-utility__drawer--open { transform: translateX(0); }
.ofl-nav-ecommerce-utility__drawer-close { background: #f4f1fb; border: none; border-radius: 999px; width: 2.25rem; height: 2.25rem; display: flex; align-items: center; justify-content: center; margin-left: auto; cursor: pointer; }
.ofl-nav-ecommerce-utility__drawer-links { display: flex; flex-direction: column; gap: 0.9rem; margin-top: 1.75rem; }
.ofl-nav-ecommerce-utility__drawer-links a { color: var(--ofl-ink); text-decoration: none; font-size: 1.05rem; font-weight: 700; }
.ofl-nav-ecommerce-utility__drawer-cta {
  display: block; text-align: center; margin-top: 1.75rem; padding: 0.75rem 1rem;
  border-radius: 999px; background: var(--ofl-accent); color: #fff; text-decoration: none; font-weight: 700;
}
.ofl-nav-ecommerce-utility__scrim { position: fixed; inset: 0; background: rgba(17,12,33,0.4); border: none; z-index: 55; cursor: pointer; }
@media (max-width: 860px) {
  .ofl-nav-ecommerce-utility__utility-links { display: none; }
  .ofl-nav-ecommerce-utility__links-bar { display: none; }
  .ofl-nav-ecommerce-utility__burger { display: inline-flex; }
  .ofl-nav-ecommerce-utility__ghost-btn { display: none; }
}
`;

const megaDropdownGlassSource = `import { useEffect, useState } from "react";

const defaultNavLinks = [
  { href: "#home", label: "Home" },
  { href: "#catalog", label: "Catalog" },
  {
    label: "Categories",
    children: [
      { href: "#category-school", label: "School Uniforms" },
      { href: "#category-corporate", label: "Corporate Wear" },
      { href: "#category-formal", label: "Formal Attire" },
      { href: "#category-workwear", label: "Workwear & Industrial" },
    ],
  },
];

function ChevronIcon({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.4-2.9 8.3-7 9.5C7.9 19.3 5 15.4 5 11V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function MegaDropdownGlassNav({
  brand = "Meridian & Co.",
  tagline = "Est. Manufacturing & Export",
  badgeLabel = "ISO 9001:2015",
  ctaLabel = "Start Inquiry",
  ctaHref = "#inquiry",
  navLinks = defaultNavLinks,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={
          scrolled
            ? "ofl-nav-mega-dropdown__header ofl-nav-mega-dropdown__header--scrolled"
            : "ofl-nav-mega-dropdown__header"
        }
      >
        <div className="ofl-nav-mega-dropdown__row">
          <a href="/" className="ofl-nav-mega-dropdown__brand">
            <span className="ofl-nav-mega-dropdown__mark">
              {brand.charAt(0)}
            </span>
            <span className="ofl-nav-mega-dropdown__brand-text">
              <p className="ofl-nav-mega-dropdown__brand-name">{brand}</p>
              <p className="ofl-nav-mega-dropdown__brand-tag">{tagline}</p>
            </span>
          </a>

          <nav className="ofl-nav-mega-dropdown__desktop-nav" aria-label="Primary">
            {navLinks.map((link) =>
              link.children ? (
                <div className="ofl-nav-mega-dropdown__dropdown" key={link.label}>
                  <button
                    type="button"
                    className="ofl-nav-mega-dropdown__dropdown-trigger"
                    aria-expanded={dropdownOpen}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {link.label}
                    <ChevronIcon open={dropdownOpen} />
                  </button>
                  {dropdownOpen && (
                    <div className="ofl-nav-mega-dropdown__panel">
                      {link.children.map((child) => (
                        <a key={child.href} href={child.href}>{child.label}</a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a key={link.href} href={link.href} className="ofl-nav-mega-dropdown__link">
                  {link.label}
                </a>
              )
            )}
            <a href={ctaHref} className="ofl-nav-mega-dropdown__cta">{ctaLabel}</a>
          </nav>

          <span className="ofl-nav-mega-dropdown__badge">
            <ShieldIcon />
            {badgeLabel}
          </span>

          <button
            type="button"
            className="ofl-nav-mega-dropdown__burger"
            aria-expanded={mobileOpen}
            aria-controls="mega-dropdown-drawer"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </header>
      <div className="ofl-nav-mega-dropdown__spacer" />

      {mobileOpen && (
        <button
          type="button"
          className="ofl-nav-mega-dropdown__scrim"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        id="mega-dropdown-drawer"
        className={
          mobileOpen
            ? "ofl-nav-mega-dropdown__drawer ofl-nav-mega-dropdown__drawer--open"
            : "ofl-nav-mega-dropdown__drawer"
        }
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="ofl-nav-mega-dropdown__drawer-head">
          <strong>{brand}</strong>
          <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <nav className="ofl-nav-mega-dropdown__drawer-links" aria-label="Mobile">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <p className="ofl-nav-mega-dropdown__drawer-group-label">{link.label}</p>
                {link.children.map((child) => (
                  <a key={child.href} href={child.href} onClick={() => setMobileOpen(false)}>
                    {child.label}
                  </a>
                ))}
              </div>
            ) : (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            )
          )}
          <a href={ctaHref} onClick={() => setMobileOpen(false)}>{ctaLabel}</a>
        </nav>
      </div>
    </>
  );
}
`;

const megaDropdownGlassStyles = `.ofl-nav-mega-dropdown {
  --ofl-navy: #0f2545;
  --ofl-navy-dark: #0a1b34;
  --ofl-gold: #b8862f;
  --ofl-slate: #475569;
}
.ofl-nav-mega-dropdown * { box-sizing: border-box; font-family: Arial, sans-serif; }
.ofl-nav-mega-dropdown__header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  background: rgba(255,255,255,0);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
  padding: 0 1.5rem;
}
.ofl-nav-mega-dropdown__header--scrolled {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 rgba(15,37,69,0.08);
}
.ofl-nav-mega-dropdown__row {
  max-width: 76rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 4.5rem;
}
.ofl-nav-mega-dropdown__brand { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; }
.ofl-nav-mega-dropdown__mark {
  width: 2.5rem; height: 2.5rem; border-radius: 0.6rem;
  background: linear-gradient(135deg, var(--ofl-navy), var(--ofl-navy-dark));
  color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem;
}
.ofl-nav-mega-dropdown__brand-text p { margin: 0; }
.ofl-nav-mega-dropdown__brand-name { font-size: 0.92rem; font-weight: 800; color: var(--ofl-navy); }
.ofl-nav-mega-dropdown__brand-tag { font-size: 0.62rem; color: var(--ofl-slate); text-transform: uppercase; letter-spacing: 0.14em; }
.ofl-nav-mega-dropdown__desktop-nav { display: flex; align-items: center; gap: 0.25rem; }
.ofl-nav-mega-dropdown__link, .ofl-nav-mega-dropdown__dropdown-trigger {
  padding: 0.55rem 1rem; border-radius: 0.5rem; font-size: 0.88rem; font-weight: 600;
  color: var(--ofl-slate); text-decoration: none; background: none; border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.3rem;
}
.ofl-nav-mega-dropdown__link:hover, .ofl-nav-mega-dropdown__dropdown-trigger:hover { color: var(--ofl-navy); background: #f1f4f8; }
.ofl-nav-mega-dropdown__dropdown { position: relative; }
.ofl-nav-mega-dropdown__panel {
  position: absolute; top: calc(100% + 0.4rem); left: 0; width: 15rem;
  background: #fff; border: 1px solid #e6eaf0; border-radius: 0.85rem;
  box-shadow: 0 1.25rem 2.5rem rgba(15,37,69,0.14); padding: 0.5rem;
}
.ofl-nav-mega-dropdown__panel a { display: block; padding: 0.6rem 0.75rem; border-radius: 0.5rem; color: var(--ofl-slate); text-decoration: none; font-size: 0.85rem; }
.ofl-nav-mega-dropdown__panel a:hover { background: #f1f4f8; color: var(--ofl-navy); }
.ofl-nav-mega-dropdown__cta {
  margin-left: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 0.5rem;
  background: var(--ofl-navy); color: #fff; font-size: 0.85rem; font-weight: 700; text-decoration: none;
}
.ofl-nav-mega-dropdown__badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  border: 1px solid rgba(184,134,47,0.4); border-radius: 0.5rem; padding: 0.35rem 0.65rem;
  color: var(--ofl-gold); font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
  background: rgba(184,134,47,0.08);
}
.ofl-nav-mega-dropdown__burger { display: none; border: none; background: none; padding: 0.4rem; border-radius: 0.5rem; cursor: pointer; color: var(--ofl-slate); }
.ofl-nav-mega-dropdown__scrim { position: fixed; inset: 0; background: rgba(10,16,30,0.35); z-index: 55; border: none; cursor: pointer; }
.ofl-nav-mega-dropdown__drawer {
  position: fixed; top: 0; right: 0; bottom: 0; width: 20rem; max-width: 85vw;
  background: #fff; z-index: 60; box-shadow: -1rem 0 2.5rem rgba(15,37,69,0.2);
  transform: translateX(100%); transition: transform 0.28s ease; padding: 1.25rem; overflow-y: auto;
}
.ofl-nav-mega-dropdown__drawer--open { transform: translateX(0); }
.ofl-nav-mega-dropdown__drawer-head { display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid #eef1f5; }
.ofl-nav-mega-dropdown__drawer-links a, .ofl-nav-mega-dropdown__drawer-group-label { display: block; padding: 0.65rem 0.5rem; text-decoration: none; color: var(--ofl-slate); font-size: 0.92rem; }
.ofl-nav-mega-dropdown__drawer-group-label { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #9aa5b1; padding-top: 1rem; }
.ofl-nav-mega-dropdown__spacer { height: 4.5rem; }
@media (max-width: 960px) {
  .ofl-nav-mega-dropdown__desktop-nav, .ofl-nav-mega-dropdown__badge { display: none; }
  .ofl-nav-mega-dropdown__burger { display: inline-flex; }
}
`;

const floatingPillSearchSource = `import { useState } from "react";

const defaultNavLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

const defaultCategories = [
  { href: "#boxing", label: "Boxing Gear" },
  { href: "#teamwear", label: "Team Wear" },
  { href: "#fitness", label: "Fitness Equipment" },
  { href: "#protective", label: "Protective Gear" },
];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function FloatingPillSearchNav({
  brand = "Solstice Sports",
  announcement = "Built for premium sporting-goods exports, worldwide.",
  navLinks = defaultNavLinks,
  categories = defaultCategories,
  ctaLabel = "Get a Quote",
  ctaHref = "#quote",
}) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const suggestions = categories.filter((category) =>
    category.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <header className="ofl-nav-floating-pill">
      <div className="ofl-nav-floating-pill__announcement">{announcement}</div>

      <div className="ofl-nav-floating-pill__wrap">
        <div className="ofl-nav-floating-pill__bar ofl-nav-floating-pill__bar--desktop">
          <a href="/" className="ofl-nav-floating-pill__brand">{brand}</a>

          <div className="ofl-nav-floating-pill__dropdown">
            <button
              type="button"
              className="ofl-nav-floating-pill__dropdown-trigger"
              aria-expanded={categoriesOpen}
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              Products <ChevronIcon open={categoriesOpen} />
            </button>
            {categoriesOpen && (
              <div className="ofl-nav-floating-pill__panel">
                {categories.map((category) => (
                  <a key={category.href} href={category.href}>{category.label}</a>
                ))}
              </div>
            )}
          </div>

          <nav className="ofl-nav-floating-pill__links" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>

          <div className="ofl-nav-floating-pill__search">
            <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
              placeholder="Search products..."
              aria-label="Search products"
            />
            {searchFocused && (
              <div className="ofl-nav-floating-pill__suggestions">
                {(query.trim().length > 0 ? suggestions : categories).length === 0 ? (
                  <p className="ofl-nav-floating-pill__no-results">No matches found.</p>
                ) : (
                  (query.trim().length > 0 ? suggestions : categories).map((item) => (
                    <a key={item.href} href={item.href}>{item.label}</a>
                  ))
                )}
              </div>
            )}
          </div>

          <a href={ctaHref} className="ofl-nav-floating-pill__cta">{ctaLabel}</a>
        </div>

        <div className="ofl-nav-floating-pill__bar ofl-nav-floating-pill__bar--mobile">
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="floating-pill-drawer"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="ofl-nav-floating-pill__icon-btn"
          >
            <MenuIcon />
          </button>
          <a href="/" className="ofl-nav-floating-pill__brand ofl-nav-floating-pill__brand--mobile">{brand}</a>
          <a href={ctaHref} className="ofl-nav-floating-pill__cta ofl-nav-floating-pill__cta--mobile">{ctaLabel}</a>
        </div>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="ofl-nav-floating-pill__scrim"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        id="floating-pill-drawer"
        className={
          mobileOpen
            ? "ofl-nav-floating-pill__drawer ofl-nav-floating-pill__drawer--open"
            : "ofl-nav-floating-pill__drawer"
        }
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <button type="button" className="ofl-nav-floating-pill__drawer-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
          <CloseIcon />
        </button>
        <button
          type="button"
          className="ofl-nav-floating-pill__drawer-accordion"
          aria-expanded={mobileCategoriesOpen}
          onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
        >
          Products <ChevronIcon open={mobileCategoriesOpen} />
        </button>
        {mobileCategoriesOpen && (
          <div className="ofl-nav-floating-pill__drawer-sublist">
            {categories.map((category) => (
              <a key={category.href} href={category.href} onClick={() => setMobileOpen(false)}>{category.label}</a>
            ))}
          </div>
        )}
        <nav className="ofl-nav-floating-pill__drawer-links" aria-label="Mobile">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>{link.label}</a>
          ))}
        </nav>
        <a href={ctaHref} className="ofl-nav-floating-pill__drawer-cta" onClick={() => setMobileOpen(false)}>{ctaLabel}</a>
      </div>
    </header>
  );
}
`;

const floatingPillSearchStyles = `.ofl-nav-floating-pill {
  --ofl-brand: #cf2026;
  --ofl-brand-dark: #a51920;
  --ofl-ink: #262626;
  --ofl-line: #f0d4d5;
  font-family: Arial, sans-serif;
  color: var(--ofl-ink);
}
.ofl-nav-floating-pill * { box-sizing: border-box; }
.ofl-nav-floating-pill__announcement {
  background: var(--ofl-brand); color: #fff; text-align: center;
  font-size: 0.78rem; padding: 0.5rem 1rem; letter-spacing: 0.01em;
}
.ofl-nav-floating-pill__wrap { padding: 1rem 1rem 0; max-width: 82rem; margin: 0 auto; }
.ofl-nav-floating-pill__bar--desktop {
  display: flex; align-items: center; gap: 1rem;
  border: 1px solid var(--ofl-line); border-radius: 999px;
  background: linear-gradient(180deg, #fff, #fffafa);
  box-shadow: 0 0.6rem 2rem rgba(0,0,0,0.08);
  padding: 0.6rem 0.6rem 0.6rem 1.4rem;
}
.ofl-nav-floating-pill__brand { font-weight: 800; font-size: 1.1rem; color: var(--ofl-ink); text-decoration: none; white-space: nowrap; }
.ofl-nav-floating-pill__dropdown { position: relative; }
.ofl-nav-floating-pill__dropdown-trigger {
  display: inline-flex; align-items: center; gap: 0.35rem; background: none; border: none; cursor: pointer;
  padding: 0.55rem 0.9rem; border-radius: 999px; font-size: 0.88rem; font-weight: 600; color: var(--ofl-ink);
}
.ofl-nav-floating-pill__dropdown-trigger:hover { color: var(--ofl-brand); }
.ofl-nav-floating-pill__panel {
  position: absolute; top: calc(100% + 0.6rem); left: 0; width: 15rem; background: #fff;
  border: 1px solid var(--ofl-line); border-radius: 1.25rem; padding: 0.5rem;
  box-shadow: 0 1.25rem 2.5rem rgba(0,0,0,0.12);
}
.ofl-nav-floating-pill__panel a { display: flex; justify-content: space-between; padding: 0.6rem 0.75rem; border-radius: 0.9rem; text-decoration: none; color: var(--ofl-ink); font-size: 0.85rem; }
.ofl-nav-floating-pill__panel a:hover { background: #f7f1f1; color: var(--ofl-brand); }
.ofl-nav-floating-pill__links { display: flex; gap: 0.25rem; }
.ofl-nav-floating-pill__links a { padding: 0.55rem 0.75rem; border-radius: 999px; text-decoration: none; color: var(--ofl-ink); font-size: 0.88rem; font-weight: 600; }
.ofl-nav-floating-pill__links a:hover { background: #f6f6f6; color: var(--ofl-brand); }
.ofl-nav-floating-pill__search { position: relative; flex: 1; display: flex; align-items: center; gap: 0.5rem; background: #f7f7f7; border: 1px solid #ececec; border-radius: 999px; padding: 0 1rem; height: 2.75rem; color: #9a9a9a; }
.ofl-nav-floating-pill__search input { border: none; background: none; outline: none; flex: 1; font-size: 0.88rem; color: var(--ofl-ink); }
.ofl-nav-floating-pill__suggestions { position: absolute; top: calc(100% + 0.6rem); left: 0; right: 0; background: #fff; border: 1px solid var(--ofl-line); border-radius: 1.25rem; box-shadow: 0 1.25rem 2.5rem rgba(0,0,0,0.12); padding: 0.5rem; z-index: 20; }
.ofl-nav-floating-pill__suggestions a { display: block; padding: 0.6rem 0.75rem; border-radius: 0.9rem; text-decoration: none; color: var(--ofl-ink); font-size: 0.85rem; }
.ofl-nav-floating-pill__suggestions a:hover { background: #f7f1f1; color: var(--ofl-brand); }
.ofl-nav-floating-pill__no-results { padding: 0.6rem 0.75rem; font-size: 0.82rem; color: #9a9a9a; margin: 0; }
.ofl-nav-floating-pill__cta { background: var(--ofl-brand); color: #fff; border-radius: 999px; padding: 0.75rem 1.4rem; font-weight: 700; font-size: 0.88rem; text-decoration: none; white-space: nowrap; }
.ofl-nav-floating-pill__cta:hover { background: var(--ofl-brand-dark); }
.ofl-nav-floating-pill__bar--mobile { display: none; }
.ofl-nav-floating-pill__icon-btn { border: none; background: #f7f7f7; border-radius: 999px; width: 2.75rem; height: 2.75rem; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ofl-ink); }
.ofl-nav-floating-pill__scrim { position: fixed; inset: 0; background: rgba(20,10,10,0.35); border: none; z-index: 55; cursor: pointer; }
.ofl-nav-floating-pill__drawer {
  position: fixed; top: 0; left: 0; height: 100%; width: min(22rem, 88vw); background: #fff; z-index: 60;
  box-shadow: 0.6rem 0 2.5rem rgba(0,0,0,0.18); transform: translateX(-100%); transition: transform 0.28s ease;
  padding: 1.5rem; border-radius: 0 2rem 2rem 0; overflow-y: auto;
}
.ofl-nav-floating-pill__drawer--open { transform: translateX(0); }
.ofl-nav-floating-pill__drawer-close { border: none; background: #f7f7f7; border-radius: 999px; width: 2.25rem; height: 2.25rem; margin-left: auto; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.ofl-nav-floating-pill__drawer-accordion { display: flex; width: 100%; justify-content: space-between; align-items: center; background: none; border: none; padding: 1rem 0; font-size: 1rem; font-weight: 700; cursor: pointer; color: var(--ofl-ink); border-bottom: 1px solid #f0f0f0; }
.ofl-nav-floating-pill__drawer-sublist { display: flex; flex-direction: column; padding: 0.25rem 0 0.5rem 0.5rem; }
.ofl-nav-floating-pill__drawer-sublist a { padding: 0.5rem 0; color: #6b6b6b; text-decoration: none; font-size: 0.9rem; }
.ofl-nav-floating-pill__drawer-links { display: flex; flex-direction: column; }
.ofl-nav-floating-pill__drawer-links a { padding: 1rem 0; border-bottom: 1px solid #f0f0f0; font-size: 1rem; font-weight: 700; text-decoration: none; color: var(--ofl-ink); }
.ofl-nav-floating-pill__drawer-cta { display: block; text-align: center; margin-top: 1.5rem; padding: 0.85rem; border-radius: 999px; background: var(--ofl-brand); color: #fff; font-weight: 700; text-decoration: none; }
@media (max-width: 980px) {
  .ofl-nav-floating-pill__bar--desktop { display: none; }
  .ofl-nav-floating-pill__bar--mobile {
    display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
    border: 1px solid var(--ofl-line); border-radius: 999px; background: #fff;
    box-shadow: 0 0.6rem 2rem rgba(0,0,0,0.08); padding: 0.6rem 0.75rem;
  }
  .ofl-nav-floating-pill__brand--mobile { flex: 1; text-align: center; }
  .ofl-nav-floating-pill__cta--mobile { padding: 0.6rem 1rem; font-size: 0.8rem; }
}
`;

const simpleAuthAwareSource = `import { useState } from "react";

const defaultLinks = [
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#guidance", label: "Guidance" },
];

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
    </svg>
  );
}

export function SimpleAuthAwareNav({
  brand = "Compass Guide",
  links = defaultLinks,
  currentHref = "#about",
  isLoggedIn = false,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  return (
    <header className="ofl-nav-simple-auth">
      <div className="ofl-nav-simple-auth__row">
        <a href="/" className="ofl-nav-simple-auth__brand">
          <CapIcon />
          {brand}
        </a>

        <button
          type="button"
          className="ofl-nav-simple-auth__burger"
          aria-expanded={mobileOpen}
          aria-controls="simple-auth-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <nav className="ofl-nav-simple-auth__links ofl-nav-simple-auth__links--desktop" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === currentHref ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
          {loggedIn ? (
            <>
              <a href="#dashboard">Dashboard</a>
              <button type="button" className="ofl-nav-simple-auth__danger-btn" onClick={() => setLoggedIn(false)}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="#login">Login</a>
              <button type="button" className="ofl-nav-simple-auth__primary-btn" onClick={() => setLoggedIn(true)}>
                Register
              </button>
            </>
          )}
        </nav>
      </div>

      <nav
        id="simple-auth-menu"
        className={
          mobileOpen
            ? "ofl-nav-simple-auth__links ofl-nav-simple-auth__links--mobile ofl-nav-simple-auth__links--open"
            : "ofl-nav-simple-auth__links ofl-nav-simple-auth__links--mobile"
        }
        aria-label="Mobile"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={link.href === currentHref ? "page" : undefined}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}
        {loggedIn ? (
          <>
            <a href="#dashboard" onClick={() => setMobileOpen(false)}>Dashboard</a>
            <button
              type="button"
              className="ofl-nav-simple-auth__danger-btn"
              onClick={() => {
                setLoggedIn(false);
                setMobileOpen(false);
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="#login" onClick={() => setMobileOpen(false)}>Login</a>
            <button
              type="button"
              className="ofl-nav-simple-auth__primary-btn"
              onClick={() => {
                setLoggedIn(true);
                setMobileOpen(false);
              }}
            >
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
`;

const simpleAuthAwareStyles = `.ofl-nav-simple-auth {
  --ofl-primary: #2563eb;
  --ofl-danger: #dc2626;
  --ofl-ink: #1f2937;
  --ofl-line: #e5e7eb;
  font-family: Arial, sans-serif;
  background: #fff;
  border-bottom: 1px solid var(--ofl-line);
  position: sticky;
  top: 0;
  z-index: 40;
}
.ofl-nav-simple-auth * { box-sizing: border-box; }
.ofl-nav-simple-auth__row {
  max-width: 72rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; gap: 1rem;
}
.ofl-nav-simple-auth__brand { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 1.2rem; font-weight: 800; color: var(--ofl-primary); text-decoration: none; }
.ofl-nav-simple-auth__burger { display: none; border: none; background: none; color: var(--ofl-ink); cursor: pointer; padding: 0.35rem; }
.ofl-nav-simple-auth__links--desktop { display: flex; align-items: center; gap: 1.5rem; }
.ofl-nav-simple-auth__links--desktop a { color: var(--ofl-ink); text-decoration: none; font-size: 0.92rem; font-weight: 500; }
.ofl-nav-simple-auth__links--desktop a:hover { color: var(--ofl-primary); }
.ofl-nav-simple-auth__links--desktop a[aria-current="page"] { color: var(--ofl-primary); font-weight: 700; }
.ofl-nav-simple-auth__primary-btn { background: var(--ofl-primary); color: #fff; border: none; padding: 0.55rem 1.1rem; border-radius: 0.4rem; font-size: 0.88rem; font-weight: 700; cursor: pointer; }
.ofl-nav-simple-auth__danger-btn { background: var(--ofl-danger); color: #fff; border: none; padding: 0.55rem 1.1rem; border-radius: 0.4rem; font-size: 0.88rem; font-weight: 700; cursor: pointer; }
.ofl-nav-simple-auth__links--mobile { display: none; flex-direction: column; gap: 0.25rem; padding: 0 1.25rem 1rem; }
.ofl-nav-simple-auth__links--mobile a { padding: 0.65rem 0.25rem; color: var(--ofl-ink); text-decoration: none; font-size: 0.98rem; border-bottom: 1px solid var(--ofl-line); }
.ofl-nav-simple-auth__links--mobile .ofl-nav-simple-auth__primary-btn,
.ofl-nav-simple-auth__links--mobile .ofl-nav-simple-auth__danger-btn { width: 100%; margin-top: 0.5rem; }
@media (max-width: 780px) {
  .ofl-nav-simple-auth__links--desktop { display: none; }
  .ofl-nav-simple-auth__burger { display: inline-flex; }
  .ofl-nav-simple-auth__links--mobile.ofl-nav-simple-auth__links--open { display: flex; }
}
`;

const sidebarDrawerDashboardSource = `import { useState } from "react";

const defaultGroups = [
  {
    group: "Overview",
    defaultOpen: true,
    items: [
      { href: "#dashboard", label: "Dashboard" },
      { href: "#customers", label: "Customers" },
      { href: "#orders", label: "Orders" },
    ],
  },
  {
    group: "Catalog",
    defaultOpen: true,
    items: [
      { href: "#products", label: "Products" },
      { href: "#inventory", label: "Inventory" },
    ],
  },
  {
    group: "Settings",
    items: [
      { href: "#profile", label: "Profile" },
      { href: "#preferences", label: "Preferences" },
    ],
  },
];

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SidebarDrawerDashboardNav({
  brand = "Atlas Admin",
  user = { name: "Jordan Ray", role: "admin" },
  groups = defaultGroups,
  activeHref = "#dashboard",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    groups.forEach((group) => {
      if (group.defaultOpen || group.items.some((item) => item.href === activeHref)) {
        initial[group.group] = true;
      }
    });
    return initial;
  });

  function toggleGroup(name) {
    setOpenGroups((current) => ({ ...current, [name]: !current[name] }));
  }

  return (
    <>
      <header className="ofl-nav-sidebar-drawer__mobile-bar">
        <a href="/" className="ofl-nav-sidebar-drawer__mobile-brand">
          <span className="ofl-nav-sidebar-drawer__mark">{initials(brand)}</span>
          {brand}
        </a>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="sidebar-drawer-nav"
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
          className="ofl-nav-sidebar-drawer__icon-btn"
        >
          <MenuIcon />
        </button>
      </header>

      {mobileOpen && (
        <button
          type="button"
          className="ofl-nav-sidebar-drawer__scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <nav
        id="sidebar-drawer-nav"
        aria-label="Primary"
        className={
          mobileOpen
            ? "ofl-nav-sidebar-drawer ofl-nav-sidebar-drawer--open"
            : "ofl-nav-sidebar-drawer"
        }
      >
        <div className="ofl-nav-sidebar-drawer__head">
          <a href="/" className="ofl-nav-sidebar-drawer__brand">
            <span className="ofl-nav-sidebar-drawer__mark">{initials(brand)}</span>
            <span>
              <p className="ofl-nav-sidebar-drawer__brand-name">{brand}</p>
              <p className="ofl-nav-sidebar-drawer__brand-tag">Admin Dashboard</p>
            </span>
          </a>
          <button
            type="button"
            className="ofl-nav-sidebar-drawer__icon-btn ofl-nav-sidebar-drawer__icon-btn--close"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="ofl-nav-sidebar-drawer__groups">
          {groups.map((group) => {
            const isOpen = !!openGroups[group.group];
            return (
              <div className="ofl-nav-sidebar-drawer__group" key={group.group}>
                <button
                  type="button"
                  className="ofl-nav-sidebar-drawer__group-toggle"
                  aria-expanded={isOpen}
                  onClick={() => toggleGroup(group.group)}
                >
                  {group.group}
                  <ChevronIcon open={isOpen} />
                </button>
                {isOpen && (
                  <ul className="ofl-nav-sidebar-drawer__group-list">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          aria-current={item.href === activeHref ? "page" : undefined}
                          className={
                            item.href === activeHref
                              ? "ofl-nav-sidebar-drawer__group-link ofl-nav-sidebar-drawer__group-link--active"
                              : "ofl-nav-sidebar-drawer__group-link"
                          }
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="ofl-nav-sidebar-drawer__footer">
          <span className="ofl-nav-sidebar-drawer__avatar">{initials(user.name)}</span>
          <span className="ofl-nav-sidebar-drawer__user">
            <p className="ofl-nav-sidebar-drawer__user-name">{user.name}</p>
            <p className="ofl-nav-sidebar-drawer__user-role">{user.role}</p>
          </span>
          <button type="button" className="ofl-nav-sidebar-drawer__logout" aria-label="Log out">
            <LogoutIcon />
          </button>
        </div>
      </nav>
    </>
  );
}
`;

const sidebarDrawerDashboardStyles = `.ofl-nav-sidebar-drawer {
  --ofl-brand: #0f766e;
  --ofl-brand-soft: #e6f6f4;
  --ofl-ink: #0f172a;
  --ofl-muted: #64748b;
  --ofl-line: #e2e8f0;
  position: fixed; top: 0; left: 0; bottom: 0; width: 16.5rem;
  background: #fff; border-right: 1px solid var(--ofl-line);
  display: flex; flex-direction: column; font-family: Arial, sans-serif; color: var(--ofl-ink);
  transform: translateX(-100%); transition: transform 0.22s ease; z-index: 60;
}
.ofl-nav-sidebar-drawer * { box-sizing: border-box; }
.ofl-nav-sidebar-drawer--open { transform: translateX(0); }
.ofl-nav-sidebar-drawer__head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 1.1rem; border-bottom: 1px solid var(--ofl-line); }
.ofl-nav-sidebar-drawer__brand, .ofl-nav-sidebar-drawer__mobile-brand { display: flex; align-items: center; gap: 0.65rem; text-decoration: none; color: var(--ofl-ink); }
.ofl-nav-sidebar-drawer__mark { width: 2.4rem; height: 2.4rem; border-radius: 999px; background: var(--ofl-brand); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0; }
.ofl-nav-sidebar-drawer__brand-name { margin: 0; font-size: 0.92rem; font-weight: 800; }
.ofl-nav-sidebar-drawer__brand-tag { margin: 0; font-size: 0.7rem; color: var(--ofl-muted); }
.ofl-nav-sidebar-drawer__icon-btn { border: none; background: var(--ofl-brand-soft); color: var(--ofl-brand); width: 2.4rem; height: 2.4rem; border-radius: 999px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.ofl-nav-sidebar-drawer__groups { flex: 1; overflow-y: auto; padding: 0.75rem; }
.ofl-nav-sidebar-drawer__group { margin-bottom: 0.25rem; }
.ofl-nav-sidebar-drawer__group-toggle { width: 100%; display: flex; align-items: center; justify-content: space-between; background: none; border: none; padding: 0.6rem 0.75rem; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: var(--ofl-muted); cursor: pointer; border-radius: 999px; }
.ofl-nav-sidebar-drawer__group-toggle:hover { background: #f8fafc; }
.ofl-nav-sidebar-drawer__group-list { list-style: none; margin: 0.15rem 0 0.5rem; padding: 0; }
.ofl-nav-sidebar-drawer__group-link { display: block; padding: 0.6rem 0.9rem; border-radius: 999px; color: var(--ofl-ink); text-decoration: none; font-size: 0.88rem; }
.ofl-nav-sidebar-drawer__group-link:hover { background: #f8fafc; }
.ofl-nav-sidebar-drawer__group-link--active { background: var(--ofl-brand-soft); color: var(--ofl-brand); font-weight: 700; }
.ofl-nav-sidebar-drawer__footer { display: flex; align-items: center; gap: 0.65rem; padding: 1rem; border-top: 1px solid var(--ofl-line); }
.ofl-nav-sidebar-drawer__avatar { width: 2.25rem; height: 2.25rem; border-radius: 999px; background: var(--ofl-brand-soft); color: var(--ofl-brand); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; flex-shrink: 0; }
.ofl-nav-sidebar-drawer__user { flex: 1; min-width: 0; }
.ofl-nav-sidebar-drawer__user-name { margin: 0; font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ofl-nav-sidebar-drawer__user-role { margin: 0; font-size: 0.72rem; color: var(--ofl-muted); text-transform: capitalize; }
.ofl-nav-sidebar-drawer__logout { border: none; background: none; color: var(--ofl-muted); cursor: pointer; padding: 0.4rem; border-radius: 999px; }
.ofl-nav-sidebar-drawer__logout:hover { background: #fee2e2; color: #dc2626; }
.ofl-nav-sidebar-drawer__mobile-bar { display: none; }
.ofl-nav-sidebar-drawer__scrim { position: fixed; inset: 0; background: rgba(15,23,42,0.4); border: none; z-index: 55; cursor: pointer; display: none; }
@media (max-width: 960px) {
  .ofl-nav-sidebar-drawer { position: fixed; }
  .ofl-nav-sidebar-drawer__mobile-bar {
    display: flex; align-items: center; justify-content: space-between; height: 3.75rem; padding: 0 1rem;
    border-bottom: 1px solid var(--ofl-line); background: #fff; position: sticky; top: 0; z-index: 40; font-family: Arial, sans-serif;
  }
  .ofl-nav-sidebar-drawer__mobile-bar .ofl-nav-sidebar-drawer__mark { width: 2.1rem; height: 2.1rem; font-size: 0.7rem; }
  .ofl-nav-sidebar-drawer__scrim { display: block; }
}
@media (min-width: 961px) {
  .ofl-nav-sidebar-drawer { transform: translateX(0); }
  .ofl-nav-sidebar-drawer__icon-btn--close { display: none; }
}
`;

const scrollHideMinimalSource = `import { useEffect, useRef, useState } from "react";

const defaultLinks = [
  { href: "#home", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
];

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ScrollHideMinimalNav({
  brand = "Studio Nine",
  links = defaultLinks,
  ctaLabel = "Resume",
  ctaHref = "#resume",
}) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);
  const closeRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      const current = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, current / max) : 0);
      setScrolled(current > 80);
      setHidden(current > lastScroll.current && current > 140);
      lastScroll.current = current;
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      closeRef.current?.focus();
    }
  }, [menuOpen]);

  return (
    <>
      <div className="ofl-nav-scroll-hide__progress" style={{ transform: "scaleX(" + progress + ")" }} />
      <header
        className={
          "ofl-nav-scroll-hide__header" +
          (scrolled ? " ofl-nav-scroll-hide__header--scrolled" : "") +
          (hidden && !menuOpen ? " ofl-nav-scroll-hide__header--hidden" : "")
        }
      >
        <nav className="ofl-nav-scroll-hide__row" aria-label="Primary">
          <a href="/" className="ofl-nav-scroll-hide__brand">{brand}</a>

          <ul className="ofl-nav-scroll-hide__links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          <div className="ofl-nav-scroll-hide__actions">
            <a href={ctaHref} className="ofl-nav-scroll-hide__cta">{ctaLabel}</a>
            <button
              type="button"
              className="ofl-nav-scroll-hide__burger"
              aria-expanded={menuOpen}
              aria-controls="scroll-hide-mobile-menu"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div
          id="scroll-hide-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="ofl-nav-scroll-hide__overlay"
        >
          <div className="ofl-nav-scroll-hide__overlay-head">
            <span>{brand}</span>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="ofl-nav-scroll-hide__overlay-close"
            >
              <CloseIcon />
            </button>
          </div>
          <ul className="ofl-nav-scroll-hide__overlay-links">
            {links.map((link, index) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  <sup>{String(index + 1).padStart(2, "0")}</sup>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={ctaHref} className="ofl-nav-scroll-hide__overlay-cta" onClick={() => setMenuOpen(false)}>
            {ctaLabel}
          </a>
        </div>
      )}
    </>
  );
}
`;

const scrollHideMinimalStyles = `.ofl-nav-scroll-hide {
  --ofl-ink: #121212;
  --ofl-cream: #f5f3ee;
  --ofl-lime: #c8f169;
}
.ofl-nav-scroll-hide__progress {
  position: fixed; top: 0; left: 0; right: 0; height: 3px; background: var(--ofl-lime);
  transform-origin: left; z-index: 70; transform: scaleX(0);
}
.ofl-nav-scroll-hide__header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  background: transparent; transition: transform 0.5s ease, background-color 0.4s ease, backdrop-filter 0.4s ease;
  font-family: Arial, sans-serif; color: var(--ofl-ink);
}
.ofl-nav-scroll-hide__header--scrolled { background: rgba(245,243,238,0.75); backdrop-filter: blur(10px); }
.ofl-nav-scroll-hide__header--hidden { transform: translateY(-110%); }
.ofl-nav-scroll-hide__row { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.75rem; max-width: 80rem; margin: 0 auto; }
.ofl-nav-scroll-hide__brand { font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ofl-ink); text-decoration: none; }
.ofl-nav-scroll-hide__links { list-style: none; display: flex; gap: 2rem; margin: 0; padding: 0; }
.ofl-nav-scroll-hide__links a { color: var(--ofl-ink); text-decoration: none; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.ofl-nav-scroll-hide__actions { display: flex; align-items: center; gap: 1.5rem; }
.ofl-nav-scroll-hide__cta { border-radius: 999px; background: var(--ofl-lime); color: var(--ofl-ink); padding: 0.5rem 1.1rem; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; }
.ofl-nav-scroll-hide__burger { display: none; flex-direction: column; gap: 0.3rem; width: 2.5rem; height: 2.5rem; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; }
.ofl-nav-scroll-hide__burger span { width: 1.3rem; height: 1px; background: var(--ofl-ink); display: block; }
.ofl-nav-scroll-hide__overlay {
  position: fixed; inset: 0; z-index: 80; background: var(--ofl-ink); color: var(--ofl-cream);
  display: flex; flex-direction: column; padding: 1.5rem;
}
.ofl-nav-scroll-hide__overlay-head { display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.ofl-nav-scroll-hide__overlay-close { border: 1px solid rgba(245,243,238,0.3); background: none; color: var(--ofl-cream); width: 2.6rem; height: 2.6rem; border-radius: 999px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.ofl-nav-scroll-hide__overlay-links { list-style: none; margin: 3rem 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.ofl-nav-scroll-hide__overlay-links a { display: flex; align-items: baseline; gap: 1rem; color: var(--ofl-cream); text-decoration: none; font-size: clamp(2.5rem, 11vw, 4.5rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.05; }
.ofl-nav-scroll-hide__overlay-links sup { font-size: 0.9rem; color: var(--ofl-lime); font-weight: 700; }
.ofl-nav-scroll-hide__overlay-cta { margin-top: auto; text-align: center; padding: 1rem; border-radius: 999px; background: var(--ofl-lime); color: var(--ofl-ink); text-decoration: none; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
@media (max-width: 820px) {
  .ofl-nav-scroll-hide__links, .ofl-nav-scroll-hide__actions .ofl-nav-scroll-hide__cta { display: none; }
  .ofl-nav-scroll-hide__burger { display: flex; }
}
`;

export const navComponents = [
  {
    schemaVersion: 1,
    id: "nav.ecommerce-utility-stack",
    name: "E-commerce Utility Stack Nav",
    category: "nav",
    description:
      "Three-tier e-commerce header with a promo utility bar, a sticky search-and-cart row, and a secondary links bar; collapses to a rounded slide-in drawer on mobile.",
    tags: ["nav", "ecommerce", "search", "cart", "sticky", "drawer"],
    sourceProject: "FitGrips-Frontend",
    exportName: "EcommerceUtilityNav",
    fileName: "EcommerceUtilityNav.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Northfield",
      promoText: "Free shipping over $75 -- refer a friend and earn credit",
      navLinks: [
        { label: "All Products", href: "#products" },
        { label: "Bundles", href: "#bundles" },
        { label: "Blog", href: "#blog" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
      ],
      cartCount: 2,
      isSignedIn: false,
    },
    accessibility: [
      "The mobile menu toggle exposes aria-expanded and an accessible label, and the slide-in drawer uses role=\"dialog\" with aria-modal=\"true\".",
      "The cart link carries an aria-label announcing the current item count for screen reader users.",
    ],
    source: ecommerceUtilitySource,
    styles: ecommerceUtilityStyles,
  },
  {
    schemaVersion: 1,
    id: "nav.mega-dropdown-glass",
    name: "Mega Dropdown Glass Nav",
    category: "nav",
    description:
      "Transparent-on-load corporate nav that turns to frosted glass on scroll, with a click-toggle category dropdown, a certification badge, and a right-side mobile drawer.",
    tags: ["nav", "mega-menu", "dropdown", "corporate", "glass", "scroll"],
    sourceProject: "allahrakhaandco",
    exportName: "MegaDropdownGlassNav",
    fileName: "MegaDropdownGlassNav.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Meridian & Co.",
      tagline: "Est. Manufacturing & Export",
      badgeLabel: "ISO 9001:2015",
      ctaLabel: "Start Inquiry",
      ctaHref: "#inquiry",
      navLinks: [
        { href: "#home", label: "Home" },
        { href: "#catalog", label: "Catalog" },
        {
          label: "Categories",
          children: [
            { href: "#category-school", label: "School Uniforms" },
            { href: "#category-corporate", label: "Corporate Wear" },
            { href: "#category-formal", label: "Formal Attire" },
            { href: "#category-workwear", label: "Workwear & Industrial" },
          ],
        },
      ],
    },
    accessibility: [
      "The category dropdown trigger is a real button with aria-expanded reflecting its open/closed state.",
      "The mobile drawer is dismissible via a labelled close button and a clickable backdrop, and is announced with role=\"dialog\" and aria-modal=\"true\".",
    ],
    source: megaDropdownGlassSource,
    styles: megaDropdownGlassStyles,
  },
  {
    schemaVersion: 1,
    id: "nav.floating-pill-search",
    name: "Floating Pill Search Nav",
    category: "nav",
    description:
      "Floating rounded-pill navigation with a category dropdown and a live-filtering product search box beneath a slim announcement bar; collapses to a smaller pill with a left-side drawer on mobile.",
    tags: ["nav", "search", "pill", "rounded", "ecommerce", "dropdown"],
    sourceProject: "snpridesports",
    exportName: "FloatingPillSearchNav",
    fileName: "FloatingPillSearchNav.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Solstice Sports",
      announcement: "Built for premium sporting-goods exports, worldwide.",
      navLinks: [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#blog", label: "Blog" },
        { href: "#contact", label: "Contact" },
      ],
      categories: [
        { href: "#boxing", label: "Boxing Gear" },
        { href: "#teamwear", label: "Team Wear" },
        { href: "#fitness", label: "Fitness Equipment" },
        { href: "#protective", label: "Protective Gear" },
      ],
      ctaLabel: "Get a Quote",
      ctaHref: "#quote",
    },
    accessibility: [
      "The search input has an explicit aria-label, and its live suggestion results render as real text links rather than being conveyed by color or icon alone.",
      "The mobile menu toggle sets aria-expanded and aria-controls, and the resulting drawer is announced with role=\"dialog\" and aria-modal=\"true\".",
    ],
    source: floatingPillSearchSource,
    styles: floatingPillSearchStyles,
  },
  {
    schemaVersion: 1,
    id: "nav.simple-auth-aware",
    name: "Simple Auth-Aware Nav",
    category: "nav",
    description:
      "Minimal left-brand nav with auth-aware actions (Login/Register vs Dashboard/Logout) that expands into an inline accordion menu on mobile instead of an overlay.",
    tags: ["nav", "minimal", "auth", "simple", "accordion"],
    sourceProject: "smartadmissionguide",
    exportName: "SimpleAuthAwareNav",
    fileName: "SimpleAuthAwareNav.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Compass Guide",
      links: [
        { href: "#about", label: "About" },
        { href: "#programs", label: "Programs" },
        { href: "#guidance", label: "Guidance" },
      ],
      currentHref: "#about",
      isLoggedIn: false,
    },
    accessibility: [
      "The mobile menu toggle button announces its state via aria-expanded and aria-controls, and its accessible label switches between \"Open menu\" and \"Close menu\".",
      "The current page link is marked with aria-current=\"page\" in both the desktop and mobile link lists.",
    ],
    source: simpleAuthAwareSource,
    styles: simpleAuthAwareStyles,
  },
  {
    schemaVersion: 1,
    id: "nav.sidebar-drawer-dashboard",
    name: "Sidebar Drawer Dashboard Nav",
    category: "nav",
    description:
      "Persistent app sidebar with collapsible, grouped navigation sections and a user profile footer; collapses into a top bar with an overlay drawer on small screens.",
    tags: ["nav", "sidebar", "dashboard", "admin", "drawer", "grouped"],
    sourceProject: "bandg",
    exportName: "SidebarDrawerDashboardNav",
    fileName: "SidebarDrawerDashboardNav.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Atlas Admin",
      user: { name: "Jordan Ray", role: "admin" },
      groups: [
        {
          group: "Overview",
          defaultOpen: true,
          items: [
            { href: "#dashboard", label: "Dashboard" },
            { href: "#customers", label: "Customers" },
            { href: "#orders", label: "Orders" },
          ],
        },
        {
          group: "Catalog",
          defaultOpen: true,
          items: [
            { href: "#products", label: "Products" },
            { href: "#inventory", label: "Inventory" },
          ],
        },
        {
          group: "Settings",
          items: [
            { href: "#profile", label: "Profile" },
            { href: "#preferences", label: "Preferences" },
          ],
        },
      ],
      activeHref: "#dashboard",
    },
    accessibility: [
      "Each collapsible group header is a real button with aria-expanded reflecting its open or closed state.",
      "The active route link is marked aria-current=\"page\", and the mobile navigation toggle exposes aria-expanded plus aria-controls pointing at the sidebar landmark.",
    ],
    source: sidebarDrawerDashboardSource,
    styles: sidebarDrawerDashboardStyles,
  },
  {
    schemaVersion: 1,
    id: "nav.scroll-hide-minimal",
    name: "Scroll-Hide Minimal Nav",
    category: "nav",
    description:
      "Editorial personal-site nav that hides on scroll-down and reappears on scroll-up, gains a blurred backdrop once scrolled, shows a top scroll-progress bar, and opens a full-screen numbered link overlay on mobile.",
    tags: ["nav", "minimal", "portfolio", "scroll", "overlay", "editorial"],
    sourceProject: "portfolio",
    exportName: "ScrollHideMinimalNav",
    fileName: "ScrollHideMinimalNav.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Studio Nine",
      links: [
        { href: "#home", label: "Home" },
        { href: "#work", label: "Work" },
        { href: "#about", label: "About" },
      ],
      ctaLabel: "Resume",
      ctaHref: "#resume",
    },
    accessibility: [
      "The full-screen mobile menu is a role=\"dialog\" with aria-modal=\"true\" and moves keyboard focus to its close button when it opens.",
      "The hamburger button exposes aria-expanded and aria-controls linking it to the mobile menu it opens.",
    ],
    source: scrollHideMinimalSource,
    styles: scrollHideMinimalStyles,
  },
];
