import type { DesignState } from "@/lib/design-state";
import { createTokenThemeFromState, TokenRegistry } from "@/tokens/registry";

export interface TokenExportOptions {
  themeId?: string;
  themeName?: string;
}

export function exportDesignTokensJSON(state: DesignState, options?: TokenExportOptions): string {
  const theme = createTokenThemeFromState(state, {
    id: options?.themeId,
    name: options?.themeName,
  });

  const registry = new TokenRegistry([theme]);
  return JSON.stringify(registry.snapshot(), null, 2);
}
