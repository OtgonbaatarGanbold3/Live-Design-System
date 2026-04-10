"use client";

import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { ValidationResult } from "@/constraints";
import { cn } from "@/lib/utils";

interface ValidationWarningPanelProps {
  validation: ValidationResult;
}

export function ValidationWarningPanel({ validation }: ValidationWarningPanelProps) {
  if (validation.issues.length === 0) {
    return (
      <div className="rounded border border-emerald-900 bg-emerald-950/40 p-2 text-xs text-emerald-100">
        All checks pass. This theme is export-ready.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {validation.issues.map((issue) => (
        <div
          key={issue.id}
          className={cn(
            "rounded border p-2 text-xs",
            issue.severity === "error" && "border-red-900 bg-red-950/40 text-red-100",
            issue.severity === "warning" && "border-yellow-900 bg-yellow-950/40 text-yellow-100",
            issue.severity === "info" && "border-blue-900 bg-blue-950/40 text-blue-100"
          )}
        >
          <div className="mb-1 flex items-center gap-1.5 font-medium">
            {issue.severity === "error" && <TriangleAlert className="h-3.5 w-3.5" />}
            {issue.severity === "warning" && <Info className="h-3.5 w-3.5" />}
            {issue.severity === "info" && <CircleCheck className="h-3.5 w-3.5" />}
            {issue.message}
          </div>
          <p className="opacity-85">{issue.suggestion}</p>
        </div>
      ))}
    </div>
  );
}
