"use client";

import type { DesignState } from "@/lib/design-state";
import type { PreviewInteractionState } from "@/preview/StateSwitcher";
import { cn } from "@/lib/utils";

interface ThemePreviewProps {
  state: DesignState;
  viewport: "desktop" | "tablet" | "mobile";
  interactionState: PreviewInteractionState;
  ActiveTemplate: React.ComponentType<{ state: DesignState }>;
}

const VIEWPORT_CLASS = {
  desktop: "w-full max-w-[1400px]",
  tablet: "w-full max-w-[860px]",
  mobile: "w-full max-w-[430px]",
} as const;

function interactionStyles(state: DesignState, mode: PreviewInteractionState): React.CSSProperties {
  if (mode === "default") {
    return {
      opacity: 1,
      transform: "scale(1)",
      borderColor: `${state.secondary}66`,
      boxShadow: "none",
    };
  }

  if (mode === "hover") {
    return {
      opacity: 1,
      transform: "translateY(-1px)",
      borderColor: state.primary,
      boxShadow: `0 8px 18px ${state.primary}33`,
    };
  }

  if (mode === "focus") {
    return {
      opacity: 1,
      transform: "scale(1)",
      borderColor: state.accent,
      boxShadow: `0 0 0 3px ${state.accent}55`,
    };
  }

  if (mode === "active") {
    return {
      opacity: 1,
      transform: "scale(0.98)",
      borderColor: state.primary,
      boxShadow: `inset 0 1px 0 ${state.text}22`,
    };
  }

  if (mode === "disabled") {
    return {
      opacity: 0.45,
      transform: "scale(1)",
      borderColor: `${state.secondary}44`,
      boxShadow: "none",
    };
  }

  return {
    opacity: 1,
    transform: "scale(1)",
    borderColor: "#dc2626",
    boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.25)",
  };
}

export function ThemePreview({ state, viewport, interactionState, ActiveTemplate }: ThemePreviewProps) {
  return (
    <div className={cn("mx-auto transition-all duration-300", VIEWPORT_CLASS[viewport])}>
      <div className="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
        <ActiveTemplate state={state} />

        <div className="border-t border-neutral-200 bg-neutral-50 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">State Sandbox</p>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              style={{
                background: state.primary,
                color: state.background,
                borderRadius: state.borderRadius,
                border: `1px solid ${state.secondary}66`,
                padding: `${state.baseSpacing / 2}px ${state.baseSpacing}px`,
                transition: "all 120ms ease",
                ...interactionStyles(state, interactionState),
              }}
              disabled={interactionState === "disabled"}
            >
              Primary action
            </button>

            <input
              aria-label="Preview input"
              defaultValue={interactionState === "error" ? "Invalid email" : "name@example.com"}
              readOnly
              style={{
                width: "100%",
                borderRadius: state.borderRadius,
                border: `1px solid ${state.secondary}66`,
                background: state.background,
                color: state.text,
                padding: `${state.baseSpacing / 2}px ${state.baseSpacing}px`,
                fontFamily: state.fontFamily,
                transition: "all 120ms ease",
                ...interactionStyles(state, interactionState),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
