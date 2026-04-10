import type { DesignState } from "@/lib/design-state";
import type { ValidationIssue } from "@/constraints/types";

export function radiusShadowHarmonyRule(state: DesignState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (state.borderRadius >= 20 && state.shadowIntensity === "Strong") {
    issues.push({
      id: "radius-shadow-heavy",
      rule: "radius-shadow-harmony",
      severity: "warning",
      message: "Large radius paired with strong shadows can feel visually noisy.",
      suggestion: "Reduce radius below 20px or lower shadow intensity to Medium.",
    });
  }

  if (state.borderVisibility === "None" && state.shadowIntensity === "Strong") {
    issues.push({
      id: "border-shadow-balance",
      rule: "radius-shadow-harmony",
      severity: "warning",
      message: "Strong shadows without borders can reduce component edge clarity.",
      suggestion: "Use subtle borders or reduce shadow strength.",
    });
  }

  if (state.borderRadius === 0 && state.shadowIntensity !== "None") {
    issues.push({
      id: "radius-shadow-style-mismatch",
      rule: "radius-shadow-harmony",
      severity: "info",
      message: "Square corners with elevated shadows may not match all visual styles.",
      suggestion: "Add a small radius (4px to 8px) or flatten shadows for a sharper look.",
    });
  }

  return issues;
}
