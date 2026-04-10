import type { DesignState } from "@/lib/design-state";
import { validateTheme } from "@/constraints/engine";

export interface ExportCompatibility {
  designTokensJson: boolean;
  cssVariables: boolean;
  tailwind: boolean;
  figmaTokens: boolean;
}

export interface ExportReport {
  generatedAt: string;
  canExport: boolean;
  compatibility: ExportCompatibility;
  validation: {
    errors: number;
    warnings: number;
    info: number;
    issues: ReturnType<typeof validateTheme>["issues"];
  };
}

export function generateExportReport(state: DesignState): ExportReport {
  const validation = validateTheme(state);

  return {
    generatedAt: new Date().toISOString(),
    canExport: validation.canExport,
    compatibility: {
      designTokensJson: validation.canExport,
      cssVariables: validation.canExport,
      tailwind: validation.canExport,
      figmaTokens: validation.canExport,
    },
    validation: {
      errors: validation.errors.length,
      warnings: validation.warnings.length,
      info: validation.info.length,
      issues: validation.issues,
    },
  };
}
