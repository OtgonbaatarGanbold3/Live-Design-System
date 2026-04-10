"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { DesignState } from "@/lib/design-state";
import {
  getPreviewStyles,
  PreviewBadge,
  PreviewButton,
  PreviewCard,
} from "./shared-styles";

interface PortfolioProps {
  state: DesignState;
}

interface Project {
  title: string;
  category: string;
  year: string;
  duration: string;
  summary: string;
  impact: string;
  tags: string[];
}

export function Portfolio({ state }: PortfolioProps) {
  const s = getPreviewStyles(state);
  const space = s.helpers.space;

  const projects: Project[] = [
    {
      title: "Monarch Commerce Redesign",
      category: "Product Design",
      year: "2026",
      duration: "12 weeks",
      summary: "Rebuilt the conversion funnel with a modular design system and checkout simplification.",
      impact: "+34% conversion",
      tags: ["UX", "Design System", "Experimentation"],
    },
    {
      title: "Arc Brand Identity",
      category: "Branding",
      year: "2025",
      duration: "9 weeks",
      summary: "Created a bold visual language and motion toolkit for launch campaigns across channels.",
      impact: "+62% campaign recall",
      tags: ["Identity", "Motion", "Campaign"],
    },
    {
      title: "Northwave Mobile App",
      category: "Product",
      year: "2025",
      duration: "16 weeks",
      summary: "Designed a unified mobile experience for onboarding, billing, and support flows.",
      impact: "4.8 app store rating",
      tags: ["iOS", "Android", "Accessibility"],
    },
    {
      title: "Ferro Editorial Platform",
      category: "Web Experience",
      year: "2024",
      duration: "10 weeks",
      summary: "Shipped an editorial-first publishing UI with rich storytelling and reusable modules.",
      impact: "+41% read depth",
      tags: ["Web", "CMS", "Typography"],
    },
  ];

  const clients = ["Google", "Stripe", "Figma", "Notion", "Webflow", "Vercel", "Linear", "Framer"];

  const skills = [
    { name: "UI/UX Systems", level: 96 },
    { name: "Brand Strategy", level: 90 },
    { name: "Interaction Design", level: 86 },
    { name: "Front-end Delivery", level: 78 },
  ];

  const process: Array<{ title: string; desc: string; icon: LucideIcon }> = [
    {
      title: "Discover",
      desc: "Map user and business goals to define a focused opportunity space.",
      icon: Target,
    },
    {
      title: "Design",
      desc: "Prototype concepts fast and align stakeholders through measurable design bets.",
      icon: Sparkles,
    },
    {
      title: "Deliver",
      desc: "Ship production-ready interfaces with clear specs and implementation support.",
      icon: BriefcaseBusiness,
    },
  ];

  const awards = [
    { title: "Awwwards Site of the Day", year: "2026" },
    { title: "CSS Design Awards", year: "2025" },
    { title: "Webby Honoree", year: "2025" },
    { title: "FWA Shortlist", year: "2024" },
    { title: "ADC Merit", year: "2024" },
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
        }}
      >
        <div style={{ fontWeight: 800, letterSpacing: 1.6 }}>AM.</div>
        <div style={{ display: "flex", gap: space(1.5), fontSize: "0.875rem", opacity: 0.78 }}>
          <a href="#">Work</a>
          <a href="#">About</a>
          <a href="#">Process</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      <section
        style={{
          padding: `${space(6)}px ${space(2)}px ${space(4)}px`,
          textAlign: "center",
        }}
      >
        <PreviewBadge state={state} tone="accent">
          <Sparkles size={12} />
          Available for select 2026 projects
        </PreviewBadge>

        <h1
          style={{
            marginTop: space(1.5),
            marginBottom: 10,
            fontSize: `calc(3rem * ${state.typeScale})`,
            lineHeight: s.helpers.lineHeight.tight,
            letterSpacing: -0.6,
            fontWeight:
              state.fontWeight === "Light" ? 300 : state.fontWeight === "Bold" ? 700 : 500,
          }}
        >
          Alex Morgan
        </h1>

        <p
          style={{
            maxWidth: 640,
            margin: `0 auto ${space(2)}px`,
            opacity: 0.72,
            fontSize: "1.04rem",
            lineHeight: s.helpers.lineHeight.relaxed,
          }}
        >
          Product designer and creative developer crafting thoughtful digital systems with
          editorial detail, motion sensitivity, and measurable outcomes.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: space(1), flexWrap: "wrap" }}>
          <PreviewButton state={state} variant="primary">
            View Work
          </PreviewButton>
          <PreviewButton state={state} variant="secondary">
            Download Resume
          </PreviewButton>
        </div>

        <div
          style={{
            marginTop: space(3),
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: space(1),
            maxWidth: 860,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {[
            { label: "Years", value: "9+" },
            { label: "Projects", value: "72" },
            { label: "Markets", value: "14" },
            { label: "Avg NPS", value: "63" },
          ].map((metric) => (
            <PreviewCard key={metric.label} state={state} variant="subtle" style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontWeight: 750, fontSize: "1.4rem", color: state.primary }}>{metric.value}</p>
              <p style={{ margin: "4px 0 0", opacity: 0.6, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: 1 }}>
                {metric.label}
              </p>
            </PreviewCard>
          ))}
        </div>
      </section>

      <section style={{ padding: `0 ${space(2)}px ${space(3)}px` }}>
        <div
          style={{
            maxWidth: 1020,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: 10,
          }}
        >
          {clients.map((client) => (
            <PreviewCard
              key={client}
              state={state}
              variant="subtle"
              style={{ textAlign: "center", padding: `${space(0.85)}px ${space(0.6)}px` }}
            >
              <span style={{ fontSize: "0.74rem", fontWeight: 650, letterSpacing: 1.1, opacity: 0.72 }}>
                {client}
              </span>
            </PreviewCard>
          ))}
        </div>
      </section>

      <section style={{ padding: `${space(2)}px ${space(2)}px ${space(4)}px` }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: space(1.25),
          }}
        >
          {projects.map((project, index) => (
            <PreviewCard
              key={project.title}
              state={state}
              variant="elevated"
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: 280,
                background: `linear-gradient(150deg, ${[state.primary, state.accent, state.secondary, state.primary][index]}20 0%, ${state.background} 58%)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: space(1) }}>
                <PreviewBadge state={state} tone="neutral">
                  {project.category}
                </PreviewBadge>
                <span style={{ opacity: 0.52, fontSize: "0.72rem" }}>{project.year}</span>
              </div>

              <h3 style={{ margin: 0, marginBottom: 8, fontSize: "1.12rem", lineHeight: 1.3 }}>{project.title}</h3>
              <p style={{ margin: 0, opacity: 0.74, fontSize: "0.84rem", lineHeight: 1.65 }}>{project.summary}</p>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: "0.75rem", opacity: 0.65 }}>
                <Clock3 size={13} />
                <span>{project.duration}</span>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                {project.tags.map((tag) => (
                  <PreviewBadge key={tag} state={state} tone="accent" style={{ fontSize: "0.62rem" }}>
                    {tag}
                  </PreviewBadge>
                ))}
              </div>

              <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: state.accent, fontWeight: 700, fontSize: "0.78rem" }}>{project.impact}</span>
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
                    fontSize: "0.78rem",
                    cursor: "pointer",
                  }}
                >
                  View case <ArrowUpRight size={13} />
                </button>
              </div>
            </PreviewCard>
          ))}
        </div>
      </section>

      <section style={{ padding: `${space(3)}px ${space(2)}px`, background: s.surface.subtle }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: space(2),
          }}
        >
          <div>
            <h2 style={{ margin: 0, marginBottom: 8, fontSize: `calc(1.45rem * ${state.typeScale})` }}>
              Working style
            </h2>
            <p style={{ margin: `0 0 ${space(1.5)}px`, opacity: 0.72, lineHeight: s.helpers.lineHeight.relaxed, fontSize: "0.88rem" }}>
              I collaborate closely with PM and engineering leads, balancing product velocity with
              craft quality. Every project has a clear hypothesis and measurable success markers.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              {process.map((step) => {
                const Icon = step.icon;
                return (
                  <PreviewCard key={step.title} state={state} variant="base" style={{ padding: space(1) }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: `${state.primary}22`,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={14} color={state.primary} />
                      </span>
                      <div>
                        <p style={{ margin: 0, fontWeight: 650, fontSize: "0.86rem" }}>{step.title}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "0.8rem", opacity: 0.7, lineHeight: 1.5 }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </PreviewCard>
                );
              })}
            </div>
          </div>

          <div>
            <h3 style={{ margin: 0, marginBottom: 10, fontSize: "1.05rem" }}>Capabilities</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {skills.map((skill) => (
                <PreviewCard key={skill.name} state={state} variant="base" style={{ padding: space(1) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{skill.name}</span>
                    <span style={{ fontSize: "0.76rem", opacity: 0.62 }}>{skill.level}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: `${state.secondary}26`, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${skill.level}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${state.primary}, ${state.accent})`,
                      }}
                    />
                  </div>
                </PreviewCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: `${space(3)}px ${space(2)}px ${space(4)}px` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 8px", textAlign: "center", fontSize: `calc(1.35rem * ${state.typeScale})` }}>
            Selected recognition
          </h2>
          <p style={{ margin: `0 0 ${space(1.5)}px`, textAlign: "center", opacity: 0.66, fontSize: "0.84rem" }}>
            Awards and mentions across digital product, interaction, and web craft.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
            {awards.map((award) => (
              <PreviewCard key={award.title} state={state} variant="subtle" style={{ textAlign: "center", padding: space(1) }}>
                <Trophy size={15} color={state.accent} style={{ marginBottom: 6 }} />
                <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.4 }}>{award.title}</p>
                <p style={{ margin: "5px 0 0", opacity: 0.56, fontSize: "0.72rem" }}>{award.year}</p>
              </PreviewCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}