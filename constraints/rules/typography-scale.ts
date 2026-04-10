import type { DesignState } from "@/lib/design-state";
import type { ValidationIssue } from "@/constraints/types";

const SCALE_MIN = 1.125;
const SCALE_MAX = 1.5;

export function typographyScaleRule(state: DesignState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const scale = Number.parseFloat(state.typeScale);

  if (scale < SCALE_MIN) {
    issues.push({
      id: "type-scale-small",
      rule: "typography-scale",
      severity: "warning",
      message: `Type scale (${scale.toFixed(3)}) is very tight.`,
      suggestion: "Increase scale to at least 1.125 for clearer hierarchy.",
      metric: scale,
    });
  }

  if (scale > SCALE_MAX) {
    issues.push({
      id: "type-scale-large",
      rule: "typography-scale",
      severity: "warning",
      message: `Type scale (${scale.toFixed(3)}) is very wide.`,
      suggestion: "Reduce scale to 1.5 or below to avoid oversized heading jumps.",
      metric: scale,
    });
  }

  if (state.letterSpacing < -0.5) {
    issues.push({
      id: "letter-spacing-tight",
      rule: "typography-scale",
      severity: "error",
      message: `Letter spacing (${state.letterSpacing}px) is too tight for body text.`,
      suggestion: "Increase letter spacing to at least -0.5px.",
      metric: state.letterSpacing,
    });
  }

  if (state.letterSpacing > 3) {
    issues.push({
      id: "letter-spacing-loose",
      rule: "typography-scale",
      severity: "warning",
      message: `Letter spacing (${state.letterSpacing}px) is unusually loose.`,
      suggestion: "Use 0px to 2px for general body content.",
      metric: state.letterSpacing,
    });
  }

  return issues;
}
