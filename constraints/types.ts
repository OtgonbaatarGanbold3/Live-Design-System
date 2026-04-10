import type { DesignState } from "@/lib/design-state";

export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
  id: string;
  rule: string;
  severity: ValidationSeverity;
  message: string;
  suggestion: string;
  metric?: number;
}

export interface ValidationResult {
  valid: boolean;
  canExport: boolean;
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
}

export type ThemeRule = (state: DesignState) => ValidationIssue[];
