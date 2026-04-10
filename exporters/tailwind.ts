import type { DesignState } from "@/lib/design-state";
import { getSemanticTokens } from "@/lib/design-state";

function resolveShadow(shadow: DesignState["shadowIntensity"]): string {
  if (shadow === "None") return "none";
  if (shadow === "Soft") return "0 4px 20px rgba(0,0,0,0.08)";
  if (shadow === "Medium") return "0 6px 30px rgba(0,0,0,0.12)";
  return "0 8px 40px rgba(0,0,0,0.2)";
}

export function exportTailwindConfig(state: DesignState): string {
  const semantic = getSemanticTokens(state);

  return `import type { Config } from "tailwindcss";

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          background: "${state.background}",
          text: "${state.text}",
          primary: "${state.primary}",
          secondary: "${state.secondary}",
          accent: "${state.accent}",
          surface: "${semantic.surface}",
          surfaceMuted: "${semantic.surfaceMuted}",
          success: "${semantic.success}",
          warning: "${semantic.warning}",
          danger: "${semantic.danger}"
        }
      },
      borderRadius: {
        brand: "${state.borderRadius}px"
      },
      spacing: {
        brand: "${state.baseSpacing}px"
      },
      boxShadow: {
        brand: "${resolveShadow(state.shadowIntensity)}"
      },
      fontFamily: {
        brand: ["${state.fontFamily}"]
      }
    }
  }
};

export default config;
`;
}
