import type { DesignState } from "@/lib/design-state";

export type TokenMode = "light" | "dark";
export type TokenLayer = "primitive" | "semantic" | "component";
export type TokenType = "color" | "spacing" | "radius" | "shadow" | "typography" | "size" | "other";

export interface TokenReference {
  $ref: `${TokenLayer}.${string}`;
  allowPrimitiveReference?: boolean;
}

export type TokenValue = string | number | TokenReference;

export interface TokenDefinition {
  type: TokenType;
  value: TokenValue;
  description?: string;
}

export type TokenLayerMap = Record<string, TokenDefinition>;

export interface TokenSet {
  primitive: TokenLayerMap;
  semantic: TokenLayerMap;
  component: TokenLayerMap;
}

export interface TokenTheme {
  id: string;
  name: string;
  extends?: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
  modes: Record<TokenMode, TokenSet>;
}

export interface TokenRegistrySnapshot {
  version: number;
  themes: TokenTheme[];
}

export interface CreateThemeInput {
  id: string;
  name: string;
  extends?: string;
  metadata?: Record<string, string | number | boolean>;
  modes?: Partial<Record<TokenMode, Partial<TokenSet>>>;
}

export interface TokenAddress {
  mode: TokenMode;
  layer: TokenLayer;
  key: string;
}

function emptySet(): TokenSet {
  return {
    primitive: {},
    semantic: {},
    component: {},
  };
}

function cloneSet(input: Partial<TokenSet> | undefined): TokenSet {
  return {
    primitive: { ...(input?.primitive ?? {}) },
    semantic: { ...(input?.semantic ?? {}) },
    component: { ...(input?.component ?? {}) },
  };
}

function normalizeHex(hex: string): string {
  if (!hex) return "#000000";
  const value = hex.startsWith("#") ? hex : `#${hex}`;
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value.toLowerCase();
  }
  return "#000000";
}

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0"))
    .join("")}`;
}

function shiftHex(hex: string, offset: number): string {
  const value = normalizeHex(hex);
  const red = Number.parseInt(value.slice(1, 3), 16);
  const green = Number.parseInt(value.slice(3, 5), 16);
  const blue = Number.parseInt(value.slice(5, 7), 16);

  return rgbToHex(red + offset, green + offset, blue + offset);
}

function mapShadow(shadow: DesignState["shadowIntensity"]): string {
  if (shadow === "None") return "none";
  if (shadow === "Soft") return "0 4px 20px rgba(0,0,0,0.08)";
  if (shadow === "Medium") return "0 8px 28px rgba(0,0,0,0.14)";
  return "0 12px 36px rgba(0,0,0,0.22)";
}

function mapBorder(border: DesignState["borderVisibility"]): number {
  if (border === "None") return 0;
  if (border === "Subtle") return 1;
  if (border === "Medium") return 2;
  return 3;
}

function mapFontWeight(weight: DesignState["fontWeight"]): number {
  if (weight === "Light") return 300;
  if (weight === "Regular") return 400;
  if (weight === "Medium") return 500;
  return 700;
}

function buildLightTokenSet(state: DesignState): TokenSet {
  return {
    primitive: {
      "color.background.0": { type: "color", value: normalizeHex(state.background) },
      "color.text.900": { type: "color", value: normalizeHex(state.text) },
      "color.brand.500": { type: "color", value: normalizeHex(state.primary) },
      "color.brand.300": { type: "color", value: shiftHex(state.primary, 24) },
      "color.secondary.500": { type: "color", value: normalizeHex(state.secondary) },
      "color.accent.500": { type: "color", value: normalizeHex(state.accent) },
      "space.2": { type: "spacing", value: Math.max(4, Math.round(state.baseSpacing / 2)) },
      "space.4": { type: "spacing", value: state.baseSpacing },
      "space.6": { type: "spacing", value: state.baseSpacing + 8 },
      "radius.md": { type: "radius", value: state.borderRadius },
      "font.weight.base": { type: "typography", value: mapFontWeight(state.fontWeight) },
      "font.family.base": { type: "typography", value: state.fontFamily },
      "elevation.surface": { type: "shadow", value: mapShadow(state.shadowIntensity) },
      "border.width.base": { type: "size", value: mapBorder(state.borderVisibility) },
    },
    semantic: {
      "color.bg.surface": { type: "color", value: { $ref: "primitive.color.background.0" } },
      "color.bg.canvas": { type: "color", value: { $ref: "primitive.color.background.0" } },
      "color.text.primary": { type: "color", value: { $ref: "primitive.color.text.900" } },
      "color.text.muted": { type: "color", value: { $ref: "primitive.color.secondary.500" } },
      "color.interactive.primary": { type: "color", value: { $ref: "primitive.color.brand.500" } },
      "color.interactive.accent": { type: "color", value: { $ref: "primitive.color.accent.500" } },
      "space.component.padding.md": { type: "spacing", value: { $ref: "primitive.space.4" } },
      "space.component.gap.md": { type: "spacing", value: { $ref: "primitive.space.2" } },
      "radius.component.md": { type: "radius", value: { $ref: "primitive.radius.md" } },
      "elevation.component.default": { type: "shadow", value: { $ref: "primitive.elevation.surface" } },
      "typography.body.family": { type: "typography", value: { $ref: "primitive.font.family.base" } },
      "typography.body.weight": { type: "typography", value: { $ref: "primitive.font.weight.base" } },
    },
    component: {
      "button.primary.bg": { type: "color", value: { $ref: "semantic.color.interactive.primary" } },
      "button.primary.fg": { type: "color", value: { $ref: "semantic.color.bg.surface" } },
      "button.primary.radius": { type: "radius", value: { $ref: "semantic.radius.component.md" } },
      "button.primary.padding-x": { type: "spacing", value: { $ref: "semantic.space.component.padding.md" } },
      "button.primary.shadow": { type: "shadow", value: { $ref: "semantic.elevation.component.default" } },
      "input.border.default": { type: "size", value: { $ref: "primitive.border.width.base", allowPrimitiveReference: true } },
      "input.border.focus": { type: "color", value: { $ref: "semantic.color.interactive.accent" } },
      "input.bg": { type: "color", value: { $ref: "semantic.color.bg.surface" } },
      "input.text": { type: "color", value: { $ref: "semantic.color.text.primary" } },
      "surface.card.bg": { type: "color", value: { $ref: "semantic.color.bg.canvas" } },
      "surface.card.radius": { type: "radius", value: { $ref: "semantic.radius.component.md" } },
      "surface.card.shadow": { type: "shadow", value: { $ref: "semantic.elevation.component.default" } },
    },
  };
}

function buildDarkTokenSet(light: TokenSet): TokenSet {
  const dark = cloneSet(light);

  const darkBackground = shiftHex(String(light.primitive["color.background.0"]?.value ?? "#ffffff"), -40);
  const darkText = shiftHex(String(light.primitive["color.text.900"]?.value ?? "#111111"), 180);

  dark.primitive["color.background.0"] = {
    ...dark.primitive["color.background.0"],
    value: darkBackground,
  };
  dark.primitive["color.text.900"] = {
    ...dark.primitive["color.text.900"],
    value: darkText,
  };

  return dark;
}

export function createTokenThemeFromState(
  state: DesignState,
  options?: { id?: string; name?: string; extends?: string; metadata?: Record<string, string | number | boolean> }
): TokenTheme {
  const now = new Date().toISOString();
  const id = options?.id ?? `theme-${Date.now()}`;

  const light = buildLightTokenSet(state);
  const dark = buildDarkTokenSet(light);

  return {
    id,
    name: options?.name ?? state.preset ?? "Custom Theme",
    extends: options?.extends,
    metadata: options?.metadata,
    createdAt: now,
    updatedAt: now,
    modes: {
      light,
      dark,
    },
  };
}

export class TokenRegistry {
  private readonly themes = new Map<string, TokenTheme>();
  private version = 1;

  constructor(initialThemes?: TokenTheme[]) {
    for (const theme of initialThemes ?? []) {
      this.themes.set(theme.id, theme);
    }
  }

  getVersion(): number {
    return this.version;
  }

  listThemes(): TokenTheme[] {
    return [...this.themes.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  getTheme(themeId: string): TokenTheme | undefined {
    return this.themes.get(themeId);
  }

  createTheme(input: CreateThemeInput): TokenTheme {
    if (this.themes.has(input.id)) {
      throw new Error(`Theme '${input.id}' already exists.`);
    }

    const now = new Date().toISOString();
    const theme: TokenTheme = {
      id: input.id,
      name: input.name,
      extends: input.extends,
      metadata: input.metadata,
      createdAt: now,
      updatedAt: now,
      modes: {
        light: cloneSet(input.modes?.light ?? emptySet()),
        dark: cloneSet(input.modes?.dark ?? input.modes?.light ?? emptySet()),
      },
    };

    this.themes.set(theme.id, theme);
    this.version += 1;
    return theme;
  }

  upsertTheme(theme: TokenTheme): TokenTheme {
    const now = new Date().toISOString();
    const existing = this.themes.get(theme.id);

    const normalized: TokenTheme = {
      ...theme,
      createdAt: existing?.createdAt ?? theme.createdAt ?? now,
      updatedAt: now,
      modes: {
        light: cloneSet(theme.modes.light),
        dark: cloneSet(theme.modes.dark),
      },
    };

    this.themes.set(theme.id, normalized);
    this.version += 1;
    return normalized;
  }

  createVariantTheme(
    baseThemeId: string,
    variantId: string,
    variantName: string,
    overrides?: Partial<Record<TokenMode, Partial<TokenSet>>>
  ): TokenTheme {
    const base = this.themes.get(baseThemeId);
    if (!base) {
      throw new Error(`Base theme '${baseThemeId}' was not found.`);
    }

    const theme = this.createTheme({
      id: variantId,
      name: variantName,
      extends: baseThemeId,
      modes: {
        light: {
          primitive: { ...(overrides?.light?.primitive ?? {}) },
          semantic: { ...(overrides?.light?.semantic ?? {}) },
          component: { ...(overrides?.light?.component ?? {}) },
        },
        dark: {
          primitive: { ...(overrides?.dark?.primitive ?? {}) },
          semantic: { ...(overrides?.dark?.semantic ?? {}) },
          component: { ...(overrides?.dark?.component ?? {}) },
        },
      },
      metadata: {
        variantOf: baseThemeId,
      },
    });

    return theme;
  }

  deleteTheme(themeId: string): boolean {
    const removed = this.themes.delete(themeId);
    if (removed) {
      this.version += 1;
    }
    return removed;
  }

  getToken(themeId: string, address: TokenAddress): TokenDefinition | undefined {
    return this.themes.get(themeId)?.modes[address.mode][address.layer][address.key];
  }

  listTokens(themeId: string, mode: TokenMode, layer: TokenLayer): Record<string, TokenDefinition> {
    return { ...(this.themes.get(themeId)?.modes[mode][layer] ?? {}) };
  }

  upsertToken(themeId: string, address: TokenAddress, token: TokenDefinition): TokenDefinition {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme '${themeId}' was not found.`);
    }

    theme.modes[address.mode][address.layer][address.key] = token;
    theme.updatedAt = new Date().toISOString();
    this.version += 1;
    return token;
  }

  deleteToken(themeId: string, address: TokenAddress): boolean {
    const theme = this.themes.get(themeId);
    if (!theme) return false;

    if (!(address.key in theme.modes[address.mode][address.layer])) {
      return false;
    }

    delete theme.modes[address.mode][address.layer][address.key];
    theme.updatedAt = new Date().toISOString();
    this.version += 1;
    return true;
  }

  snapshot(): TokenRegistrySnapshot {
    return {
      version: this.version,
      themes: this.listThemes(),
    };
  }
}
