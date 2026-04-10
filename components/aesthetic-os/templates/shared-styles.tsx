"use client";

import type { DesignState } from "@/lib/design-state";
import { getSemanticTokens } from "@/lib/design-state";

const SHADOW_MAP = {
  None: "none",
  Soft: "0 6px 24px rgba(0,0,0,0.08)",
  Medium: "0 10px 34px rgba(0,0,0,0.14)",
  Strong: "0 14px 44px rgba(0,0,0,0.2)",
} as const;

const BORDER_WIDTH_MAP = {
  None: "0px",
  Subtle: "1px",
  Medium: "2px",
  Strong: "3px",
} as const;

const FONT_WEIGHT_MAP = {
  Light: 300,
  Regular: 400,
  Medium: 500,
  Bold: 700,
} as const;

function withAlpha(color: string, alphaHex: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return `${color}${alphaHex}`;
  }
  return color;
}

export interface PreviewHelpers {
  space: (multiplier: number) => number;
  radius: (multiplier?: number) => number;
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export function getPreviewHelpers(state: DesignState): PreviewHelpers {
  return {
    space: (multiplier) => Math.round(state.baseSpacing * multiplier),
    radius: (multiplier = 1) => Math.max(4, Math.round(state.borderRadius * multiplier)),
    lineHeight: {
      tight: 1.1,
      normal: 1.5,
      relaxed: 1.75,
    },
  };
}

export function getPreviewStyles(state: DesignState) {
  const isGlassmorphism = state.preset === "Glassmorphism";
  const semantic = getSemanticTokens(state);
  const helpers = getPreviewHelpers(state);

  return {
    root: {
      fontFamily: state.fontFamily,
      background: isGlassmorphism
        ? `linear-gradient(135deg, ${state.background} 0%, #7c3aed 45%, #ec4899 100%)`
        : state.background,
      color: state.text,
      letterSpacing: state.letterSpacing,
      fontWeight: FONT_WEIGHT_MAP[state.fontWeight],
      minHeight: "100%",
    } as React.CSSProperties,
    shadow: SHADOW_MAP[state.shadowIntensity],
    border: `${BORDER_WIDTH_MAP[state.borderVisibility]} solid ${semantic.surfaceMuted}`,
    semantic,
    helpers,
    surface: {
      base: isGlassmorphism ? "rgba(255,255,255,0.12)" : semantic.surface,
      subtle: isGlassmorphism ? "rgba(255,255,255,0.08)" : withAlpha(semantic.surfaceMuted, "20"),
      elevated: isGlassmorphism ? "rgba(255,255,255,0.18)" : state.background,
      interactive: withAlpha(state.primary, "14"),
    },
  };
}

interface PreviewButtonProps {
  state: DesignState;
  variant: "primary" | "secondary";
  inverted?: boolean;
  children: React.ReactNode;
}

export function PreviewButton({ state, variant, inverted, children }: PreviewButtonProps) {
  const color = variant === "primary" ? state.primary : state.secondary;
  const accent = variant === "primary" ? state.accent : state.primary;

  const base: React.CSSProperties = {
    padding: `${state.baseSpacing * 0.625}px ${state.baseSpacing * 1.5}px`,
    borderRadius: Math.max(6, state.borderRadius),
    fontWeight: 600,
    fontSize: "0.8125rem",
    cursor: "pointer",
    transition: "transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    fontFamily: "inherit",
    letterSpacing: 0.2,
  };

  if (state.buttonStyle === "Filled") {
    return (
      <button
        style={{
          ...base,
          background: inverted
            ? state.background
            : `linear-gradient(135deg, ${color} 0%, ${accent} 100%)`,
          color: inverted ? color : state.background,
          boxShadow: `0 8px 24px ${withAlpha(color, "44")}`,
        }}
      >
        {children}
      </button>
    );
  }

  if (state.buttonStyle === "Outline") {
    return (
      <button
        style={{
          ...base,
          background: withAlpha(color, "0f"),
          border: `1.5px solid ${inverted ? state.background : color}`,
          color: inverted ? state.background : color,
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      style={{
        ...base,
        background: "transparent",
        color: inverted ? state.background : color,
      }}
    >
      {children}
    </button>
  );
}

interface PreviewBadgeProps {
  state: DesignState;
  tone?: "primary" | "accent" | "neutral" | "success";
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function PreviewBadge({ state, tone = "primary", children, style }: PreviewBadgeProps) {
  const colors = {
    primary: state.primary,
    accent: state.accent,
    neutral: state.secondary,
    success: "#22c55e",
  } as const;

  const color = colors[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: Math.max(999, state.borderRadius * 2),
        padding: `4px ${state.baseSpacing * 0.75}px`,
        fontSize: "0.6875rem",
        fontWeight: 700,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        background: withAlpha(color, "1f"),
        border: `1px solid ${withAlpha(color, "45")}`,
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

interface PreviewCardProps {
  state: DesignState;
  children: React.ReactNode;
  style?: React.CSSProperties;
  variant?: "base" | "subtle" | "elevated";
}

export function PreviewCard({
  state,
  children,
  style,
  variant = "base",
}: PreviewCardProps) {
  const s = getPreviewStyles(state);

  const backgrounds = {
    base: s.surface.base,
    subtle: s.surface.subtle,
    elevated: s.surface.elevated,
  } as const;

  const shadow =
    variant === "elevated"
      ? "0 16px 36px rgba(0,0,0,0.18)"
      : variant === "subtle"
        ? "none"
        : s.shadow;

  return (
    <div
      style={{
        background: backgrounds[variant],
        backdropFilter: state.preset === "Glassmorphism" ? "blur(10px)" : undefined,
        padding: state.baseSpacing * 1.5,
        borderRadius: Math.max(8, state.borderRadius),
        border: s.border,
        boxShadow: shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
