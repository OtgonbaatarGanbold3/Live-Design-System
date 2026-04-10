import { describe, expect, it } from "vitest";
import { createTokenThemeFromState, TokenRegistry, type TokenTheme } from "@/tokens/registry";
import { resolveTokenValue } from "@/services/tokenResolver";
import { lintTokenTheme } from "@/tokens/linter";
import type { DesignState } from "@/lib/design-state";

const SAMPLE_STATE: DesignState = {
  background: "#ffffff",
  text: "#111827",
  primary: "#2563eb",
  secondary: "#4b5563",
  accent: "#14b8a6",
  fontFamily: "system-ui",
  typeScale: "1.25",
  fontWeight: "Regular",
  letterSpacing: 0,
  borderRadius: 10,
  buttonStyle: "Filled",
  baseSpacing: 16,
  shadowIntensity: "Soft",
  borderVisibility: "Subtle",
  preset: null,
};

describe("token registry and resolver", () => {
  it("produces lint-clean tokens for generated themes", () => {
    const theme = createTokenThemeFromState(SAMPLE_STATE, { id: "clean", name: "Clean" });
    const result = lintTokenTheme(theme);

    expect(result.valid).toBe(true);
    expect(result.issues.filter((issue) => issue.level === "error")).toHaveLength(0);
  });

  it("resolves inherited token references", () => {
    const base = createTokenThemeFromState(SAMPLE_STATE, { id: "base", name: "Base" });
    const registry = new TokenRegistry([base]);

    registry.createVariantTheme("base", "variant", "Variant", {
      light: {
        semantic: {
          "color.text.primary": {
            type: "color",
            value: { $ref: "primitive.color.brand.500" },
          },
        },
      },
    });

    const resolved = resolveTokenValue(registry, "variant", {
      mode: "light",
      layer: "semantic",
      key: "color.text.primary",
    });

    expect(resolved.value).toBe(base.modes.light.primitive["color.brand.500"].value);
  });

  it("flags schema/layer violations via linter", () => {
    const invalidTheme: TokenTheme = {
      id: "broken",
      name: "Broken",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modes: {
        light: {
          primitive: {},
          semantic: {},
          component: {
            "button.primary.bg": {
              type: "color",
              value: "#fff",
            },
          },
        },
        dark: {
          primitive: {},
          semantic: {},
          component: {},
        },
      },
    };

    const result = lintTokenTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === "component_raw_value")).toBe(true);
  });
});
