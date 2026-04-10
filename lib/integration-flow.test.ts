import { describe, expect, it } from "vitest";
import { DEFAULT_STATE } from "@/lib/design-state";
import { applyFeelingPreset } from "@/presets";
import { validateTheme } from "@/constraints/engine";
import { exportDesignTokensJSON } from "@/exporters/json";

describe("preset -> customize -> validate -> export flow", () => {
  it("completes the MVP flow successfully", () => {
    const fromPreset = applyFeelingPreset(DEFAULT_STATE, "Calm");
    const customized = {
      ...fromPreset,
      primary: "#1d4ed8",
      text: "#0f172a",
      baseSpacing: 16,
    };

    const validation = validateTheme(customized);
    expect(validation.canExport).toBe(true);

    const exported = exportDesignTokensJSON(customized);
    const parsed = JSON.parse(exported) as { themes: unknown[] };
    expect(parsed.themes.length).toBeGreaterThan(0);
  });
});
