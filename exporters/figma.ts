import type { DesignState } from "@/lib/design-state";
import { getSemanticTokens } from "@/lib/design-state";

interface FigmaToken {
  $type: string;
  $value: string | number;
}

export function exportFigmaTokens(state: DesignState): string {
  const semantic = getSemanticTokens(state);

  const figmaTokens = {
    color: {
      bg: { $type: "color", $value: state.background },
      text: { $type: "color", $value: state.text },
      primary: { $type: "color", $value: state.primary },
      secondary: { $type: "color", $value: state.secondary },
      accent: { $type: "color", $value: state.accent },
      surface: { $type: "color", $value: semantic.surface },
      surfaceMuted: { $type: "color", $value: semantic.surfaceMuted },
    },
    radius: {
      md: { $type: "borderRadius", $value: state.borderRadius },
    },
    spacing: {
      base: { $type: "spacing", $value: state.baseSpacing },
    },
    typography: {
      family: { $type: "fontFamilies", $value: state.fontFamily },
      scale: { $type: "number", $value: Number.parseFloat(state.typeScale) },
      weight: {
        $type: "fontWeights",
        $value:
          state.fontWeight === "Light"
            ? 300
            : state.fontWeight === "Regular"
              ? 400
              : state.fontWeight === "Medium"
                ? 500
                : 700,
      },
    },
  } satisfies Record<string, Record<string, FigmaToken>>;

  return JSON.stringify(figmaTokens, null, 2);
}
