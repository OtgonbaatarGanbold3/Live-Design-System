import { describe, expect, it } from "vitest";
import type { DesignState } from "@/lib/design-state";
import { assertTemplateScore, getMinimumPublishScore, scoreTemplate } from "@/quality/scoreEngine";

const SCORE_STATE: DesignState = {
  background: "#ffffff",
  text: "#0f172a",
  primary: "#1d4ed8",
  secondary: "#334155",
  accent: "#0891b2",
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

describe("template quality scoring", () => {
  it("returns weighted scores", () => {
    const score = scoreTemplate("SaaS Landing", SCORE_STATE);

    expect(score.overall).toBeGreaterThan(0);
    expect(score.overall).toBeLessThanOrEqual(100);
    expect(score.accessibility).toBeGreaterThan(0);
  });

  it("enforces minimum publish threshold", () => {
    const score = scoreTemplate("Agency", SCORE_STATE);
    const threshold = getMinimumPublishScore();

    if (score.overall >= threshold) {
      expect(() => assertTemplateScore(score)).not.toThrow();
    } else {
      expect(() => assertTemplateScore(score)).toThrow();
    }
  });
});
