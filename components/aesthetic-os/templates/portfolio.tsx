"use client";

import type { DesignState } from "@/lib/design-state";
import { getPreviewStyles, PreviewButton, PreviewCard } from "./shared-styles";

interface PortfolioProps {
  state: DesignState;
}

export function Portfolio({ state }: PortfolioProps) {
  const s = getPreviewStyles(state);

  const projects = [
    { title: "Brand Identity", category: "Branding", year: "2025" },
    { title: "E-commerce Redesign", category: "Web Design", year: "2025" },
    { title: "Mobile App", category: "Product", year: "2024" },
    { title: "Marketing Campaign", category: "Digital", year: "2024" },
  ];

  const skills = [
    { name: "UI/UX Design", level: 95 },
    { name: "Brand Strategy", level: 88 },
    { name: "Motion Design", level: 75 },
    { name: "Development", level: 70 },
  ];

  const awards = [
    { title: "Awwwards Site of the Day", year: "2025" },
    { title: "CSS Design Awards", year: "2024" },
    { title: "Webby Honoree", year: "2024" },
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
        }}
      >
        <div style={{ fontWeight: 700 }}>AM</div>
        <div style={{ display: "flex", gap: state.baseSpacing * 2, fontSize: "0.875rem", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#" style={{ opacity: 0.7 }}>Work</a>
          <a href="#" style={{ opacity: 0.7 }}>About</a>
          <a href="#" style={{ opacity: 0.7 }}>Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: `${state.baseSpacing * 8}px ${state.baseSpacing * 2}px`,
          textAlign: "center",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${state.primary} 0%, ${state.accent} 100%)`,
            marginBottom: state.baseSpacing * 2,
          }}
        />
        <p style={{ opacity: 0.5, marginBottom: state.baseSpacing, letterSpacing: 3, fontSize: "0.75rem", textTransform: "uppercase" }}>
          Designer &amp; Developer
        </p>
        <h1
          style={{
            fontSize: `calc(3rem * ${state.typeScale})`,
            fontWeight: state.fontWeight === "Light" ? 300 : state.fontWeight === "Bold" ? 700 : 400,
            marginBottom: state.baseSpacing,
            lineHeight: 1,
          }}
        >
          Alex Morgan
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            opacity: 0.6,
            maxWidth: 500,
            lineHeight: 1.6,
          }}
        >
          Creating digital experiences that blend form and function. Based in San Francisco, available worldwide.
        </p>
        <div style={{ display: "flex", gap: state.baseSpacing, marginTop: state.baseSpacing * 2 }}>
          <PreviewButton state={state} variant="primary">View Work</PreviewButton>
          <PreviewButton state={state} variant="secondary">Get in Touch</PreviewButton>
        </div>
      </section>

      {/* Marquee-like clients */}
      <section
        style={{
          padding: `${state.baseSpacing * 2}px 0`,
          borderTop: s.border,
          borderBottom: s.border,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: state.baseSpacing * 4, opacity: 0.4 }}>
          {["Google", "Apple", "Meta", "Stripe", "Figma", "Vercel"].map((brand) => (
            <span key={brand} style={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Work Grid */}
      <section style={{ padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: state.baseSpacing * 2, gap: state.baseSpacing, flexWrap: "wrap" }}>
          <h2
            style={{
              fontSize: `calc(1.5rem * ${state.typeScale})`,
              fontWeight: 700,
            }}
          >
            Selected Work
          </h2>
          <a href="#" style={{ fontSize: "0.875rem", color: state.primary }}>View All &rarr;</a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: state.baseSpacing * 2,
            maxWidth: 1000,
          }}
        >
          {projects.map((project, i) => (
            <div
              key={project.title}
              style={{
                position: "relative",
                aspectRatio: "16/10",
                background: `linear-gradient(135deg, ${[state.primary, state.accent, state.secondary, state.primary][i]}15 0%, ${[state.accent, state.secondary, state.primary, state.accent][i]}10 100%)`,
                borderRadius: state.borderRadius,
                border: s.border,
                boxShadow: s.shadow,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: state.baseSpacing * 1.5,
                  background: `linear-gradient(transparent, ${state.background}ee)`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{project.category}</p>
                    <h3 style={{ fontWeight: 600, fontSize: "1.125rem" }}>{project.title}</h3>
                  </div>
                  <span style={{ fontSize: "0.75rem", opacity: 0.4 }}>{project.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About + Skills */}
      <section
        style={{
          padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px`,
          background: `${state.secondary}05`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: state.baseSpacing * 4,
            maxWidth: 900,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: `calc(1.5rem * ${state.typeScale})`,
                fontWeight: 700,
                marginBottom: state.baseSpacing,
              }}
            >
              About Me
            </h2>
            <p style={{ opacity: 0.7, lineHeight: 1.8, marginBottom: state.baseSpacing * 1.5, fontSize: "0.9375rem" }}>
              With over 8 years of experience in digital design, I specialize in creating 
              user-centered experiences that drive results. My approach combines strategic 
              thinking with meticulous attention to detail.
            </p>
            <p style={{ opacity: 0.7, lineHeight: 1.8, fontSize: "0.9375rem" }}>
              When I&apos;m not designing, you&apos;ll find me exploring new coffee shops, 
              reading about design history, or experimenting with new creative tools.
            </p>
          </div>
          <div>
            <h3 style={{ fontWeight: 600, marginBottom: state.baseSpacing * 1.5 }}>Skills</h3>
            {skills.map((skill) => (
              <div key={skill.name} style={{ marginBottom: state.baseSpacing }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.875rem" }}>
                  <span>{skill.name}</span>
                  <span style={{ opacity: 0.5 }}>{skill.level}%</span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: `${state.secondary}20`,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${skill.level}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${state.primary}, ${state.accent})`,
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section style={{ padding: `${state.baseSpacing * 3}px ${state.baseSpacing * 2}px` }}>
        <div style={{ display: "flex", justifyContent: "center", gap: state.baseSpacing * 4 }}>
          {awards.map((award) => (
            <div key={award.title} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{award.title}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>{award.year}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px` }}>
        <div style={{ maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          <h2
            style={{
              fontSize: `calc(1.5rem * ${state.typeScale})`,
              fontWeight: 700,
              marginBottom: state.baseSpacing / 2,
              textAlign: "center",
            }}
          >
            Let&apos;s work together
          </h2>
          <p style={{ textAlign: "center", opacity: 0.6, marginBottom: state.baseSpacing * 2, fontSize: "0.9375rem" }}>
            Have a project in mind? I&apos;d love to hear about it.
          </p>
          <PreviewCard state={state}>
            <div style={{ display: "flex", flexDirection: "column", gap: state.baseSpacing }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: state.baseSpacing }}>
                <div>
                  <label style={{ fontSize: "0.75rem", opacity: 0.6, display: "block", marginBottom: 4 }}>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    style={{
                      width: "100%",
                      padding: `${state.baseSpacing / 2}px ${state.baseSpacing}px`,
                      borderRadius: state.borderRadius,
                      border: s.border,
                      background: "transparent",
                      color: state.text,
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", opacity: 0.6, display: "block", marginBottom: 4 }}>Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      width: "100%",
                      padding: `${state.baseSpacing / 2}px ${state.baseSpacing}px`,
                      borderRadius: state.borderRadius,
                      border: s.border,
                      background: "transparent",
                      color: state.text,
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", opacity: 0.6, display: "block", marginBottom: 4 }}>Message</label>
                <textarea
                  placeholder="Tell me about your project..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: `${state.baseSpacing / 2}px ${state.baseSpacing}px`,
                    borderRadius: state.borderRadius,
                    border: s.border,
                    background: "transparent",
                    color: state.text,
                    fontFamily: "inherit",
                    resize: "none",
                  }}
                />
              </div>
              <PreviewButton state={state} variant="primary">Send Message</PreviewButton>
            </div>
          </PreviewCard>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: `${state.baseSpacing * 2}px`,
          borderTop: s.border,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: state.baseSpacing,
          fontSize: "0.875rem",
        }}
      >
        <span style={{ opacity: 0.6 }}>&copy; 2026 Alex Morgan</span>
        <div style={{ display: "flex", gap: state.baseSpacing * 2, opacity: 0.6 }}>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
          <a href="#">Dribbble</a>
        </div>
      </footer>
    </div>
  );
}
