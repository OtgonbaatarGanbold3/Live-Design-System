"use client";

import type { DesignState } from "@/lib/design-state";
import { getPreviewStyles, PreviewButton } from "./shared-styles";

interface SaasLandingProps {
  state: DesignState;
}

export function SaasLanding({ state }: SaasLandingProps) {
  const s = getPreviewStyles(state);

  const stats = [
    { value: "300K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Countries" },
  ];

  const testimonials = [
    {
      quote: "This tool completely transformed our workflow. We shipped 3x faster within the first month.",
      author: "Sarah Chen",
      role: "CTO at TechFlow",
    },
    {
      quote: "The most intuitive design system I&apos;ve ever used. Our team was productive from day one.",
      author: "Marcus Johnson",
      role: "Design Lead at Craft",
    },
  ];

  const faqs = [
    {
      q: "How does the free trial work?",
      a: "Start with full access for 14 days. No credit card required. Cancel anytime.",
    },
    {
      q: "Can I upgrade or downgrade later?",
      a: "Absolutely. Change your plan at any time from your dashboard. Changes apply immediately.",
    },
    {
      q: "Is there a limit on team members?",
      a: "Starter allows 5 members, Pro is unlimited, and Enterprise includes SSO for your whole org.",
    },
  ];

  return (
    <div style={s.root} className="preview-reset">
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${state.baseSpacing}px ${state.baseSpacing * 2}px`,
          borderBottom: s.border,
          position: "sticky",
          top: 0,
          background: state.background,
          zIndex: 10,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>Acme Inc</div>
        <div style={{ display: "flex", gap: state.baseSpacing * 2, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#" style={{ opacity: 0.8 }}>Features</a>
          <a href="#" style={{ opacity: 0.8 }}>Pricing</a>
          <a href="#" style={{ opacity: 0.8 }}>About</a>
        </div>
        <PreviewButton state={state} variant="primary">Get Started</PreviewButton>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: `${state.baseSpacing * 6}px ${state.baseSpacing * 2}px`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: `${state.baseSpacing / 2}px ${state.baseSpacing}px`,
            borderRadius: state.borderRadius * 2,
            background: `${state.primary}15`,
            color: state.primary,
            fontSize: "0.75rem",
            fontWeight: 600,
            marginBottom: state.baseSpacing,
          }}
        >
          NEW: AI-Powered Insights
        </div>
        <h1
          style={{
            fontSize: `calc(2.5rem * ${state.typeScale})`,
            fontWeight: state.fontWeight === "Light" ? 300 : state.fontWeight === "Bold" ? 700 : 400,
            marginBottom: state.baseSpacing,
            lineHeight: 1.1,
          }}
        >
          Build faster, ship smarter
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            opacity: 0.7,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 0,
            marginBottom: state.baseSpacing * 2,
            lineHeight: 1.6,
          }}
        >
          The all-in-one platform for modern teams. Streamline your workflow and deliver exceptional results.
        </p>
        <div style={{ display: "flex", gap: state.baseSpacing, justifyContent: "center", flexWrap: "wrap" }}>
          <PreviewButton state={state} variant="primary">Start Free Trial</PreviewButton>
          <PreviewButton state={state} variant="secondary">Watch Demo</PreviewButton>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: state.baseSpacing * 4,
            marginTop: state.baseSpacing * 4,
            paddingTop: state.baseSpacing * 2,
            borderTop: s.border,
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: `calc(1.5rem * ${state.typeScale})`, fontWeight: 700, color: state.primary }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section style={{ padding: `0 ${state.baseSpacing * 2}px ${state.baseSpacing * 4}px` }}>
        <div
          style={{
            background: state.preset === "Glassmorphism" ? "rgba(255,255,255,0.1)" : `${state.secondary}10`,
            borderRadius: state.borderRadius,
            padding: state.baseSpacing * 2,
            border: s.border,
            maxWidth: 900,
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: s.shadow,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: state.baseSpacing }}>
            <div style={{ height: 60, background: `${state.primary}20`, borderRadius: state.borderRadius / 2 }} />
            <div style={{ height: 60, background: `${state.accent}20`, borderRadius: state.borderRadius / 2 }} />
            <div style={{ height: 60, background: `${state.secondary}20`, borderRadius: state.borderRadius / 2 }} />
          </div>
          <div style={{ marginTop: state.baseSpacing, display: "flex", gap: state.baseSpacing, flexWrap: "wrap" }}>
            <div style={{ flex: 2, height: 140, background: `${state.primary}10`, borderRadius: state.borderRadius / 2 }} />
            <div style={{ flex: 1, height: 140, background: `${state.secondary}10`, borderRadius: state.borderRadius / 2 }} />
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section style={{ padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px`, background: `${state.secondary}05` }}>
        <h2
          style={{
            fontSize: `calc(1.5rem * ${state.typeScale})`,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: state.baseSpacing / 2,
          }}
        >
          Why choose us?
        </h2>
        <p style={{ textAlign: "center", opacity: 0.6, marginBottom: state.baseSpacing * 3, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          Everything you need to build, ship, and scale.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: state.baseSpacing * 2, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          {[
            { title: "Lightning Fast", desc: "Optimized for speed. Your users will notice the difference." },
            { title: "Secure by Default", desc: "Enterprise-grade security with zero configuration needed." },
            { title: "Scale Infinitely", desc: "From startup to enterprise, we grow with you seamlessly." },
          ].map((feature, i) => (
            <div
              key={feature.title}
              style={{
                background: state.preset === "Glassmorphism" ? "rgba(255,255,255,0.1)" : state.background,
                padding: state.baseSpacing * 2,
                borderRadius: state.borderRadius,
                border: s.border,
                boxShadow: s.shadow,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: state.borderRadius,
                  background: `${[state.primary, state.accent, state.secondary][i]}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: state.baseSpacing,
                }}
              >
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: [state.primary, state.accent, state.secondary][i] }} />
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: state.baseSpacing / 2 }}>{feature.title}</h3>
              <p style={{ opacity: 0.7, fontSize: "0.875rem", lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px` }}>
        <h2
          style={{
            fontSize: `calc(1.5rem * ${state.typeScale})`,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: state.baseSpacing * 3,
          }}
        >
          Loved by teams worldwide
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: state.baseSpacing * 2, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: state.preset === "Glassmorphism" ? "rgba(255,255,255,0.1)" : `${state.secondary}08`,
                padding: state.baseSpacing * 2,
                borderRadius: state.borderRadius,
                border: s.border,
              }}
            >
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: state.baseSpacing * 1.5, fontStyle: "italic" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: state.baseSpacing }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `${state.primary}30`,
                  }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{t.author}</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px`, background: `${state.secondary}05` }}>
        <h2
          style={{
            fontSize: `calc(1.5rem * ${state.typeScale})`,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: state.baseSpacing / 2,
          }}
        >
          Simple, transparent pricing
        </h2>
        <p style={{ textAlign: "center", opacity: 0.6, marginBottom: state.baseSpacing * 3 }}>
          No hidden fees. Cancel anytime.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: state.baseSpacing * 2, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          {[
            { name: "Starter", price: "$9", features: ["5 projects", "10GB storage", "Basic support"] },
            { name: "Pro", price: "$29", features: ["Unlimited projects", "100GB storage", "Priority support", "Advanced analytics"], popular: true },
            { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Custom integrations", "24/7 support", "SSO & compliance"] },
          ].map((tier) => (
            <div
              key={tier.name}
              style={{
                background: tier.popular ? state.primary : state.preset === "Glassmorphism" ? "rgba(255,255,255,0.1)" : state.background,
                color: tier.popular ? state.background : state.text,
                padding: state.baseSpacing * 2,
                borderRadius: state.borderRadius,
                border: tier.popular ? "none" : s.border,
                boxShadow: tier.popular ? `0 8px 32px ${state.primary}40` : s.shadow,
                textAlign: "center",
                position: "relative",
              }}
            >
              {tier.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: state.accent,
                    color: state.background,
                    padding: `4px ${state.baseSpacing}px`,
                    borderRadius: state.borderRadius,
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Most Popular
                </div>
              )}
              <h3 style={{ fontWeight: 600, marginBottom: state.baseSpacing / 2 }}>{tier.name}</h3>
              <div style={{ fontSize: `calc(2rem * ${state.typeScale})`, fontWeight: 700, marginBottom: state.baseSpacing }}>
                {tier.price}
                <span style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.7 }}>/mo</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: state.baseSpacing * 1.5, textAlign: "left" }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ padding: `${state.baseSpacing / 2}px 0`, opacity: 0.8, fontSize: "0.875rem" }}>
                    <span style={{ marginRight: 8, color: tier.popular ? state.background : state.accent }}>&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <PreviewButton state={state} variant={tier.popular ? "secondary" : "primary"} inverted={tier.popular}>
                Get Started
              </PreviewButton>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px` }}>
        <h2
          style={{
            fontSize: `calc(1.5rem * ${state.typeScale})`,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: state.baseSpacing * 3,
          }}
        >
          Frequently Asked Questions
        </h2>
        <div style={{ maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                padding: `${state.baseSpacing * 1.5}px 0`,
                borderBottom: i < faqs.length - 1 ? s.border : "none",
              }}
            >
              <h4 style={{ fontWeight: 600, marginBottom: state.baseSpacing / 2 }}>{faq.q}</h4>
              <p style={{ opacity: 0.7, fontSize: "0.875rem", lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px`,
          background: `linear-gradient(135deg, ${state.primary}15 0%, ${state.accent}15 100%)`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: `calc(1.5rem * ${state.typeScale})`,
            fontWeight: 700,
            marginBottom: state.baseSpacing,
          }}
        >
          Ready to get started?
        </h2>
        <p style={{ opacity: 0.7, marginBottom: state.baseSpacing * 2, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
          Join thousands of teams building better products with Acme.
        </p>
        <PreviewButton state={state} variant="primary">Start Your Free Trial</PreviewButton>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: `${state.baseSpacing * 2}px`,
          borderTop: s.border,
          textAlign: "center",
          opacity: 0.6,
          fontSize: "0.875rem",
        }}
      >
        &copy; 2026 Acme Inc. All rights reserved.
      </footer>
    </div>
  );
}
