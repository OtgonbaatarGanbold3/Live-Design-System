"use client";

import {
  Activity,
  BarChart3,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { DesignState } from "@/lib/design-state";
import {
  getPreviewStyles,
  PreviewBadge,
  PreviewButton,
  PreviewCard,
} from "./shared-styles";

interface SaasLandingProps {
  state: DesignState;
}

interface Feature {
  title: string;
  desc: string;
  icon: LucideIcon;
  highlight: string;
}

export function SaasLanding({ state }: SaasLandingProps) {
  const s = getPreviewStyles(state);
  const space = s.helpers.space;

  const stats = [
    { value: "300K+", label: "Active Users", trend: "+12% QoQ" },
    { value: "99.98%", label: "Uptime", trend: "SLA-backed" },
    { value: "1.7B", label: "Events Processed", trend: "+28% this quarter" },
    { value: "150+", label: "Countries", trend: "Multi-region" },
    { value: "4.9/5", label: "Customer Score", trend: "7.2K reviews" },
  ];

  const features: Feature[] = [
    {
      title: "Automated Workflows",
      desc: "Trigger multi-step actions across product, support, and growth from one visual orchestration layer.",
      icon: Zap,
      highlight: "40% faster ops",
    },
    {
      title: "Live Analytics",
      desc: "Realtime dashboards with threshold alerts and drilldowns for product, revenue, and customer success teams.",
      icon: BarChart3,
      highlight: "Sub-second refresh",
    },
    {
      title: "Enterprise Security",
      desc: "Role-aware controls, audit logs, encryption, and policy enforcement for regulated environments.",
      icon: ShieldCheck,
      highlight: "SOC2 + SSO",
    },
    {
      title: "Global Infrastructure",
      desc: "Deploy close to users with resilient failover zones and managed performance optimization.",
      icon: Globe2,
      highlight: "17 regions",
    },
  ];

  const testimonials = [
    {
      quote:
        "We consolidated four tools into one workflow and cut handoffs by half within six weeks.",
      author: "Sarah Chen",
      role: "CTO, TechFlow",
      metric: "3.1x faster delivery",
    },
    {
      quote:
        "Our design and engineering teams finally speak the same language. The preview and export loop is seamless.",
      author: "Marcus Johnson",
      role: "Head of Product, Craft",
      metric: "42% fewer revisions",
    },
    {
      quote:
        "Governance used to block us. Now it is built in, and we can iterate without fear of accessibility regressions.",
      author: "Priya Patel",
      role: "Design Systems Lead, Meridian",
      metric: "100% AA pass rate",
    },
    {
      quote:
        "From onboarding to publish-ready outputs, our first theme shipped in one afternoon.",
      author: "Daniel Ruiz",
      role: "VP Product, Northstar",
      metric: "Under 2h setup",
    },
  ];

  const faqs = [
    {
      q: "How does the free trial work?",
      a: "Start with full access for 14 days. No credit card required. Upgrade only when your team is ready.",
    },
    {
      q: "Can I use this with our existing component library?",
      a: "Yes. Export design tokens, CSS variables, Tailwind extension, and Figma tokens from the same theme source.",
    },
    {
      q: "Do you support role-based approvals?",
      a: "Pro and Enterprise plans include approval workflows, version history, and rollback before publish.",
    },
    {
      q: "How quickly can teams get to a usable theme?",
      a: "Guided setup gets most teams to a valid, exportable baseline in under three minutes.",
    },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$19",
      summary: "Best for solo builders and small teams.",
      features: ["5 projects", "Theme exports", "Basic analytics"],
    },
    {
      name: "Pro",
      price: "$59",
      summary: "Best for scaling product organizations.",
      features: ["Unlimited projects", "Version history", "Advanced constraints", "Priority support"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      summary: "Security, governance, and custom workflows.",
      features: ["SAML/SSO", "Policy controls", "Dedicated success manager", "Custom integrations"],
    },
  ];

  return (
    <div style={s.root} className="preview-reset">
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: space(1),
          padding: `${space(1)}px ${space(2)}px`,
          borderBottom: s.border,
          position: "sticky",
          top: 0,
          background: state.background,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${state.primary}, ${state.accent})`,
              boxShadow: `0 0 0 3px ${state.primary}22`,
            }}
          />
          <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Acme Cloud</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: space(1.5),
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: "0.875rem",
            opacity: 0.85,
          }}
        >
          <a href="#">Product</a>
          <a href="#">Platform</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <PreviewButton state={state} variant="secondary">
            Sign In
          </PreviewButton>
          <PreviewButton state={state} variant="primary">
            Start Free
          </PreviewButton>
        </div>
      </nav>

      <section
        style={{
          padding: `${space(6)}px ${space(2)}px ${space(4)}px`,
          textAlign: "center",
          background: `radial-gradient(circle at 50% -20%, ${state.primary}20, transparent 65%)`,
        }}
      >
        <PreviewBadge state={state} tone="accent">
          <Sparkles size={12} />
          AI Copilot now in workflows
        </PreviewBadge>

        <h1
          style={{
            fontSize: `calc(2.65rem * ${state.typeScale})`,
            fontWeight:
              state.fontWeight === "Light" ? 300 : state.fontWeight === "Bold" ? 700 : 500,
            marginTop: space(1.5),
            marginBottom: space(1),
            lineHeight: s.helpers.lineHeight.tight,
            letterSpacing: -0.4,
          }}
        >
          Build faster.
          <br />
          Launch with confidence.
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            opacity: 0.76,
            maxWidth: 680,
            margin: `0 auto ${space(2)}px`,
            lineHeight: s.helpers.lineHeight.relaxed,
          }}
        >
          The operating system for modern product teams. Design, validate, and ship polished
          experiences from one token-aware workflow.
        </p>

        <div style={{ display: "flex", gap: space(1), justifyContent: "center", flexWrap: "wrap" }}>
          <PreviewButton state={state} variant="primary">
            Start Free Trial
          </PreviewButton>
          <PreviewButton state={state} variant="secondary">
            Book Demo
          </PreviewButton>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: space(1),
            maxWidth: 980,
            margin: `${space(3)}px auto 0`,
          }}
        >
          {stats.map((stat) => (
            <PreviewCard key={stat.label} state={state} variant="subtle" style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: state.primary }}>
                {stat.value}
              </p>
              <p style={{ margin: "4px 0", fontSize: "0.72rem", opacity: 0.65, textTransform: "uppercase", letterSpacing: 1 }}>
                {stat.label}
              </p>
              <p style={{ margin: 0, color: state.accent, fontSize: "0.75rem", fontWeight: 600 }}>
                {stat.trend}
              </p>
            </PreviewCard>
          ))}
        </div>
      </section>

      <section style={{ padding: `0 ${space(2)}px ${space(4)}px` }}>
        <PreviewCard state={state} variant="elevated" style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: space(1),
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>Live Operations Dashboard</h2>
              <p style={{ margin: "4px 0 0", opacity: 0.6, fontSize: "0.8rem" }}>
                Realtime performance, quality, and reliability in one place.
              </p>
            </div>
            <PreviewBadge state={state} tone="success">
              <Activity size={12} />
              System Healthy
            </PreviewBadge>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: space(1),
              marginBottom: space(1),
            }}
          >
            {[
              { label: "Conversion", value: "4.7%", delta: "+0.8%" },
              { label: "Activation", value: "71%", delta: "+6.2%" },
              { label: "Weekly Revenue", value: "$182K", delta: "+13.4%" },
              { label: "Support SLA", value: "98.2%", delta: "+2.0%" },
            ].map((kpi) => (
              <PreviewCard key={kpi.label} state={state} variant="subtle" style={{ padding: space(1) }}>
                <p style={{ margin: 0, opacity: 0.55, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 1 }}>
                  {kpi.label}
                </p>
                <p style={{ margin: "8px 0 4px", fontSize: "1.2rem", fontWeight: 700 }}>{kpi.value}</p>
                <p style={{ margin: 0, color: state.accent, fontSize: "0.75rem", fontWeight: 600 }}>
                  {kpi.delta}
                </p>
              </PreviewCard>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: space(1),
            }}
          >
            <PreviewCard state={state} variant="subtle" style={{ minHeight: 180 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: space(1) }}>
                <p style={{ margin: 0, fontWeight: 600 }}>Engagement Trend</p>
                <TrendingUp size={16} color={state.primary} />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
                  alignItems: "end",
                  gap: 6,
                  height: 108,
                }}
              >
                {[42, 54, 47, 68, 72, 63, 77, 84, 79, 91].map((height, index) => (
                  <div
                    key={index}
                    style={{
                      height: `${height}%`,
                      borderRadius: 6,
                      background: index > 6 ? state.accent : state.primary,
                      opacity: index > 6 ? 0.9 : 0.65,
                    }}
                  />
                ))}
              </div>
            </PreviewCard>

            <PreviewCard state={state} variant="subtle" style={{ minHeight: 180 }}>
              <p style={{ margin: 0, fontWeight: 600, marginBottom: space(1) }}>Recent Improvements</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "A11y score reached 98/100",
                  "Primary flow latency reduced by 28%",
                  "Theme publish pass rate hit 100%",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <CheckCircle2 size={14} color={state.accent} style={{ marginTop: 1 }} />
                    <p style={{ margin: 0, fontSize: "0.8rem", lineHeight: 1.45, opacity: 0.8 }}>{item}</p>
                  </div>
                ))}
              </div>
            </PreviewCard>
          </div>
        </PreviewCard>
      </section>

      <section style={{ padding: `${space(4)}px ${space(2)}px`, background: s.surface.subtle }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontSize: `calc(1.6rem * ${state.typeScale})`, margin: 0, marginBottom: 8 }}>
            Why teams choose Acme
          </h2>
          <p style={{ margin: 0, opacity: 0.7, marginBottom: space(2), maxWidth: 620, lineHeight: s.helpers.lineHeight.relaxed }}>
            Built for speed, governance, and day-two operations. Your system evolves without losing
            consistency or accessibility.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: space(1.25),
            }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <PreviewCard key={feature.title} state={state} variant="base">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        background: s.surface.interactive,
                      }}
                    >
                      <Icon size={16} color={state.primary} />
                    </span>
                    <h3 style={{ margin: 0, fontWeight: 650, fontSize: "1rem" }}>{feature.title}</h3>
                  </div>
                  <p style={{ margin: 0, opacity: 0.72, fontSize: "0.86rem", lineHeight: s.helpers.lineHeight.relaxed }}>
                    {feature.desc}
                  </p>
                  <p style={{ margin: "10px 0 0", color: state.accent, fontWeight: 650, fontSize: "0.78rem" }}>
                    {feature.highlight}
                  </p>
                </PreviewCard>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: `${space(4)}px ${space(2)}px` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: space(2), fontSize: `calc(1.5rem * ${state.typeScale})` }}>
            Trusted by teams shipping at scale
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: space(1.25),
            }}
          >
            {testimonials.map((testimonial, index) => (
              <PreviewCard key={testimonial.author} state={state} variant="subtle">
                <p style={{ margin: 0, lineHeight: s.helpers.lineHeight.relaxed, fontSize: "0.88rem" }}>
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div style={{ marginTop: space(1), display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: index % 2 === 0 ? `${state.primary}2d` : `${state.accent}2d`,
                      color: state.text,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {testimonial.author
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 650, fontSize: "0.84rem" }}>{testimonial.author}</p>
                    <p style={{ margin: 0, opacity: 0.6, fontSize: "0.74rem" }}>{testimonial.role}</p>
                  </div>
                </div>

                <p style={{ margin: `${space(0.75)}px 0 0`, color: state.accent, fontSize: "0.75rem", fontWeight: 600 }}>
                  {testimonial.metric}
                </p>
              </PreviewCard>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: `${space(4)}px ${space(2)}px`, background: s.surface.subtle }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ margin: 0, marginBottom: 8, textAlign: "center", fontSize: `calc(1.35rem * ${state.typeScale})` }}>
            Frequently asked questions
          </h2>
          <p style={{ textAlign: "center", margin: `0 0 ${space(2)}px`, opacity: 0.65 }}>
            Answers to the questions teams ask before switching.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {faqs.map((item, index) => (
              <details
                key={item.q}
                open={index === 0}
                style={{
                  border: s.border,
                  borderRadius: s.helpers.radius(0.9),
                  padding: `${space(1)}px ${space(1.25)}px`,
                  background: state.background,
                }}
              >
                <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>{item.q}</summary>
                <p style={{ margin: `${space(0.75)}px 0 0`, opacity: 0.72, fontSize: "0.84rem", lineHeight: 1.6 }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: `${space(4)}px ${space(2)}px` }}>
        <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: 8, fontSize: `calc(1.6rem * ${state.typeScale})` }}>
          Flexible pricing for every stage
        </h2>
        <p style={{ textAlign: "center", margin: `0 0 ${space(2)}px`, opacity: 0.68 }}>
          Start free, scale as your product system matures.
        </p>

        <div
          style={{
            maxWidth: 1020,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: space(1.25),
          }}
        >
          {pricing.map((tier) => (
            <PreviewCard
              key={tier.name}
              state={state}
              variant={tier.popular ? "elevated" : "base"}
              style={{
                position: "relative",
                background: tier.popular
                  ? `linear-gradient(160deg, ${state.primary}e6 0%, ${state.accent}cc 100%)`
                  : undefined,
                color: tier.popular ? state.background : undefined,
              }}
            >
              {tier.popular && (
                <PreviewBadge
                  state={state}
                  tone="accent"
                  style={{ position: "absolute", top: 12, right: 12, background: `${state.background}29`, color: state.background, borderColor: `${state.background}55` }}
                >
                  Most Popular
                </PreviewBadge>
              )}

              <p style={{ margin: 0, opacity: 0.7, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: 1.1 }}>
                {tier.name}
              </p>
              <p style={{ margin: "8px 0", fontSize: "2rem", fontWeight: 800 }}>{tier.price}</p>
              <p style={{ margin: "0 0 14px", opacity: 0.82, fontSize: "0.84rem", lineHeight: 1.6 }}>{tier.summary}</p>

              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
                {tier.features.map((feature) => (
                  <li key={feature} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem" }}>
                    <CheckCircle2 size={14} color={tier.popular ? state.background : state.accent} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 14 }}>
                <PreviewButton state={state} variant={tier.popular ? "secondary" : "primary"} inverted={tier.popular}>
                  Choose {tier.name}
                </PreviewButton>
              </div>
            </PreviewCard>
          ))}
        </div>
      </section>
    </div>
  );
}