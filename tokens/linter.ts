import type {
  TokenDefinition,
  TokenLayer,
  TokenMode,
  TokenReference,
  TokenRegistrySnapshot,
  TokenTheme,
} from "@/tokens/registry";

const TOKEN_NAME_RE = /^[a-z0-9]+([.-][a-z0-9]+)*$/;

export interface TokenLintIssue {
  level: "error" | "warning";
  code: string;
  message: string;
  themeId: string;
  mode?: TokenMode;
  layer?: TokenLayer;
  key?: string;
  suggestion?: string;
}

export interface TokenLintResult {
  valid: boolean;
  issues: TokenLintIssue[];
}

const REQUIRED_SEMANTIC_KEYS = [
  "color.bg.surface",
  "color.text.primary",
  "color.interactive.primary",
  "space.component.padding.md",
  "radius.component.md",
];

function isTokenReference(value: TokenDefinition["value"]): value is TokenReference {
  return typeof value === "object" && value !== null && "$ref" in value;
}

function checkNaming(theme: TokenTheme, result: TokenLintIssue[]) {
  for (const mode of ["light", "dark"] as const) {
    for (const layer of ["primitive", "semantic", "component"] as const) {
      const layerTokens = theme.modes[mode][layer];
      for (const key of Object.keys(layerTokens)) {
        if (!TOKEN_NAME_RE.test(key)) {
          result.push({
            level: "error",
            code: "token_name_invalid",
            message: `Token '${layer}.${key}' uses an invalid name format.`,
            themeId: theme.id,
            mode,
            layer,
            key,
            suggestion: "Use lowercase dot-separated or dash-separated names like color.bg.surface.",
          });
        }
      }
    }
  }
}

function checkRequiredSemanticCoverage(theme: TokenTheme, result: TokenLintIssue[]) {
  for (const mode of ["light", "dark"] as const) {
    for (const key of REQUIRED_SEMANTIC_KEYS) {
      if (!theme.modes[mode].semantic[key]) {
        result.push({
          level: "error",
          code: "semantic_missing",
          message: `Missing required semantic token '${key}' in ${mode} mode.`,
          themeId: theme.id,
          mode,
          layer: "semantic",
          key,
          suggestion: `Add semantic.${key} and reference a primitive token.`,
        });
      }
    }
  }
}

function checkComponentPrimitiveReferences(theme: TokenTheme, result: TokenLintIssue[]) {
  for (const mode of ["light", "dark"] as const) {
    for (const [key, token] of Object.entries(theme.modes[mode].component)) {
      if (!isTokenReference(token.value)) {
        result.push({
          level: "error",
          code: "component_raw_value",
          message: `Component token '${key}' has a raw value.`,
          themeId: theme.id,
          mode,
          layer: "component",
          key,
          suggestion: "Reference semantic tokens from component tokens to avoid primitive coupling.",
        });
        continue;
      }

      if (token.value.$ref.startsWith("primitive.") && token.value.allowPrimitiveReference !== true) {
        result.push({
          level: "error",
          code: "component_primitive_reference",
          message: `Component token '${key}' directly references '${token.value.$ref}'.`,
          themeId: theme.id,
          mode,
          layer: "component",
          key,
          suggestion: "Reference semantic tokens from component tokens. Set allowPrimitiveReference only when unavoidable.",
        });
      }
    }
  }
}

function checkBrokenReferences(theme: TokenTheme, result: TokenLintIssue[]) {
  for (const mode of ["light", "dark"] as const) {
    for (const layer of ["primitive", "semantic", "component"] as const) {
      for (const [key, token] of Object.entries(theme.modes[mode][layer])) {
        if (!isTokenReference(token.value)) continue;

        const [targetLayer, ...rest] = token.value.$ref.split(".");
        const targetKey = rest.join(".");

        if (targetLayer !== "primitive" && targetLayer !== "semantic" && targetLayer !== "component") {
          result.push({
            level: "error",
            code: "reference_layer_invalid",
            message: `Token '${layer}.${key}' references unknown layer '${targetLayer}'.`,
            themeId: theme.id,
            mode,
            layer,
            key,
          });
          continue;
        }

        const exists = targetKey in theme.modes[mode][targetLayer];
        if (!exists) {
          result.push({
            level: "warning",
            code: "reference_missing_in_mode",
            message: `Reference '${token.value.$ref}' used by '${layer}.${key}' is missing in ${mode} mode.`,
            themeId: theme.id,
            mode,
            layer,
            key,
            suggestion: "Define the target token in this mode or rely on an inherited base theme token.",
          });
        }
      }
    }
  }
}

export function lintTokenTheme(theme: TokenTheme): TokenLintResult {
  const issues: TokenLintIssue[] = [];

  checkNaming(theme, issues);
  checkRequiredSemanticCoverage(theme, issues);
  checkComponentPrimitiveReferences(theme, issues);
  checkBrokenReferences(theme, issues);

  return {
    valid: issues.every((issue) => issue.level !== "error"),
    issues,
  };
}

export function lintTokenRegistry(snapshot: TokenRegistrySnapshot): TokenLintResult {
  const allIssues: TokenLintIssue[] = [];

  for (const theme of snapshot.themes) {
    const result = lintTokenTheme(theme);
    allIssues.push(...result.issues);
  }

  return {
    valid: allIssues.every((issue) => issue.level !== "error"),
    issues: allIssues,
  };
}
