import type { DesignState, TemplateName } from "@/lib/design-state";
import calm from "@/presets/calm.json";
import bold from "@/presets/bold.json";
import playful from "@/presets/playful.json";
import premium from "@/presets/premium.json";
import minimal from "@/presets/minimal.json";
import editorial from "@/presets/editorial.json";
import { createTokenThemeFromState, type TokenTheme } from "@/tokens/registry";

export type FeelingPresetName = "Calm" | "Bold" | "Playful" | "Premium" | "Minimal" | "Editorial";

export interface FeelingPreset {
  name: FeelingPresetName;
  description: string;
  recommendedTemplates: TemplateName[];
  state: Omit<DesignState, "preset">;
}

const PRESET_BUNDLES: Record<FeelingPresetName, FeelingPreset> = {
  Calm: calm as FeelingPreset,
  Bold: bold as FeelingPreset,
  Playful: playful as FeelingPreset,
  Premium: premium as FeelingPreset,
  Minimal: minimal as FeelingPreset,
  Editorial: editorial as FeelingPreset,
};

export const FEELING_PRESETS = Object.values(PRESET_BUNDLES);

export function getFeelingPreset(name: FeelingPresetName): FeelingPreset {
  return PRESET_BUNDLES[name];
}

export function applyFeelingPreset(
  state: DesignState,
  name: FeelingPresetName
): DesignState {
  return {
    ...state,
    ...PRESET_BUNDLES[name].state,
    preset: null,
  };
}

export function presetToTokenTheme(name: FeelingPresetName): TokenTheme {
  const preset = getFeelingPreset(name);
  return createTokenThemeFromState(
    {
      ...preset.state,
      preset: null,
    },
    {
      id: `preset-${name.toLowerCase()}`,
      name,
      metadata: {
        source: "feeling-preset",
      },
    }
  );
}
