"use client";

import { cn } from "@/lib/utils";

export type PreviewInteractionState = "default" | "hover" | "focus" | "active" | "disabled" | "error";

const STATES: PreviewInteractionState[] = [
  "default",
  "hover",
  "focus",
  "active",
  "disabled",
  "error",
];

interface StateSwitcherProps {
  value: PreviewInteractionState;
  onChange: (next: PreviewInteractionState) => void;
}

export function StateSwitcher({ value, onChange }: StateSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STATES.map((stateName) => (
        <button
          key={stateName}
          type="button"
          onClick={() => onChange(stateName)}
          className={cn(
            "rounded px-2 py-1 text-[11px] font-medium capitalize transition-colors",
            value === stateName
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          )}
        >
          {stateName}
        </button>
      ))}
    </div>
  );
}
