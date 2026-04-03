"use client";

import type { DesignState } from "@/lib/design-state";
import { getPreviewStyles, PreviewButton } from "./shared-styles";

interface EcommerceProps {
  state: DesignState;
}

export function Ecommerce({ state }: EcommerceProps) {
  const s = getPreviewStyles(state);

  const products = [
    { name: "Minimal Watch", price: "$249", tag: "New" },
    { name: "Leather Wallet", price: "$89", tag: null },
    { name: "Canvas Bag", price: "$159", tag: "Best Seller" },
    { name: "Sunglasses", price: "$179", tag: null },
    { name: "Ceramic Vase", price: "$69", tag: null },
    { name: "Desk Lamp", price: "$129", tag: "New" },
  ];

  const categories = [
    { name: "Accessories", count: 24 },
    { name: "Home", count: 18 },
    { name: "Lifestyle", count: 12 },
  ];

  const features = [
    { title: "Free Shipping", desc: "On orders over $100" },
    { title: "Easy Returns", desc: "30-day return policy" },
    { title: "Secure Payment", desc: "256-bit SSL encryption" },
  ];

  const reviews = [
    { author: "Sarah M.", text: "Beautiful quality, exactly as pictured. Will order again!", rating: 5 },
    { author: "James K.", text: "Fast shipping and excellent customer service.", rating: 5 },
  ];

  return (
    <div style={s.root} className="preview-reset">
      {/* Announcement Bar */}
      <div
        style={{
          background: state.primary,
          color: state.background,
          textAlign: "center",
          padding: `${state.baseSpacing / 2}px`,
          fontSize: "0.75rem",
          fontWeight: 500,
        }}
      >
        Free shipping on orders over $100 | Use code WELCOME10 for 10% off
      </div>

      {/* Sticky Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${state.baseSpacing}px ${state.baseSpacing * 2}px`,
          borderBottom: s.border,
          background: state.preset === "Glassmorphism" ? "rgba(255,255,255,0.1)" : state.background,
          backdropFilter: state.preset === "Glassmorphism" ? "blur(10px)" : undefined,
          zIndex: 10,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: 2 }}>STORE</div>
        <div style={{ display: "flex", gap: state.baseSpacing * 2, fontSize: "0.875rem", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#" style={{ opacity: 0.8 }}>Shop</a>
          <a href="#" style={{ opacity: 0.8 }}>Collections</a>
          <a href="#" style={{ opacity: 0.8 }}>About</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: state.baseSpacing }}>
          <button style={{ background: "none", border: "none", color: state.text, cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button style={{ background: "none", border: "none", color: state.text, cursor: "pointer", position: "relative" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: state.primary,
                color: state.background,
                fontSize: "0.625rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
              }}
            >
              3
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <section
        style={{
          padding: `${state.baseSpacing * 6}px ${state.baseSpacing * 2}px`,
          background: `linear-gradient(135deg, ${state.primary}10 0%, ${state.accent}10 100%)`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: `${state.baseSpacing / 4}px ${state.baseSpacing}px`,
            background: `${state.accent}20`,
            color: state.accent,
            borderRadius: state.borderRadius * 2,
            fontSize: "0.75rem",
            fontWeight: 600,
            marginBottom: state.baseSpacing,
          }}
        >
          New Collection
        </span>
        <h1
          style={{
            fontSize: `calc(2.5rem * ${state.typeScale})`,
            fontWeight: state.fontWeight === "Light" ? 300 : state.fontWeight === "Bold" ? 700 : 400,
            marginBottom: state.baseSpacing,
            lineHeight: 1.1,
          }}
        >
          Spring Essentials
        </h1>
        <p style={{ opacity: 0.6, maxWidth: 450, marginLeft: "auto", marginRight: "auto", marginTop: 0, marginBottom: state.baseSpacing * 2, lineHeight: 1.6 }}>
          Discover our curated selection of minimalist products designed for modern living.
        </p>
        <div style={{ display: "flex", gap: state.baseSpacing, justifyContent: "center" }}>
          <PreviewButton state={state} variant="primary">Shop Now</PreviewButton>
          <PreviewButton state={state} variant="secondary">View Lookbook</PreviewButton>
        </div>
      </section>

      {/* Category Cards */}
      <section style={{ padding: `${state.baseSpacing * 3}px ${state.baseSpacing * 2}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: state.baseSpacing * 1.5 }}>
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              style={{
                padding: state.baseSpacing * 2,
                borderRadius: state.borderRadius,
                background: `${[state.primary, state.accent, state.secondary][i]}10`,
                border: s.border,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: 4 }}>{cat.name}</h3>
              <p style={{ fontSize: "0.75rem", opacity: 0.5 }}>{cat.count} products</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section style={{ padding: `${state.baseSpacing * 3}px ${state.baseSpacing * 2}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: state.baseSpacing * 2 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Featured Products</h2>
          <div style={{ display: "flex", gap: state.baseSpacing, fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 600 }}>All</span>
            <span style={{ opacity: 0.5 }}>New</span>
            <span style={{ opacity: 0.5 }}>Best Sellers</span>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: state.baseSpacing * 2,
          }}
        >
          {products.map((product) => (
            <div
              key={product.name}
              style={{
                background: state.preset === "Glassmorphism" ? "rgba(255,255,255,0.05)" : `${state.secondary}05`,
                borderRadius: state.borderRadius,
                border: s.border,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  aspectRatio: "1",
                  background: `${state.secondary}10`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {product.tag && (
                  <span
                    style={{
                      position: "absolute",
                      top: state.baseSpacing,
                      left: state.baseSpacing,
                      padding: `2px ${state.baseSpacing / 2}px`,
                      background: product.tag === "New" ? state.accent : state.primary,
                      color: state.background,
                      fontSize: "0.625rem",
                      fontWeight: 600,
                      borderRadius: 4,
                      textTransform: "uppercase",
                    }}
                  >
                    {product.tag}
                  </span>
                )}
                <div
                  style={{
                    width: "50%",
                    height: "50%",
                    background: `${state.primary}15`,
                    borderRadius: state.borderRadius,
                  }}
                />
              </div>
              <div style={{ padding: state.baseSpacing }}>
                <h3 style={{ fontWeight: 500, marginBottom: 4, fontSize: "0.9375rem" }}>{product.name}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: state.primary }}>{product.price}</span>
                  <button
                    style={{
                      background: state.buttonStyle === "Filled" ? state.primary : "transparent",
                      color: state.buttonStyle === "Filled" ? state.background : state.primary,
                      border: state.buttonStyle === "Outline" ? `1px solid ${state.primary}` : "none",
                      padding: `${state.baseSpacing / 4}px ${state.baseSpacing}px`,
                      borderRadius: state.borderRadius,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: state.baseSpacing * 2 }}>
          <PreviewButton state={state} variant="secondary">View All Products</PreviewButton>
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          padding: `${state.baseSpacing * 3}px ${state.baseSpacing * 2}px`,
          borderTop: s.border,
          borderBottom: s.border,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: state.baseSpacing * 2 }}>
          {features.map((feature, i) => (
            <div key={feature.title} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `${[state.primary, state.accent, state.secondary][i]}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: state.baseSpacing,
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: [state.primary, state.accent, state.secondary][i] }} />
              </div>
              <h4 style={{ fontWeight: 600, marginBottom: 4, fontSize: "0.875rem" }}>{feature.title}</h4>
              <p style={{ fontSize: "0.75rem", opacity: 0.5 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section style={{ padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px` }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, textAlign: "center", marginBottom: state.baseSpacing * 2 }}>
          What Our Customers Say
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: state.baseSpacing * 2, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
          {reviews.map((review, i) => (
            <div
              key={i}
              style={{
                padding: state.baseSpacing * 1.5,
                borderRadius: state.borderRadius,
                background: state.preset === "Glassmorphism" ? "rgba(255,255,255,0.05)" : `${state.secondary}05`,
                border: s.border,
              }}
            >
              <div style={{ marginBottom: state.baseSpacing, color: state.accent }}>
                {"★".repeat(review.rating)}
              </div>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.6, marginBottom: state.baseSpacing, opacity: 0.8 }}>
                &ldquo;{review.text}&rdquo;
              </p>
              <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{review.author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section
        style={{
          padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px`,
          background: `linear-gradient(135deg, ${state.accent}10 0%, ${state.primary}10 100%)`,
          textAlign: "center",
        }}
      >
        <h3 style={{ fontWeight: 600, marginBottom: state.baseSpacing / 2 }}>Join our newsletter</h3>
        <p style={{ opacity: 0.6, fontSize: "0.875rem", marginBottom: state.baseSpacing * 1.5 }}>
          Get 10% off your first order and stay updated on new arrivals.
        </p>
        <div style={{ display: "flex", gap: state.baseSpacing, justifyContent: "center", maxWidth: 400, marginLeft: "auto", marginRight: "auto", flexWrap: "wrap" }}>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              flex: 1,
              padding: `${state.baseSpacing / 2}px ${state.baseSpacing}px`,
              borderRadius: state.borderRadius,
              border: s.border,
              background: state.background,
              color: state.text,
              fontFamily: "inherit",
            }}
          />
          <PreviewButton state={state} variant="primary">Subscribe</PreviewButton>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: `${state.baseSpacing * 3}px ${state.baseSpacing * 2}px`,
          borderTop: s.border,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: state.baseSpacing * 3,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: state.baseSpacing, letterSpacing: 2 }}>STORE</div>
          <p style={{ opacity: 0.5, fontSize: "0.875rem", lineHeight: 1.6 }}>
            Thoughtfully designed products for everyday life. Quality you can feel.
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: state.baseSpacing, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, opacity: 0.5 }}>Shop</div>
          <div style={{ display: "flex", flexDirection: "column", gap: state.baseSpacing / 2, fontSize: "0.875rem" }}>
            <a href="#" style={{ opacity: 0.7 }}>All Products</a>
            <a href="#" style={{ opacity: 0.7 }}>New Arrivals</a>
            <a href="#" style={{ opacity: 0.7 }}>Best Sellers</a>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: state.baseSpacing, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, opacity: 0.5 }}>Help</div>
          <div style={{ display: "flex", flexDirection: "column", gap: state.baseSpacing / 2, fontSize: "0.875rem" }}>
            <a href="#" style={{ opacity: 0.7 }}>FAQs</a>
            <a href="#" style={{ opacity: 0.7 }}>Shipping</a>
            <a href="#" style={{ opacity: 0.7 }}>Returns</a>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: state.baseSpacing, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, opacity: 0.5 }}>Follow</div>
          <div style={{ display: "flex", flexDirection: "column", gap: state.baseSpacing / 2, fontSize: "0.875rem" }}>
            <a href="#" style={{ opacity: 0.7 }}>Instagram</a>
            <a href="#" style={{ opacity: 0.7 }}>Twitter</a>
            <a href="#" style={{ opacity: 0.7 }}>Pinterest</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
