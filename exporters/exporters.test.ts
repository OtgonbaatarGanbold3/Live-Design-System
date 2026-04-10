import { describe, expect, it } from "vitest";
import type { DesignState } from "@/lib/design-state";
import {
  exportCSSVariables,
  exportDesignTokensJSON,
  exportFigmaTokens,
  exportTailwindConfig,
  generateExportReport,
} from "@/exporters";

const EXPORT_STATE: DesignState = {
  background: "#ffffff",
  text: "#0f172a",
  primary: "#1d4ed8",
  secondary: "#475569",
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

describe("exporters", () => {
  it("exports css variables", () => {
    const css = exportCSSVariables(EXPORT_STATE);
    expect(css).toContain("--color-bg");
    expect(css).toContain(EXPORT_STATE.background);
  });

  it("exports design tokens json snapshot", () => {
    const output = exportDesignTokensJSON(EXPORT_STATE);
    const parsed = JSON.parse(output) as { themes: unknown[] };

    expect(Array.isArray(parsed.themes)).toBe(true);
    expect(parsed.themes.length).toBeGreaterThan(0);
  });

  it("exports tailwind and figma payloads", () => {
    const tailwind = exportTailwindConfig(EXPORT_STATE);
    const figma = JSON.parse(exportFigmaTokens(EXPORT_STATE)) as { color: Record<string, unknown> };

    expect(tailwind).toContain("theme");
    expect(figma.color.primary).toBeDefined();
  });

  it("builds export report with validation metadata", () => {
    const report = generateExportReport(EXPORT_STATE);
    expect(report.canExport).toBe(true);
    expect(report.validation.errors).toBe(0);
  });
});
