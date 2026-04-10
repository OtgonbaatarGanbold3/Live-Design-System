"use client";

import {
  Heart,
  RefreshCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import type { DesignState } from "@/lib/design-state";
import {
  getPreviewStyles,
  PreviewBadge,
  PreviewButton,
  PreviewCard,
} from "./shared-styles";

interface EcommerceProps {
  state: DesignState;
}

interface Product {
  name: string;
  price: string;
  tag?: string;
  rating: number;
  reviews: number;
  stock: "In Stock" | "Low Stock";
  colors: string[];
  variants: string[];
}

export function Ecommerce({ state }: EcommerceProps) {
  const s = getPreviewStyles(state);
  const space = s.helpers.space;

  const products: Product[] = [
    {
      name: "Minimal Watch",
      price: "$249",
      tag: "New",
      rating: 5,
      reviews: 142,
      stock: "In Stock",
      colors: ["#1f2937", "#d1d5db", "#9ca3af"],
      variants: ["38mm", "42mm"],
    },
    {
      name: "Leather Wallet",
      price: "$89",
      rating: 4,
      reviews: 84,
      stock: "In Stock",
      colors: ["#3f2a1d", "#7c4f2d"],
      variants: ["Classic"],
    },
    {
      name: "Canvas Bag",
      price: "$159",
      tag: "Best Seller",
      rating: 5,
      reviews: 320,
      stock: "Low Stock",
      colors: ["#111827", "#f3f4f6", "#1d4ed8"],
      variants: ["S", "M", "L"],
    },
    {
      name: "Sunglasses",
      price: "$179",
      rating: 4,
      reviews: 96,
      stock: "In Stock",
      colors: ["#111827", "#374151"],
      variants: ["Polarized", "Classic"],
    },
    {
      name: "Ceramic Vase",
      price: "$69",
      rating: 4,
      reviews: 58,
      stock: "Low Stock",
      colors: ["#e5e7eb", "#f5f5f4"],
      variants: ["Small", "Large"],
    },
    {
      name: "Desk Lamp",
      price: "$129",
      tag: "New",
      rating: 5,
      reviews: 211,
      stock: "In Stock",
      colors: ["#18181b", "#fafaf9", "#fde68a"],
      variants: ["Warm", "Neutral"],
    },
  ];

  const categories = [
    { name: "Accessories", count: 24, description: "Daily carry essentials" },
    { name: "Home", count: 18, description: "Objects for calm spaces" },
    { name: "Lifestyle", count: 12, description: "Well-made everyday goods" },
    { name: "Gifting", count: 9, description: "Curated premium sets" },
  ];

  const features = [
    { title: "Free Shipping", desc: "On orders over $100", icon: Truck },
    { title: "Easy Returns", desc: "30-day return policy", icon: RefreshCcw },
    { title: "Secure Checkout", desc: "256-bit encryption", icon: ShieldCheck },
  ];

  const reviews = [
    {
      author: "Sarah M.",
      text: "Beautiful quality and surprisingly premium packaging. Exactly what I expected.",
      rating: 5,
      product: "Minimal Watch",
    },
    {
      author: "James K.",
      text: "Fast shipping and support was genuinely helpful when I changed my order.",
      rating: 5,
      product: "Canvas Bag",
    },
    {
      author: "Mina R.",
      text: "Design is clean and materials feel durable. Will definitely buy again.",
      rating: 4,
      product: "Desk Lamp",
    },
  ];

  return (
    <div style={s.root} className="preview-reset">
      <div
        style={{
          background: state.primary,
          color: state.background,
          textAlign: "center",
          padding: `${space(0.5)}px`,
          fontSize: "0.74rem",
          fontWeight: 600,
          letterSpacing: 0.4,
        }}
      >
        Free shipping on orders over $100 | Use code WELCOME10 for 10% off
      </div>

      <nav
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${space(1)}px ${space(2)}px`,
          borderBottom: s.border,
          background: state.background,
          zIndex: 20,
        }}
      >
        <div style={{ fontWeight: 800, letterSpacing: 2.2 }}>STORE</div>
        <div style={{ display: "flex", gap: space(1.5), fontSize: "0.84rem", opacity: 0.8 }}>
          <a href="#">Shop</a>
          <a href="#">Collections</a>
          <a href="#">Journal</a>
          <a href="#">About</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            style={{
              border: "none",
              background: "transparent",
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
              color: state.text,
            }}
          >
            <Heart size={17} />
          </button>
          <PreviewBadge state={state} tone="accent">
            Cart (3)
          </PreviewBadge>
        </div>
      </nav>

      <section
        style={{
          padding: `${space(5.5)}px ${space(2)}px`,
          background: `linear-gradient(150deg, ${state.primary}16 0%, ${state.accent}16 100%)`,
          textAlign: "center",
        }}
      >
        <PreviewBadge state={state} tone="accent">
          New Collection
        </PreviewBadge>
        <h1
          style={{
            fontSize: `calc(2.65rem * ${state.typeScale})`,
            margin: `${space(1.5)}px 0 8px`,
            lineHeight: s.helpers.lineHeight.tight,
            letterSpacing: -0.6,
          }}
        >
          Spring Essentials
        </h1>
        <p
          style={{
            maxWidth: 560,
            margin: `0 auto ${space(2)}px`,
            opacity: 0.72,
            lineHeight: s.helpers.lineHeight.relaxed,
            fontSize: "0.98rem",
          }}
        >
          Curated modern goods designed to age beautifully. Durable materials, minimal form,
          and everyday comfort.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: space(1), flexWrap: "wrap" }}>
          <PreviewButton state={state} variant="primary">
            Shop Best Sellers
          </PreviewButton>
          <PreviewButton state={state} variant="secondary">
            View Lookbook
          </PreviewButton>
        </div>
      </section>

      <section style={{ padding: `${space(3)}px ${space(2)}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, maxWidth: 1020, margin: "0 auto" }}>
          {categories.map((category, index) => (
            <PreviewCard
              key={category.name}
              state={state}
              variant="subtle"
              style={{
                background: `${[state.primary, state.accent, state.secondary, state.primary][index]}14`,
                textAlign: "left",
              }}
            >
              <p style={{ margin: 0, fontWeight: 650, fontSize: "0.92rem" }}>{category.name}</p>
              <p style={{ margin: "5px 0", opacity: 0.56, fontSize: "0.74rem" }}>{category.description}</p>
              <p style={{ margin: 0, fontSize: "0.72rem", color: state.primary, fontWeight: 650 }}>
                {category.count} products
              </p>
            </PreviewCard>
          ))}
        </div>
      </section>

      <section style={{ padding: `${space(2)}px ${space(2)}px ${space(4)}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1080, margin: `0 auto ${space(1.5)}px` }}>
          <h2 style={{ margin: 0, fontSize: `calc(1.45rem * ${state.typeScale})` }}>Featured products</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <PreviewBadge state={state} tone="neutral">All</PreviewBadge>
            <PreviewBadge state={state} tone="accent">Best sellers</PreviewBadge>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: space(1.25),
          }}
        >
          {products.map((product, index) => (
            <PreviewCard key={product.name} state={state} variant="base" style={{ padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  aspectRatio: "1 / 1",
                  background: `linear-gradient(145deg, ${[state.primary, state.accent, state.secondary, state.primary, state.accent, state.secondary][index]}20 0%, ${state.background} 75%)`,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {product.tag && (
                  <PreviewBadge state={state} tone="accent" style={{ position: "absolute", top: 10, left: 10 }}>
                    {product.tag}
                  </PreviewBadge>
                )}

                {product.stock === "Low Stock" && (
                  <PreviewBadge state={state} tone="primary" style={{ position: "absolute", top: 10, right: 10 }}>
                    Low stock
                  </PreviewBadge>
                )}

                <div
                  style={{
                    width: "56%",
                    height: "56%",
                    borderRadius: Math.max(12, state.borderRadius),
                    border: `1px solid ${state.secondary}40`,
                    background: `${state.background}c9`,
                    boxShadow: "0 14px 28px rgba(0,0,0,0.14)",
                  }}
                />
              </div>

              <div style={{ padding: space(1) }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "0.98rem" }}>{product.name}</h3>
                    <p style={{ margin: "4px 0 0", color: state.primary, fontWeight: 700 }}>{product.price}</p>
                  </div>
                  <button
                    type="button"
                    style={{
                      border: `1px solid ${state.secondary}40`,
                      background: "transparent",
                      borderRadius: 999,
                      width: 28,
                      height: 28,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: state.text,
                      cursor: "pointer",
                    }}
                  >
                    <Heart size={13} />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 8 }}>
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={12}
                      color={starIndex < product.rating ? state.accent : `${state.secondary}55`}
                      fill={starIndex < product.rating ? state.accent : "none"}
                    />
                  ))}
                  <span style={{ marginLeft: 6, fontSize: "0.72rem", opacity: 0.6 }}>({product.reviews})</span>
                </div>

                <div style={{ marginTop: 9, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", opacity: 0.6 }}>Colors:</span>
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: color,
                        border: "1px solid rgba(0,0,0,0.16)",
                      }}
                    />
                  ))}
                </div>

                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {product.variants.map((variant) => (
                    <PreviewBadge key={variant} state={state} tone="neutral" style={{ fontSize: "0.62rem" }}>
                      {variant}
                    </PreviewBadge>
                  ))}
                </div>

                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", color: product.stock === "Low Stock" ? state.accent : state.primary, fontWeight: 650 }}>
                    {product.stock}
                  </span>
                  <PreviewButton state={state} variant="primary">
                    Add to Cart
                  </PreviewButton>
                </div>
              </div>
            </PreviewCard>
          ))}
        </div>
      </section>

      <section style={{ padding: `${space(2.5)}px ${space(2)}px`, borderTop: s.border, borderBottom: s.border }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: space(1.25) }}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <PreviewCard key={feature.title} state={state} variant="subtle" style={{ textAlign: "center", padding: space(1) }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${state.primary}1e`,
                    marginBottom: 8,
                  }}
                >
                  <Icon size={15} color={state.primary} />
                </span>
                <p style={{ margin: 0, fontWeight: 650, fontSize: "0.84rem" }}>{feature.title}</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.76rem", opacity: 0.62 }}>{feature.desc}</p>
              </PreviewCard>
            );
          })}
        </div>
      </section>

      <section style={{ padding: `${space(3)}px ${space(2)}px ${space(4)}px` }}>
        <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: 8, fontSize: `calc(1.3rem * ${state.typeScale})` }}>
          What customers say
        </h2>
        <p style={{ textAlign: "center", margin: `0 0 ${space(1.5)}px`, opacity: 0.66, fontSize: "0.84rem" }}>
          Verified reviews from recent orders.
        </p>

        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: space(1.25) }}>
          {reviews.map((review, index) => (
            <PreviewCard key={review.author} state={state} variant="subtle">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={12}
                      color={starIndex < review.rating ? state.accent : `${state.secondary}60`}
                      fill={starIndex < review.rating ? state.accent : "none"}
                    />
                  ))}
                </div>
                <PreviewBadge state={state} tone="neutral" style={{ fontSize: "0.62rem" }}>
                  {review.product}
                </PreviewBadge>
              </div>

              <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.78, fontSize: "0.84rem" }}>
                &ldquo;{review.text}&rdquo;
              </p>

              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: index % 2 === 0 ? `${state.primary}2c` : `${state.accent}2c`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                >
                  {review.author
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>{review.author}</span>
              </div>
            </PreviewCard>
          ))}
        </div>
      </section>
    </div>
  );
}