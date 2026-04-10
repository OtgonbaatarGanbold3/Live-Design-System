import { describe, expect, it } from "vitest";
import type { DesignState } from "@/lib/design-state";
import { validateTheme } from "@/constraints/engine";

const ACCESSIBLE_STATE: DesignState = {
  background: "#ffffff",
  text: "#111827",
  primary: "#1f2937",
  secondary: "#4b5563",
  accent: "#0ea5e9",
  fontFamily: "system-ui",
  typeScale: "1.25",
  fontWeight: "Regular",
  letterSpacing: 0,
  borderRadius: 8,
  buttonStyle: "Filled",
  baseSpacing: 16,
  shadowIntensity: "Soft",
  borderVisibility: "Subtle",
  preset: null,
};

describe("validateTheme", () => {
  it("passes export readiness for accessible themes", () => {
    const result = validateTheme(ACCESSIBLE_STATE);

    expect(result.valid).toBe(true);
    expect(result.canExport).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("returns actionable errors for invalid combinations", () => {
    const result = validateTheme({
      ...ACCESSIBLE_STATE,
      text: "#f5f5f5",
      primary: "#f6f6f6",
      letterSpacing: -1,
      baseSpacing: 17,
    });

    expect(result.valid).toBe(false);
    expect(result.canExport).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.issues[0].suggestion.length).toBeGreaterThan(0);
  });
});
