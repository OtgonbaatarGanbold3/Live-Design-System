import type { DesignState } from "@/lib/design-state";
import { getSemanticTokens } from "@/lib/design-state";

const SHADOW_MAP = {
  None: "none",
  Soft: "0 4px 20px rgba(0,0,0,0.08)",
  Medium: "0 6px 30px rgba(0,0,0,0.12)",
  Strong: "0 8px 40px rgba(0,0,0,0.2)",
} as const;

const BORDER_MAP = {
  None: "0px",
  Subtle: "1px",
  Medium: "2px",
  Strong: "3px",
} as const;

const FONT_WEIGHT_MAP = {
  Light: "300",
  Regular: "400",
  Medium: "500",
  Bold: "700",
} as const;

export function exportCSSVariables(state: DesignState): string {
  const semantic = getSemanticTokens(state);

  return `:root {
  --color-bg: ${state.background};
  --color-text: ${state.text};
  --color-primary: ${state.primary};
  --color-secondary: ${state.secondary};
  --color-accent: ${state.accent};
  --color-surface: ${semantic.surface};
  --color-surface-muted: ${semantic.surfaceMuted};
  --color-interactive: ${semantic.interactive};
  --color-success: ${semantic.success};
  --color-warning: ${semantic.warning};
  --color-danger: ${semantic.danger};
  --font-family: ${state.fontFamily};
  --font-weight: ${FONT_WEIGHT_MAP[state.fontWeight]};
  --type-scale: ${state.typeScale};
  --letter-spacing: ${state.letterSpacing}px;
  --radius: ${state.borderRadius}px;
  --border-width: ${BORDER_MAP[state.borderVisibility]};
  --shadow: ${SHADOW_MAP[state.shadowIntensity]};
  --spacing-base: ${state.baseSpacing}px;
}`;
}
