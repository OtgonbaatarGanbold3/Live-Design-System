export type PresetName =
  | "Minimal"
  | "Swiss"
  | "Brutalist"
  | "Y2K"
  | "Vaporwave"
  | "Glassmorphism"
  | "Dark Academia"
  | "Memphis"
  | "Nature"
  | "Earth"
  | "Terracotta";

export type TypeScale = "1.067" | "1.125" | "1.200" | "1.25" | "1.333" | "1.414" | "1.500" | "1.618";
export type FontWeight = "Light" | "Regular" | "Medium" | "Bold";
export type ButtonStyle = "Filled" | "Outline" | "Ghost";
export type ShadowIntensity = "None" | "Soft" | "Medium" | "Strong";
export type BorderVisibility = "None" | "Subtle" | "Medium" | "Strong";
export type TemplateName = "SaaS Landing" | "Portfolio" | "Agency" | "E-commerce";
export type ColorScheme = "Monochromatic" | "Analogous" | "Complementary" | "Split Complementary" | "Triadic";

export interface DesignState {
  // Colors
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  // Typography
  fontFamily: string;
  typeScale: TypeScale;
  fontWeight: FontWeight;
  letterSpacing: number;
  // Shape
  borderRadius: number;
  buttonStyle: ButtonStyle;
  // Spacing
  baseSpacing: number;
  // Effects
  shadowIntensity: ShadowIntensity;
  borderVisibility: BorderVisibility;
  // Meta
  preset: PresetName | null;
}

export interface SemanticTokens {
  surface: string;
  surfaceMuted: string;
  interactive: string;
  success: string;
  warning: string;
  danger: string;
}

export interface DesignGuidanceItem {
  id: string;
  level: "good" | "warning" | "critical";
  title: string;
  detail: string;
}

export interface SavedTheme {
  id: string;
  name: string;
  state: DesignState;
  createdAt: string;
  updatedAt: string;
}

export interface SharedSnapshot {
  id: string;
  version: number;
  state: DesignState;
  createdAt: string;
}

export const TYPE_SCALE_OPTIONS: { label: string; value: TypeScale }[] = [
  { label: "Minor Second (1.067)", value: "1.067" },
  { label: "Major Second (1.125)", value: "1.125" },
  { label: "Minor Third (1.200)", value: "1.200" },
  { label: "Major Third (1.25)", value: "1.25" },
  { label: "Perfect Fourth (1.333)", value: "1.333" },
  { label: "Augmented Fourth (1.414)", value: "1.414" },
  { label: "Perfect Fifth (1.500)", value: "1.500" },
  { label: "Golden Ratio (1.618)", value: "1.618" },
];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const FONT_WEIGHT_VALUES: FontWeight[] = ["Light", "Regular", "Medium", "Bold"];
const BUTTON_STYLE_VALUES: ButtonStyle[] = ["Filled", "Outline", "Ghost"];
const SHADOW_VALUES: ShadowIntensity[] = ["None", "Soft", "Medium", "Strong"];
const BORDER_VALUES: BorderVisibility[] = ["None", "Subtle", "Medium", "Strong"];
const TYPE_SCALE_VALUES = TYPE_SCALE_OPTIONS.map((opt) => opt.value);
const LETTER_SPACING_BOUNDS = { min: -2, max: 10 };
const BORDER_RADIUS_BOUNDS = { min: 0, max: 32 };
const BASE_SPACING_BOUNDS = { min: 4, max: 24 };

export const PRESETS: Record<PresetName, Omit<DesignState, "preset">> = {
  Minimal: {
    background: "#ffffff",
    text: "#1a1a1a",
    primary: "#1a1a1a",
    secondary: "#666666",
    accent: "#3b82f6",
    fontFamily: "system-ui",
    typeScale: "1.25",
    fontWeight: "Regular",
    letterSpacing: 0,
    borderRadius: 6,
    buttonStyle: "Outline",
    baseSpacing: 16,
    shadowIntensity: "None",
    borderVisibility: "Subtle",
  },
  Swiss: {
    background: "#ffffff",
    text: "#000000",
    primary: "#E63322",
    secondary: "#333333",
    accent: "#E63322",
    fontFamily: "Helvetica, Arial, sans-serif",
    typeScale: "1.333",
    fontWeight: "Bold",
    letterSpacing: 0,
    borderRadius: 0,
    buttonStyle: "Filled",
    baseSpacing: 16,
    shadowIntensity: "None",
    borderVisibility: "Strong",
  },
  Brutalist: {
    background: "#1a1a1a",
    text: "#f5f500",
    primary: "#ff3333",
    secondary: "#f5f500",
    accent: "#ff3333",
    fontFamily: "Impact, sans-serif",
    typeScale: "1.333",
    fontWeight: "Bold",
    letterSpacing: 2,
    borderRadius: 0,
    buttonStyle: "Outline",
    baseSpacing: 16,
    shadowIntensity: "None",
    borderVisibility: "Strong",
  },
  Y2K: {
    background: "#e9d5ff",
    text: "#6b21a8",
    primary: "#ec4899",
    secondary: "#a855f7",
    accent: "#22d3ee",
    fontFamily: "Trebuchet MS, sans-serif",
    typeScale: "1.25",
    fontWeight: "Regular",
    letterSpacing: 0,
    borderRadius: 16,
    buttonStyle: "Filled",
    baseSpacing: 16,
    shadowIntensity: "Soft",
    borderVisibility: "None",
  },
  Vaporwave: {
    background: "#0d0221",
    text: "#ff71ce",
    primary: "#ff71ce",
    secondary: "#b967ff",
    accent: "#01cdfe",
    fontFamily: "monospace",
    typeScale: "1.25",
    fontWeight: "Regular",
    letterSpacing: 2,
    borderRadius: 0,
    buttonStyle: "Outline",
    baseSpacing: 16,
    shadowIntensity: "Soft",
    borderVisibility: "Subtle",
  },
  Glassmorphism: {
    background: "#4c1d95",
    text: "#ffffff",
    primary: "#8b5cf6",
    secondary: "#a78bfa",
    accent: "#c4b5fd",
    fontFamily: "system-ui",
    typeScale: "1.25",
    fontWeight: "Regular",
    letterSpacing: 0,
    borderRadius: 16,
    buttonStyle: "Filled",
    baseSpacing: 16,
    shadowIntensity: "Strong",
    borderVisibility: "Subtle",
  },
  "Dark Academia": {
    background: "#1c1410",
    text: "#d4b896",
    primary: "#8b7355",
    secondary: "#a89070",
    accent: "#c9b896",
    fontFamily: "Georgia, serif",
    typeScale: "1.25",
    fontWeight: "Regular",
    letterSpacing: 1,
    borderRadius: 4,
    buttonStyle: "Outline",
    baseSpacing: 20,
    shadowIntensity: "None",
    borderVisibility: "Subtle",
  },
  Memphis: {
    background: "#fef9c3",
    text: "#1a1a1a",
    primary: "#ec4899",
    secondary: "#22d3ee",
    accent: "#f97316",
    fontFamily: "Comic Sans MS, cursive",
    typeScale: "1.25",
    fontWeight: "Bold",
    letterSpacing: 0,
    borderRadius: 8,
    buttonStyle: "Filled",
    baseSpacing: 16,
    shadowIntensity: "None",
    borderVisibility: "Strong",
  },
  // Nature-distilled earthy tones
  Nature: {
    background: "#f9faf7",
    text: "#070705",
    primary: "#949c6b",
    secondary: "#adc8ad",
    accent: "#8bb19a",
    fontFamily: "Inter, system-ui",
    typeScale: "1.25",
    fontWeight: "Regular",
    letterSpacing: 0,
    borderRadius: 8,
    buttonStyle: "Filled",
    baseSpacing: 16,
    shadowIntensity: "Soft",
    borderVisibility: "Subtle",
  },
  Earth: {
    background: "#faf8f5",
    text: "#2d2a26",
    primary: "#8b7355",
    secondary: "#b8a088",
    accent: "#d4a574",
    fontFamily: "Georgia, serif",
    typeScale: "1.25",
    fontWeight: "Regular",
    letterSpacing: 0.5,
    borderRadius: 12,
    buttonStyle: "Filled",
    baseSpacing: 18,
    shadowIntensity: "Soft",
    borderVisibility: "None",
  },
  Terracotta: {
    background: "#fef7f0",
    text: "#3d2c24",
    primary: "#c67b5c",
    secondary: "#d4a088",
    accent: "#8fbc8f",
    fontFamily: "system-ui",
    typeScale: "1.200",
    fontWeight: "Medium",
    letterSpacing: 0,
    borderRadius: 16,
    buttonStyle: "Filled",
    baseSpacing: 16,
    shadowIntensity: "Soft",
    borderVisibility: "Subtle",
  },
};

export const DEFAULT_STATE: DesignState = {
  ...PRESETS.Nature,
  preset: "Nature",
};

// Color utility functions
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(value: string | null): string | null {
  if (!value) return null;
  const maybeHex = value.startsWith("#") ? value : `#${value}`;
  return HEX_RE.test(maybeHex) ? maybeHex.toLowerCase() : null;
}

function blendHex(colorA: string, colorB: string, ratio: number): string {
  const safeRatio = clamp(ratio, 0, 1);
  const a = normalizeHex(colorA);
  const b = normalizeHex(colorB);
  if (!a || !b) {
    return colorA;
  }

  const channels = [0, 2, 4].map((offset) => {
    const channelA = parseInt(a.slice(offset + 1, offset + 3), 16);
    const channelB = parseInt(b.slice(offset + 1, offset + 3), 16);
    return Math.round(channelA + (channelB - channelA) * safeRatio)
      .toString(16)
      .padStart(2, "0");
  });

  return `#${channels.join("")}`;
}

function isInEnum<T extends string>(value: string | null, options: T[]): value is T {
  return !!value && options.includes(value as T);
}

function sanitizeFontFamily(fontFamily: string): string {
  return fontFamily.replace(/[<>`]/g, "").trim().slice(0, 120);
}

export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255,
    ].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastLevel(ratio: number): "fail" | "aa" | "aaa" {
  if (ratio >= 7) return "aaa";
  if (ratio >= 4.5) return "aa";
  return "fail";
}

export function generateRandomColors(scheme: ColorScheme, baseHue?: number): Partial<DesignState> {
  const h = baseHue ?? Math.floor(Math.random() * 360);
  
  // Decide light or dark theme
  const isDark = Math.random() > 0.7;
  const bgLightness = isDark ? 8 + Math.random() * 10 : 95 + Math.random() * 5;
  const textLightness = isDark ? 90 + Math.random() * 8 : 5 + Math.random() * 15;
  
  let primaryHue = h;
  let secondaryHue = h;
  let accentHue = h;
  
  switch (scheme) {
    case "Monochromatic":
      primaryHue = h;
      secondaryHue = h;
      accentHue = h;
      break;
    case "Analogous":
      primaryHue = h;
      secondaryHue = (h + 30) % 360;
      accentHue = (h - 30 + 360) % 360;
      break;
    case "Complementary":
      primaryHue = h;
      secondaryHue = (h + 180) % 360;
      accentHue = (h + 180) % 360;
      break;
    case "Split Complementary":
      primaryHue = h;
      secondaryHue = (h + 150) % 360;
      accentHue = (h + 210) % 360;
      break;
    case "Triadic":
      primaryHue = h;
      secondaryHue = (h + 120) % 360;
      accentHue = (h + 240) % 360;
      break;
  }
  
  return {
    background: hslToHex(h, isDark ? 15 : 5, bgLightness),
    text: hslToHex(h, isDark ? 5 : 10, textLightness),
    primary: hslToHex(primaryHue, 50 + Math.random() * 30, isDark ? 55 : 45),
    secondary: hslToHex(secondaryHue, 30 + Math.random() * 30, isDark ? 50 : 55),
    accent: hslToHex(accentHue, 60 + Math.random() * 30, isDark ? 60 : 50),
    preset: null,
  };
}

export function getSemanticTokens(state: DesignState): SemanticTokens {
  const surface = blendHex(state.background, state.secondary, 0.12);
  const surfaceMuted = blendHex(state.background, state.secondary, 0.2);

  return {
    surface,
    surfaceMuted,
    interactive: state.primary,
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626",
  };
}

export function sanitizePartialState(input: Partial<DesignState>): Partial<DesignState> {
  const safe: Partial<DesignState> = {};

  const background = normalizeHex(input.background ?? null);
  if (background) safe.background = background;

  const text = normalizeHex(input.text ?? null);
  if (text) safe.text = text;

  const primary = normalizeHex(input.primary ?? null);
  if (primary) safe.primary = primary;

  const secondary = normalizeHex(input.secondary ?? null);
  if (secondary) safe.secondary = secondary;

  const accent = normalizeHex(input.accent ?? null);
  if (accent) safe.accent = accent;

  if (typeof input.fontFamily === "string") {
    const fontFamily = sanitizeFontFamily(input.fontFamily);
    if (fontFamily) safe.fontFamily = fontFamily;
  }

  if (typeof input.typeScale === "string" && isInEnum(input.typeScale, TYPE_SCALE_VALUES)) {
    safe.typeScale = input.typeScale;
  }

  if (typeof input.fontWeight === "string" && isInEnum(input.fontWeight, FONT_WEIGHT_VALUES)) {
    safe.fontWeight = input.fontWeight;
  }

  if (typeof input.letterSpacing === "number" && Number.isFinite(input.letterSpacing)) {
    safe.letterSpacing = clamp(
      input.letterSpacing,
      LETTER_SPACING_BOUNDS.min,
      LETTER_SPACING_BOUNDS.max
    );
  }

  if (typeof input.borderRadius === "number" && Number.isFinite(input.borderRadius)) {
    safe.borderRadius = clamp(
      input.borderRadius,
      BORDER_RADIUS_BOUNDS.min,
      BORDER_RADIUS_BOUNDS.max
    );
  }

  if (typeof input.buttonStyle === "string" && isInEnum(input.buttonStyle, BUTTON_STYLE_VALUES)) {
    safe.buttonStyle = input.buttonStyle;
  }

  if (typeof input.baseSpacing === "number" && Number.isFinite(input.baseSpacing)) {
    safe.baseSpacing = clamp(
      input.baseSpacing,
      BASE_SPACING_BOUNDS.min,
      BASE_SPACING_BOUNDS.max
    );
  }

  if (typeof input.shadowIntensity === "string" && isInEnum(input.shadowIntensity, SHADOW_VALUES)) {
    safe.shadowIntensity = input.shadowIntensity;
  }

  if (typeof input.borderVisibility === "string" && isInEnum(input.borderVisibility, BORDER_VALUES)) {
    safe.borderVisibility = input.borderVisibility;
  }

  if (typeof input.preset === "string" && input.preset in PRESETS) {
    safe.preset = input.preset;
  }

  if (input.preset === null) {
    safe.preset = null;
  }

  return safe;
}

export function getDesignGuidance(state: DesignState): DesignGuidanceItem[] {
  const guidance: DesignGuidanceItem[] = [];
  const contrast = getContrastRatio(state.text, state.background);

  if (contrast < 4.5) {
    guidance.push({
      id: "contrast",
      level: "critical",
      title: "Low text contrast",
      detail: `Body text contrast is ${contrast.toFixed(1)}:1. Aim for at least 4.5:1.`,
    });
  } else if (contrast < 7) {
    guidance.push({
      id: "contrast",
      level: "warning",
      title: "Contrast is acceptable",
      detail: `Current contrast is ${contrast.toFixed(1)}:1. 7:1 will improve readability on low quality screens.`,
    });
  } else {
    guidance.push({
      id: "contrast",
      level: "good",
      title: "Strong contrast",
      detail: `Text contrast is ${contrast.toFixed(1)}:1.`,
    });
  }

  const scale = parseFloat(state.typeScale);
  if (scale < 1.2) {
    guidance.push({
      id: "type-scale",
      level: "warning",
      title: "Tight type scale",
      detail: "A larger scale can create stronger hierarchy between heading levels.",
    });
  }

  if (state.letterSpacing < -0.5) {
    guidance.push({
      id: "letter-spacing",
      level: "critical",
      title: "Letter spacing is too tight",
      detail: "Negative spacing below -0.5px can hurt readability for body text.",
    });
  } else if (state.letterSpacing > 3) {
    guidance.push({
      id: "letter-spacing",
      level: "warning",
      title: "Letter spacing is very loose",
      detail: "Consider reducing letter spacing except for small uppercase labels.",
    });
  }

  if (state.borderRadius > 20 && state.borderVisibility === "Strong") {
    guidance.push({
      id: "shape",
      level: "warning",
      title: "Rounded + strong border mix",
      detail: "Large radii with heavy borders can feel visually noisy. Consider softening one of them.",
    });
  }

  if (state.shadowIntensity === "Strong" && state.borderVisibility === "None") {
    guidance.push({
      id: "depth",
      level: "warning",
      title: "Heavy shadow without edge definition",
      detail: "A subtle border can make elevated surfaces look cleaner.",
    });
  }

  return guidance;
}

export function stateToCSS(state: DesignState): string {
  const shadowMap: Record<ShadowIntensity, string> = {
    None: "none",
    Soft: "0 4px 20px rgba(0,0,0,0.08)",
    Medium: "0 6px 30px rgba(0,0,0,0.12)",
    Strong: "0 8px 40px rgba(0,0,0,0.2)",
  };

  const borderMap: Record<BorderVisibility, string> = {
    None: "0px",
    Subtle: "1px",
    Medium: "2px",
    Strong: "3px",
  };

  const fontWeightMap: Record<FontWeight, string> = {
    Light: "300",
    Regular: "400",
    Medium: "500",
    Bold: "700",
  };

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
  --type-scale: ${state.typeScale};
  --font-weight: ${fontWeightMap[state.fontWeight]};
  --letter-spacing: ${state.letterSpacing}px;
  --radius: ${state.borderRadius}px;
  --shadow: ${shadowMap[state.shadowIntensity]};
  --border-width: ${borderMap[state.borderVisibility]};
  --spacing: ${state.baseSpacing}px;
  --motion-duration-fast: 160ms;
  --motion-duration-slow: 320ms;
}`;
}

export function stateToTokenJSON(state: DesignState): string {
  const semantic = getSemanticTokens(state);
  return JSON.stringify(
    {
      version: 1,
      generatedAt: new Date().toISOString(),
      primitive: {
        background: state.background,
        text: state.text,
        primary: state.primary,
        secondary: state.secondary,
        accent: state.accent,
      },
      semantic,
      typography: {
        fontFamily: state.fontFamily,
        typeScale: state.typeScale,
        fontWeight: state.fontWeight,
        letterSpacing: state.letterSpacing,
      },
      shape: {
        borderRadius: state.borderRadius,
        buttonStyle: state.buttonStyle,
        borderVisibility: state.borderVisibility,
      },
      spacing: {
        baseSpacing: state.baseSpacing,
      },
      effects: {
        shadowIntensity: state.shadowIntensity,
      },
      state,
    },
    null,
    2
  );
}

export function stateToTailwindTheme(state: DesignState): string {
  const semantic = getSemanticTokens(state);
  return `// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "${state.background}",
          text: "${state.text}",
          primary: "${state.primary}",
          secondary: "${state.secondary}",
          accent: "${state.accent}",
          surface: "${semantic.surface}",
          "surface-muted": "${semantic.surfaceMuted}",
          success: "${semantic.success}",
          warning: "${semantic.warning}",
          danger: "${semantic.danger}",
        },
      },
      borderRadius: {
        brand: "${state.borderRadius}px",
      },
      fontFamily: {
        brand: ["${state.fontFamily}"],
      },
      spacing: {
        brand: "${state.baseSpacing}px",
      },
      boxShadow: {
        brand: "${
          state.shadowIntensity === "None"
            ? "none"
            : state.shadowIntensity === "Soft"
              ? "0 4px 20px rgba(0,0,0,0.08)"
              : state.shadowIntensity === "Medium"
                ? "0 6px 30px rgba(0,0,0,0.12)"
                : "0 8px 40px rgba(0,0,0,0.2)"
        }",
      },
    },
  },
} satisfies Config;
`;
}

export function parseImportedState(raw: string): Partial<DesignState> | null {
  try {
    const parsed = JSON.parse(raw) as
      | Partial<DesignState>
      | { state?: Partial<DesignState>; primitive?: Partial<DesignState> };

    if (parsed && typeof parsed === "object") {
      const candidate = "state" in parsed ? parsed.state : ("primitive" in parsed ? parsed.primitive : parsed);
      if (candidate && typeof candidate === "object") {
        return sanitizePartialState(candidate as Partial<DesignState>);
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function stateToQueryString(state: DesignState): string {
  const params = new URLSearchParams();
  if (state.preset) params.set("preset", state.preset);
  params.set("bg", state.background.replace("#", ""));
  params.set("text", state.text.replace("#", ""));
  params.set("primary", state.primary.replace("#", ""));
  params.set("secondary", state.secondary.replace("#", ""));
  params.set("accent", state.accent.replace("#", ""));
  params.set("font", state.fontFamily);
  params.set("scale", state.typeScale);
  params.set("weight", state.fontWeight);
  params.set("spacing", state.letterSpacing.toString());
  params.set("radius", state.borderRadius.toString());
  params.set("button", state.buttonStyle);
  params.set("baseSpacing", state.baseSpacing.toString());
  params.set("shadow", state.shadowIntensity);
  params.set("border", state.borderVisibility);
  return params.toString();
}

export function queryStringToState(query: string): Partial<DesignState> {
  const params = new URLSearchParams(query);
  const state: Partial<DesignState> = {
    background: normalizeHex(params.get("bg")) ?? undefined,
    text: normalizeHex(params.get("text")) ?? undefined,
    primary: normalizeHex(params.get("primary")) ?? undefined,
    secondary: normalizeHex(params.get("secondary")) ?? undefined,
    accent: normalizeHex(params.get("accent")) ?? undefined,
  };

  const preset = params.get("preset");
  if (preset && preset in PRESETS) {
    state.preset = preset as PresetName;
  }

  const font = params.get("font");
  if (font) {
    state.fontFamily = font;
  }

  const scale = params.get("scale");
  if (isInEnum(scale, TYPE_SCALE_VALUES)) {
    state.typeScale = scale;
  }

  const weight = params.get("weight");
  if (isInEnum(weight, FONT_WEIGHT_VALUES)) {
    state.fontWeight = weight;
  }

  const spacing = params.get("spacing");
  if (spacing) {
    const parsed = Number.parseFloat(spacing);
    if (Number.isFinite(parsed)) {
      state.letterSpacing = parsed;
    }
  }

  const radius = params.get("radius");
  if (radius) {
    const parsed = Number.parseFloat(radius);
    if (Number.isFinite(parsed)) {
      state.borderRadius = parsed;
    }
  }

  const button = params.get("button");
  if (isInEnum(button, BUTTON_STYLE_VALUES)) {
    state.buttonStyle = button;
  }

  const baseSpacing = params.get("baseSpacing");
  if (baseSpacing) {
    const parsed = Number.parseFloat(baseSpacing);
    if (Number.isFinite(parsed)) {
      state.baseSpacing = parsed;
    }
  }

  const shadow = params.get("shadow");
  if (isInEnum(shadow, SHADOW_VALUES)) {
    state.shadowIntensity = shadow;
  }

  const border = params.get("border");
  if (isInEnum(border, BORDER_VALUES)) {
    state.borderVisibility = border;
  }

  return sanitizePartialState(state);
}
