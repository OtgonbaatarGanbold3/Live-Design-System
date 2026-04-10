"use client";

import {
  ArrowRight,
  Compass,
  Megaphone,
  Palette,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { DesignState } from "@/lib/design-state";
import {
  getPreviewStyles,
  PreviewBadge,
  PreviewButton,
  PreviewCard,
} from "./shared-styles";

interface AgencyProps {
  state: DesignState;
}

interface Service {
  title: string;
  desc: string;
  icon: LucideIcon;
  outcomes: string[];
}

export function Agency({ state }: AgencyProps) {
  const s = getPreviewStyles(state);
  const space = s.helpers.space;

  const clients = [
    { name: "ACME", industry: "SaaS" },
    { name: "STARK", industry: "Hardware" },
    { name: "WAYNE", industry: "Enterprise" },
    { name: "OSCORP", industry: "Healthcare" },
    { name: "UMBRELLA", industry: "Consumer" },
    { name: "LEXCORP", industry: "Finance" },
  ];

  const services: Service[] = [
    {
      title: "Brand Strategy",
      desc: "Clarify positioning, narrative, and category differentiation for ambitious teams.",
      icon: Compass,
      outcomes: ["Category map", "Messaging architecture", "Go-to-market narrative"],
    },
    {
      title: "Digital Design",
      desc: "Design product and campaign experiences that balance clarity, speed, and emotion.",
      icon: Palette,
      outcomes: ["Responsive systems", "Prototype validation", "Design governance"],
    },
    {
      title: "Growth Marketing",
      desc: "Build measurable acquisition and retention loops across paid, owned, and lifecycle channels.",
      icon: Megaphone,
      outcomes: ["Funnel optimization", "Experiment roadmap", "Creative testing"],
    },
  ];

  const team = [
    { name: "Sarah Chen", role: "Creative Director", focus: "Brand & narrative systems" },
    { name: "Marcus Johnson", role: "Design Director", focus: "Product and interaction quality" },
    { name: "Emma Wilson", role: "Strategy Lead", focus: "Positioning and GTM alignment" },
    { name: "David Park", role: "Technology Lead", focus: "Front-end and platform delivery" },
  ];

  const stats = [
    { value: "180+", label: "Projects Delivered", trend: "+19 this year" },
    { value: "96%", label: "Client Retention", trend: "7-year avg" },
    { value: "44", label: "Awards Won", trend: "Global juries" },
    { value: "23", label: "Markets Served", trend: "Across 4 regions" },
  ];

  const caseStudies = [
    {
      title: "TechCorp Rebrand",
      category: "Brand Transformation",
      result: "+340% aided recognition",
      summary: "Unified product story and visual language across 11 business units.",
    },
    {
      title: "FinApp Launch",
      category: "Product + Growth",
      result: "2M downloads in 3 months",
      summary: "Designed launch journey, onboarding experience, and activation campaigns.",
    },
    {
      title: "Aether Commerce",
      category: "E-commerce Experience",
      result: "+29% checkout conversion",
      summary: "Rebuilt purchase flow and merchandising system for mobile-first shoppers.",
    },
    {
      title: "Pulse Healthcare",
      category: "Service Platform",
      result: "-42% support tickets",
      summary: "Introduced self-serve UX and content model for patient care workflows.",
    },
  ];

  return (
    <div style={s.root} className="preview-reset">
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${space(1)}px ${space(2)}px`,
          borderBottom: s.border,
          position: "sticky",
          top: 0,
          background: state.background,
          zIndex: 20,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: 1.8 }}>A•GENCY</div>
        <div style={{ display: "flex", gap: space(1.5), fontSize: "0.84rem", opacity: 0.78 }}>
          <a href="#">Work</a>
          <a href="#">Services</a>
          <a href="#">Team</a>
          <a href="#">Contact</a>
        </div>
        <PreviewButton state={state} variant="primary">
          Start a Project
        </PreviewButton>
      </nav>

      <section
        style={{
          padding: `${space(6)}px ${space(2)}px ${space(4)}px`,
          background: `radial-gradient(circle at 12% 5%, ${state.accent}24, transparent 45%)`,
        }}
      >
        <PreviewBadge state={state} tone="accent">
          <Sparkles size={12} />
          Booking Q3 strategy sprints
        </PreviewBadge>

        <h1
          style={{
            fontSize: `calc(3.2rem * ${state.typeScale})`,
            lineHeight: s.helpers.lineHeight.tight,
            letterSpacing: -0.8,
            marginTop: space(1.5),
            marginBottom: 12,
            maxWidth: 860,
          }}
        >
          We build brand systems that move markets.
        </h1>
        <p
          style={{
            maxWidth: 700,
            opacity: 0.7,
            margin: 0,
            fontSize: "1rem",
            lineHeight: s.helpers.lineHeight.relaxed,
          }}
        >
          Strategy, design, and delivery under one operating model. We help ambitious teams turn
          direction into execution with measurable business impact.
        </p>

        <div style={{ marginTop: space(2), display: "flex", gap: space(1), flexWrap: "wrap" }}>
          <PreviewButton state={state} variant="primary">
            Start a Project
          </PreviewButton>
          <PreviewButton state={state} variant="secondary">
            View Case Studies
          </PreviewButton>
        </div>

        <div
          style={{
            marginTop: space(3),
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 10,
            maxWidth: 980,
          }}
        >
          {stats.map((stat) => (
            <PreviewCard key={stat.label} state={state} variant="subtle" style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "1.35rem", fontWeight: 760, color: state.primary }}>{stat.value}</p>
              <p style={{ margin: "4px 0", fontSize: "0.72rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: 1 }}>
                {stat.label}
              </p>
              <p style={{ margin: 0, color: state.accent, fontWeight: 650, fontSize: "0.74rem" }}>{stat.trend}</p>
            </PreviewCard>
          ))}
        </div>
      </section>

      <section style={{ padding: `0 ${space(2)}px ${space(3)}px` }}>
        <p style={{ textAlign: "center", margin: `0 0 ${space(1)}px`, fontSize: "0.74rem", opacity: 0.52, letterSpacing: 1.3, textTransform: "uppercase" }}>
          Trusted by growth-stage and enterprise teams
        </p>

        <div
          style={{
            maxWidth: 1020,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 10,
          }}
        >
          {clients.map((client) => (
            <PreviewCard key={client.name} state={state} variant="subtle" style={{ textAlign: "center", padding: space(1) }}>
              <p style={{ margin: 0, fontWeight: 700, letterSpacing: 1.2, fontSize: "0.82rem" }}>{client.name}</p>
              <p style={{ margin: "5px 0 0", opacity: 0.58, fontSize: "0.7rem" }}>{client.industry}</p>
            </PreviewCard>
          ))}
        </div>
      </section>

      <section style={{ padding: `${space(3)}px ${space(2)}px` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: `calc(1.55rem * ${state.typeScale})` }}>Core services</h2>
          <p style={{ margin: `0 0 ${space(2)}px`, opacity: 0.68, maxWidth: 620, lineHeight: s.helpers.lineHeight.relaxed, fontSize: "0.88rem" }}>
            Full-funnel capabilities that align strategy, product quality, and growth outcomes.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: space(1.25),
            }}
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <PreviewCard key={service.title} state={state} variant="base">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `${state.primary}22`,
                      }}
                    >
                      <Icon size={16} color={state.primary} />
                    </span>
                    <h3 style={{ margin: 0, fontWeight: 650, fontSize: "1rem" }}>{service.title}</h3>
                  </div>

                  <p style={{ margin: 0, opacity: 0.72, fontSize: "0.84rem", lineHeight: 1.65 }}>{service.desc}</p>

                  <ul style={{ margin: `${space(1)}px 0 0`, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.78rem", opacity: 0.78 }}>
                        <ShieldCheck size={13} color={state.accent} />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </PreviewCard>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: `${space(3)}px ${space(2)}px`, background: s.surface.subtle }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: space(1), marginBottom: space(1.5) }}>
            <h2 style={{ margin: 0, fontSize: `calc(1.55rem * ${state.typeScale})` }}>Featured work</h2>
            <button
              type="button"
              style={{
                border: "none",
                background: "transparent",
                color: state.primary,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 650,
                fontSize: "0.84rem",
                cursor: "pointer",
              }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: space(1.25) }}>
            {caseStudies.map((study, index) => (
              <PreviewCard
                key={study.title}
                state={state}
                variant="elevated"
                style={{
                  background: `linear-gradient(145deg, ${[state.primary, state.accent, state.secondary, state.primary][index]}18 0%, ${state.background} 60%)`,
                }}
              >
                <PreviewBadge state={state} tone="neutral" style={{ marginBottom: 10 }}>
                  {study.category}
                </PreviewBadge>
                <h3 style={{ margin: 0, marginBottom: 8, fontSize: "1.05rem", lineHeight: 1.35 }}>{study.title}</h3>
                <p style={{ margin: 0, opacity: 0.72, lineHeight: 1.6, fontSize: "0.82rem" }}>{study.summary}</p>

                <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: state.accent, fontWeight: 700, fontSize: "0.78rem" }}>{study.result}</span>
                  <TrendingUp size={14} color={state.primary} />
                </div>
              </PreviewCard>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: `${space(3)}px ${space(2)}px ${space(4)}px` }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: `calc(1.45rem * ${state.typeScale})` }}>Team</h2>
          <p style={{ margin: `0 0 ${space(1.5)}px`, opacity: 0.68, maxWidth: 540, lineHeight: 1.7, fontSize: "0.86rem" }}>
            Senior multidisciplinary crew across strategy, design, and implementation.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: space(1.25) }}>
            {team.map((member, index) => (
              <PreviewCard key={member.name} state={state} variant="base">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: index % 2 === 0 ? `${state.primary}2d` : `${state.accent}2d`,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    {member.name
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 650, fontSize: "0.86rem" }}>{member.name}</p>
                    <p style={{ margin: "3px 0 0", opacity: 0.64, fontSize: "0.74rem" }}>{member.role}</p>
                  </div>
                </div>
                <p style={{ margin: 0, opacity: 0.72, fontSize: "0.8rem", lineHeight: 1.6 }}>{member.focus}</p>
              </PreviewCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}