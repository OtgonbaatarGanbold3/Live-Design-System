import type { DesignState, TemplateName } from "@/lib/design-state";
import { validateTheme } from "@/constraints/engine";
import weights from "@/quality/weights.json";

export interface TemplateScoreBreakdown {
  template: TemplateName;
  accessibility: number;
  responsiveness: number;
  consistency: number;
  performance: number;
  overall: number;
  recommended: boolean;
  needsImprovement: boolean;
}

interface ScoringWeights {
  accessibility: number;
  responsiveness: number;
  consistency: number;
  performance: number;
}

const TEMPLATE_BASELINE: Record<TemplateName, { responsiveness: number; performance: number }> = {
  "SaaS Landing": { responsiveness: 88, performance: 86 },
  Portfolio: { responsiveness: 92, performance: 84 },
  Agency: { responsiveness: 86, performance: 80 },
  "E-commerce": { responsiveness: 90, performance: 78 },
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function accessibilityScore(state: DesignState): number {
  const validation = validateTheme(state);
  const errorPenalty = validation.errors.filter((issue) => issue.rule === "wcag-contrast").length * 35;
  const warningPenalty = validation.warnings.filter((issue) => issue.rule === "wcag-contrast").length * 8;
  return clampScore(100 - errorPenalty - warningPenalty);
}

function consistencyScore(state: DesignState): number {
  const validation = validateTheme(state);
  const consistencyWarnings = validation.warnings.filter(
    (issue) => issue.rule !== "wcag-contrast"
  ).length;
  const consistencyErrors = validation.errors.filter(
    (issue) => issue.rule !== "wcag-contrast"
  ).length;

  return clampScore(100 - consistencyErrors * 25 - consistencyWarnings * 10);
}

function weightedOverall(scores: {
  accessibility: number;
  responsiveness: number;
  consistency: number;
  performance: number;
}): number {
  const config = weights.weights as ScoringWeights;
  return clampScore(
    scores.accessibility * config.accessibility +
      scores.responsiveness * config.responsiveness +
      scores.consistency * config.consistency +
      scores.performance * config.performance
  );
}

export function scoreTemplate(template: TemplateName, state: DesignState): TemplateScoreBreakdown {
  const baseline = TEMPLATE_BASELINE[template];
  const accessibility = accessibilityScore(state);
  const consistency = consistencyScore(state);
  const responsiveness = baseline.responsiveness;
  const performance = baseline.performance;

  const overall = weightedOverall({
    accessibility,
    responsiveness,
    consistency,
    performance,
  });

  const threshold = Number(weights.minimumPublishScore);

  return {
    template,
    accessibility,
    responsiveness,
    consistency,
    performance,
    overall,
    recommended: overall >= 88,
    needsImprovement: overall < threshold,
  };
}

export function scoreTemplates(state: DesignState, templates: TemplateName[]): TemplateScoreBreakdown[] {
  return templates.map((template) => scoreTemplate(template, state));
}

export function getMinimumPublishScore(): number {
  return Number(weights.minimumPublishScore);
}

export function assertTemplateScore(score: TemplateScoreBreakdown): void {
  const threshold = getMinimumPublishScore();
  if (score.overall < threshold) {
    throw new Error(
      `Template '${score.template}' scored ${score.overall}, below required threshold ${threshold}.`
    );
  }
}
