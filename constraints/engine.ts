import type { DesignState } from "@/lib/design-state";
import type { ThemeRule, ValidationIssue, ValidationResult } from "@/constraints/types";
import { wcagContrastRule } from "@/constraints/rules/wcag-contrast";
import { typographyScaleRule } from "@/constraints/rules/typography-scale";
import { spacingConsistencyRule } from "@/constraints/rules/spacing-consistency";
import { radiusShadowHarmonyRule } from "@/constraints/rules/radius-shadow-harmony";

const DEFAULT_RULES: ThemeRule[] = [
  wcagContrastRule,
  typographyScaleRule,
  spacingConsistencyRule,
  radiusShadowHarmonyRule,
];

function severityWeight(issue: ValidationIssue): number {
  if (issue.severity === "error") return 0;
  if (issue.severity === "warning") return 1;
  return 2;
}

export function validateTheme(state: DesignState, rules: ThemeRule[] = DEFAULT_RULES): ValidationResult {
  const issues = rules.flatMap((rule) => rule(state)).sort((a, b) => severityWeight(a) - severityWeight(b));

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  const info = issues.filter((issue) => issue.severity === "info");

  return {
    valid: errors.length === 0,
    canExport: errors.length === 0,
    issues,
    errors,
    warnings,
    info,
  };
}

export { DEFAULT_RULES };
