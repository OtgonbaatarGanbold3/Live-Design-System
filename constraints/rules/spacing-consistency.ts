import type { DesignState } from "@/lib/design-state";
import type { ValidationIssue } from "@/constraints/types";

const RECOMMENDED_STEPS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 24];

function nearestStep(value: number): number {
  return RECOMMENDED_STEPS.reduce((nearest, step) => {
    return Math.abs(step - value) < Math.abs(nearest - value) ? step : nearest;
  }, RECOMMENDED_STEPS[0]);
}

export function spacingConsistencyRule(state: DesignState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!RECOMMENDED_STEPS.includes(state.baseSpacing)) {
    const suggested = nearestStep(state.baseSpacing);
    issues.push({
      id: "spacing-step-off-grid",
      rule: "spacing-consistency",
      severity: "warning",
      message: `Base spacing (${state.baseSpacing}px) is off the shared spacing scale.`,
      suggestion: `Use spacing scale step ${suggested}px instead of ${state.baseSpacing}px for this component set.`,
      metric: state.baseSpacing,
    });
  }

  const derived = [state.baseSpacing / 2, state.baseSpacing, state.baseSpacing * 1.5, state.baseSpacing * 2];
  const hasOffGridDerived = derived.some((value) => value % 2 !== 0);
  if (hasOffGridDerived) {
    issues.push({
      id: "spacing-derived-off-grid",
      rule: "spacing-consistency",
      severity: "info",
      message: "Some derived spacing values do not align to a 2px grid.",
      suggestion: "Choose a base spacing that keeps half and 1.5x steps on an even grid.",
    });
  }

  return issues;
}
