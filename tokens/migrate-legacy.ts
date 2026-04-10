import type { DesignState } from "@/lib/design-state";
import type { TokenLayer, TokenSet, TokenType } from "@/tokens/registry";

interface LegacyMapEntry {
  layer: TokenLayer;
  key: string;
  type: TokenType;
}

const LEGACY_MAP: Record<string, LegacyMapEntry> = {
  background: { layer: "primitive", key: "color.background.0", type: "color" },
  text: { layer: "primitive", key: "color.text.900", type: "color" },
  primary: { layer: "primitive", key: "color.brand.500", type: "color" },
  secondary: { layer: "primitive", key: "color.secondary.500", type: "color" },
  accent: { layer: "primitive", key: "color.accent.500", type: "color" },
  fontFamily: { layer: "primitive", key: "font.family.base", type: "typography" },
  fontWeight: { layer: "primitive", key: "font.weight.base", type: "typography" },
  baseSpacing: { layer: "primitive", key: "space.4", type: "spacing" },
  borderRadius: { layer: "primitive", key: "radius.md", type: "radius" },
};

function createEmptySet(): TokenSet {
  return {
    primitive: {},
    semantic: {},
    component: {},
  };
}

function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null;
}

function toLegacyRecord(payload: unknown): Record<string, unknown> {
  if (!isObject(payload)) return {};

  if ("state" in payload && isObject(payload.state)) {
    return payload.state;
  }

  if ("primitive" in payload && isObject(payload.primitive)) {
    return payload.primitive;
  }

  return payload;
}

export function migrateLegacyTokens(payload: unknown): Partial<TokenSet> {
  const legacy = toLegacyRecord(payload);
  const result = createEmptySet();

  for (const [legacyKey, entry] of Object.entries(LEGACY_MAP)) {
    if (!(legacyKey in legacy)) continue;

    const value = legacy[legacyKey];
    if (typeof value !== "string" && typeof value !== "number") continue;

    result[entry.layer][entry.key] = {
      type: entry.type,
      value,
      description: `Migrated from legacy key '${legacyKey}'.`,
    };
  }

  if (Object.keys(result.primitive).length === 0) {
    return {};
  }

  if (!result.semantic["color.bg.surface"]) {
    result.semantic["color.bg.surface"] = {
      type: "color",
      value: { $ref: "primitive.color.background.0" },
    };
  }

  if (!result.semantic["color.text.primary"]) {
    result.semantic["color.text.primary"] = {
      type: "color",
      value: { $ref: "primitive.color.text.900" },
    };
  }

  if (!result.component["button.primary.bg"]) {
    result.component["button.primary.bg"] = {
      type: "color",
      value: { $ref: "primitive.color.brand.500", allowPrimitiveReference: true },
    };
  }

  return result;
}

export function migrateLegacyState(state: Partial<DesignState>): Partial<TokenSet> {
  return migrateLegacyTokens(state);
}
