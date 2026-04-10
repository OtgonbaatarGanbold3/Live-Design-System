import type { DesignState, TemplateName } from "@/lib/design-state";

export const TEMPLATE_DEFAULT_OVERRIDES: Record<TemplateName, Partial<DesignState>> = {
  "SaaS Landing": {
    typeScale: "1.333",
    buttonStyle: "Filled",
    borderRadius: 10,
    baseSpacing: 16,
    shadowIntensity: "Soft",
  },
  Portfolio: {
    typeScale: "1.414",
    buttonStyle: "Outline",
    borderRadius: 8,
    baseSpacing: 20,
    shadowIntensity: "None",
  },
  Agency: {
    typeScale: "1.333",
    buttonStyle: "Filled",
    borderRadius: 6,
    baseSpacing: 18,
    shadowIntensity: "Medium",
  },
  "E-commerce": {
    typeScale: "1.25",
    buttonStyle: "Filled",
    borderRadius: 12,
    baseSpacing: 16,
    shadowIntensity: "Soft",
  },
};

export function getTemplateRecommendedDefaults(template: TemplateName): Partial<DesignState> {
  return TEMPLATE_DEFAULT_OVERRIDES[template] ?? {};
}
