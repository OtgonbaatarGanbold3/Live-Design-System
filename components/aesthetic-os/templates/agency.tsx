"use client";

import type { DesignState } from "@/lib/design-state";
import { getPreviewStyles, PreviewButton } from "./shared-styles";

interface AgencyProps {
  state: DesignState;
}

export function Agency({ state }: AgencyProps) {
  const s = getPreviewStyles(state);

  const clients = ["ACME", "STARK", "WAYNE", "OSCORP", "UMBRELLA", "LEXCORP"];
  const services = [
    { title: "Brand Strategy", desc: "We craft compelling brand narratives that resonate with your audience and drive growth.", icon: "compass" },
    { title: "Digital Design", desc: "From websites to apps, we create digital experiences that captivate and convert.", icon: "palette" },
    { title: "Marketing", desc: "Data-driven campaigns that amplify your message and maximize ROI.", icon: "megaphone" },
  ];
  const team = [
    { name: "Sarah Chen", role: "Creative Director" },
    { name: "Marcus Johnson", role: "Lead Designer" },
    { name: "Emma Wilson", role: "Strategy Lead" },
    { name: "David Park", role: "Tech Director" },
  ];
  const stats = [
    { value: "150+", label: "Projects Delivered" },
    { value: "98%", label: "Client Retention" },
    { value: "40+", label: "Awards Won" },
    { value: "12", label: "Countries" },
  ];
  const caseStudies = [
    { title: "TechCorp Rebrand", category: "Branding", result: "+340% brand recognition" },
    { title: "FinApp Launch", category: "Digital Product", result: "2M downloads in 3 months" },
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
        <div style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: 2 }}>AGENCY</div>
        <div style={{ display: "flex", gap: state.baseSpacing * 2, fontSize: "0.875rem", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#" style={{ opacity: 0.7 }}>Work</a>
          <a href="#" style={{ opacity: 0.7 }}>Services</a>
          <a href="#" style={{ opacity: 0.7 }}>About</a>
        </div>
        <PreviewButton state={state} variant="primary">Contact</PreviewButton>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: `${state.baseSpacing * 8}px ${state.baseSpacing * 2}px`,
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: state.baseSpacing,
            marginBottom: state.baseSpacing * 2,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: state.accent,
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ fontSize: "0.875rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: 2 }}>
            Available for projects
          </span>
        </div>
        <h1
          style={{
            fontSize: `calc(3.5rem * ${state.typeScale})`,
            fontWeight: state.fontWeight === "Light" ? 300 : state.fontWeight === "Bold" ? 700 : 400,
            lineHeight: 1,
            marginBottom: state.baseSpacing * 2,
            maxWidth: "90%",
          }}
        >
          We build brands that move people.
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            opacity: 0.6,
            maxWidth: 550,
            marginBottom: state.baseSpacing * 3,
            lineHeight: 1.7,
          }}
        >
          A full-service creative agency transforming ambitious ideas into extraordinary results. We blend strategy, design, and technology.
        </p>
        <div style={{ display: "flex", gap: state.baseSpacing, flexWrap: "wrap" }}>
          <PreviewButton state={state} variant="primary">Start a Project</PreviewButton>
          <PreviewButton state={state} variant="secondary">Our Work</PreviewButton>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          padding: `${state.baseSpacing * 3}px ${state.baseSpacing * 2}px`,
          borderTop: s.border,
          borderBottom: s.border,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: state.baseSpacing * 2 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: `calc(2rem * ${state.typeScale})`,
                  fontWeight: 700,
                  color: state.primary,
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.75rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: 1 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Logos */}
      <section
        style={{
          padding: `${state.baseSpacing * 2}px 0`,
          background: `${state.secondary}05`,
        }}
      >
        <p style={{ textAlign: "center", fontSize: "0.75rem", opacity: 0.4, marginBottom: state.baseSpacing, textTransform: "uppercase", letterSpacing: 2 }}>
          Trusted by industry leaders
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: state.baseSpacing * 4,
            padding: `0 ${state.baseSpacing * 2}px`,
          }}
        >
          {clients.map((client) => (
            <span
              key={client}
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                opacity: 0.3,
                letterSpacing: 3,
              }}
            >
              {client}
            </span>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: `${state.baseSpacing * 6}px ${state.baseSpacing * 2}px` }}>
        <div style={{ maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          <h2
            style={{
              fontSize: `calc(1.75rem * ${state.typeScale})`,
              fontWeight: 700,
              marginBottom: state.baseSpacing / 2,
            }}
          >
            What We Do
          </h2>
          <p style={{ opacity: 0.6, marginBottom: state.baseSpacing * 4, maxWidth: 500 }}>
            End-to-end creative services that help you stand out in a crowded market.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: state.baseSpacing * 2 }}>
            {services.map((service, i) => (
              <div
                key={service.title}
                style={{
                  padding: state.baseSpacing * 2,
                  borderRadius: state.borderRadius,
                  border: s.border,
                  background: state.preset === "Glassmorphism" ? "rgba(255,255,255,0.05)" : "transparent",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: state.borderRadius,
                    background: `${[state.primary, state.accent, state.secondary][i]}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: state.baseSpacing * 1.5,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: [state.primary, state.accent, state.secondary][i],
                    }}
                  />
                </div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: state.baseSpacing / 2 }}>
                  {service.title}
                </h3>
                <p style={{ opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.7 }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section style={{ padding: `${state.baseSpacing * 4}px ${state.baseSpacing * 2}px`, background: `${state.secondary}05` }}>
        <div style={{ maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: state.baseSpacing * 3 }}>
            <h2 style={{ fontSize: `calc(1.75rem * ${state.typeScale})`, fontWeight: 700 }}>Featured Work</h2>
            <a href="#" style={{ fontSize: "0.875rem", color: state.primary }}>View All &rarr;</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: state.baseSpacing * 2 }}>
            {caseStudies.map((study, i) => (
              <div
                key={study.title}
                style={{
                  background: `linear-gradient(135deg, ${[state.primary, state.accent][i]}15 0%, ${[state.accent, state.secondary][i]}10 100%)`,
                  borderRadius: state.borderRadius,
                  border: s.border,
                  padding: state.baseSpacing * 2,
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <span style={{ fontSize: "0.75rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: 1 }}>
                  {study.category}
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: 4, marginBottom: state.baseSpacing }}>
                  {study.title}
                </h3>
                <div
                  style={{
                    display: "inline-block",
                    padding: `4px ${state.baseSpacing}px`,
                    borderRadius: state.borderRadius,
                    background: `${state.accent}20`,
                    color: state.accent,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    alignSelf: "flex-start",
                  }}
                >
                  {study.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: `${state.baseSpacing * 6}px ${state.baseSpacing * 2}px` }}>
        <div style={{ maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          <h2
            style={{
              fontSize: `calc(1.75rem * ${state.typeScale})`,
              fontWeight: 700,
              marginBottom: state.baseSpacing / 2,
            }}
          >
            The Team
          </h2>
          <p style={{ opacity: 0.6, marginBottom: state.baseSpacing * 3, maxWidth: 400 }}>
            A diverse group of thinkers, makers, and dreamers.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: state.baseSpacing * 2 }}>
            {team.map((member) => (
              <div key={member.name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${state.primary}30 0%, ${state.accent}30 100%)`,
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: 0,
                    marginBottom: state.baseSpacing,
                  }}
                />
                <h3 style={{ fontWeight: 600, marginBottom: 2, fontSize: "0.9375rem" }}>{member.name}</h3>
                <p style={{ opacity: 0.5, fontSize: "0.75rem" }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: `${state.baseSpacing * 6}px ${state.baseSpacing * 2}px`,
          textAlign: "center",
          background: `linear-gradient(135deg, ${state.primary}10 0%, ${state.accent}10 100%)`,
        }}
      >
        <h2
          style={{
            fontSize: `calc(2rem * ${state.typeScale})`,
            fontWeight: 700,
            marginBottom: state.baseSpacing,
          }}
        >
          Ready to start something great?
        </h2>
        <p style={{ opacity: 0.6, marginBottom: state.baseSpacing * 2, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
          Let&apos;s discuss your next project and see how we can help bring your vision to life.
        </p>
        <PreviewButton state={state} variant="primary">Get in Touch</PreviewButton>
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
          <div style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: state.baseSpacing, letterSpacing: 2 }}>AGENCY</div>
          <p style={{ opacity: 0.5, fontSize: "0.875rem", lineHeight: 1.6 }}>
            Creating meaningful connections between brands and people since 2015.
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: state.baseSpacing, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, opacity: 0.5 }}>Services</div>
          <div style={{ display: "flex", flexDirection: "column", gap: state.baseSpacing / 2, fontSize: "0.875rem" }}>
            <a href="#" style={{ opacity: 0.7 }}>Branding</a>
            <a href="#" style={{ opacity: 0.7 }}>Design</a>
            <a href="#" style={{ opacity: 0.7 }}>Marketing</a>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: state.baseSpacing, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, opacity: 0.5 }}>Company</div>
          <div style={{ display: "flex", flexDirection: "column", gap: state.baseSpacing / 2, fontSize: "0.875rem" }}>
            <a href="#" style={{ opacity: 0.7 }}>About</a>
            <a href="#" style={{ opacity: 0.7 }}>Careers</a>
            <a href="#" style={{ opacity: 0.7 }}>Contact</a>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: state.baseSpacing, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, opacity: 0.5 }}>Social</div>
          <div style={{ display: "flex", flexDirection: "column", gap: state.baseSpacing / 2, fontSize: "0.875rem" }}>
            <a href="#" style={{ opacity: 0.7 }}>Twitter</a>
            <a href="#" style={{ opacity: 0.7 }}>Instagram</a>
            <a href="#" style={{ opacity: 0.7 }}>LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
