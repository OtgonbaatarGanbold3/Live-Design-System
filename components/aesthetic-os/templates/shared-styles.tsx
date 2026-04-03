"use client";

import type { DesignState } from "@/lib/design-state";
import { getSemanticTokens } from "@/lib/design-state";

export function getPreviewStyles(state: DesignState) {
  const shadowMap = {
    None: "none",
    Soft: "0 4px 20px rgba(0,0,0,0.08)",
    Medium: "0 6px 30px rgba(0,0,0,0.12)",
    Strong: "0 8px 40px rgba(0,0,0,0.2)",
  };

  const borderWidthMap = {
    None: "0px",
    Subtle: "1px",
    Medium: "2px",
    Strong: "3px",
  };

  const fontWeightMap = {
    Light: 300,
    Regular: 400,
    Medium: 500,
    Bold: 700,
  };

  const isGlassmorphism = state.preset === "Glassmorphism";
  const semantic = getSemanticTokens(state);

  return {
    root: {
      fontFamily: state.fontFamily,
      background: isGlassmorphism
        ? `linear-gradient(135deg, ${state.background} 0%, #7c3aed 50%, #ec4899 100%)`
        : state.background,
      color: state.text,
      letterSpacing: state.letterSpacing,
      fontWeight: fontWeightMap[state.fontWeight],
      minHeight: "100%",
    } as React.CSSProperties,
    shadow: shadowMap[state.shadowIntensity],
    border: `${borderWidthMap[state.borderVisibility]} solid ${semantic.surfaceMuted}`,
    semantic,
  };
}

interface PreviewButtonProps {
  state: DesignState;
  variant: "primary" | "secondary";
  inverted?: boolean;
  children: React.ReactNode;
}

export function PreviewButton({ state, variant, inverted, children }: PreviewButtonProps) {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: `${state.baseSpacing / 2}px ${state.baseSpacing * 1.5}px`,
      borderRadius: state.borderRadius,
      fontWeight: 500,
      fontSize: "0.875rem",
      cursor: "pointer",
      transition: "all 0.15s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      fontFamily: "inherit",
      letterSpacing: "inherit",
    };

    const color = variant === "primary" ? state.primary : state.secondary;

    if (state.buttonStyle === "Filled") {
      return {
        ...base,
        background: inverted ? state.background : color,
        color: inverted ? color : state.background,
      };
    } else if (state.buttonStyle === "Outline") {
      return {
        ...base,
        background: "transparent",
        border: `2px solid ${inverted ? state.background : color}`,
        color: inverted ? state.background : color,
      };
    } else {
      return {
        ...base,
        background: "transparent",
        color: inverted ? state.background : color,
      };
    }
  };

  return <button style={getStyles()}>{children}</button>;
}

export function PreviewCard({
  state,
  children,
  style,
}: {
  state: DesignState;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const s = getPreviewStyles(state);
  const isGlassmorphism = state.preset === "Glassmorphism";

  return (
    <div
      style={{
        background: isGlassmorphism ? "rgba(255,255,255,0.1)" : s.semantic.surface,
        backdropFilter: isGlassmorphism ? "blur(10px)" : undefined,
        padding: state.baseSpacing * 1.5,
        borderRadius: state.borderRadius,
        border: s.border,
        boxShadow: s.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
