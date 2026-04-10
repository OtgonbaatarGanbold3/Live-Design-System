import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemePreview } from "@/preview/ThemePreview";
import { StateSwitcher, type PreviewInteractionState } from "@/preview/StateSwitcher";
import type { DesignState } from "@/lib/design-state";

const PREVIEW_STATE: DesignState = {
  background: "#ffffff",
  text: "#0f172a",
  primary: "#1d4ed8",
  secondary: "#475569",
  accent: "#0ea5e9",
  fontFamily: "system-ui",
  typeScale: "1.25",
  fontWeight: "Regular",
  letterSpacing: 0,
  borderRadius: 8,
  buttonStyle: "Filled",
  baseSpacing: 16,
  shadowIntensity: "Soft",
  borderVisibility: "Subtle",
  preset: null,
};

function Template() {
  return <div>Template Content</div>;
}

describe("preview state rendering", () => {
  it("renders each preview interaction state", () => {
    const states: PreviewInteractionState[] = [
      "default",
      "hover",
      "focus",
      "active",
      "disabled",
      "error",
    ];

    for (const stateName of states) {
      const html = renderToStaticMarkup(
        <ThemePreview
          state={PREVIEW_STATE}
          viewport="desktop"
          interactionState={stateName}
          ActiveTemplate={Template}
        />
      );

      expect(html).toContain("State Sandbox");
      expect(html).toContain("Primary action");
    }
  });

  it("lists all interaction states in the switcher", () => {
    const html = renderToStaticMarkup(
      <StateSwitcher value="default" onChange={() => undefined} />
    );

    expect(html).toContain("default");
    expect(html).toContain("hover");
    expect(html).toContain("focus");
    expect(html).toContain("active");
    expect(html).toContain("disabled");
    expect(html).toContain("error");
  });
});
