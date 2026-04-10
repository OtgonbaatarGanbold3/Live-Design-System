import type { DesignState } from "@/lib/design-state";
import { getContrastRatio } from "@/lib/design-state";
import type { ValidationIssue } from "@/constraints/types";

const AA_MINIMUM = 4.5;

function toPercentGap(ratio: number): number {
  if (ratio >= AA_MINIMUM) return 0;
  const gap = ((AA_MINIMUM - ratio) / AA_MINIMUM) * 100;
  return Math.max(1, Math.round(gap));
}

function evaluatePair(options: {
  id: string;
  label: string;
  foreground: string;
  background: string;
  severityOnFail: ValidationIssue["severity"];
}): ValidationIssue | null {
  const ratio = getContrastRatio(options.foreground, options.background);
  if (ratio >= AA_MINIMUM) {
    return null;
  }

  return {
    id: options.id,
    rule: "wcag-contrast",
    severity: options.severityOnFail,
    message: `${options.label} contrast is ${ratio.toFixed(2)}:1.`,
    suggestion: `Increase text contrast by ${toPercentGap(ratio)}% to reach AA minimum (${AA_MINIMUM}:1).`,
    metric: ratio,
  };
}

export function wcagContrastRule(state: DesignState): ValidationIssue[] {
  const checks = [
    evaluatePair({
      id: "contrast-body-text",
      label: "Body text against background",
      foreground: state.text,
      background: state.background,
      severityOnFail: "error",
    }),
    evaluatePair({
      id: "contrast-primary-action",
      label: "Primary action against background",
      foreground: state.primary,
      background: state.background,
      severityOnFail: "error",
    }),
    evaluatePair({
      id: "contrast-secondary-text",
      label: "Secondary color against background",
      foreground: state.secondary,
      background: state.background,
      severityOnFail: "warning",
    }),
    evaluatePair({
      id: "contrast-accent-text",
      label: "Accent color against background",
      foreground: state.accent,
      background: state.background,
      severityOnFail: "warning",
    }),
  ];

  return checks.filter((check): check is ValidationIssue => check !== null);
}
