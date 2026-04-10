import { NextResponse } from "next/server";
import { DEFAULT_STATE, sanitizePartialState, type DesignState } from "@/lib/design-state";
import {
  exportCSSVariables,
  exportDesignTokensJSON,
  exportFigmaTokens,
  exportTailwindConfig,
  generateExportReport,
} from "@/exporters";
import { validateTheme } from "@/constraints";

type ExportFormat = "json" | "css" | "tailwind" | "figma" | "report";

interface ExportRequest {
  format?: ExportFormat;
  state?: Partial<DesignState>;
}

function resolveExport(format: ExportFormat, state: DesignState): string {
  if (format === "json") return exportDesignTokensJSON(state);
  if (format === "css") return exportCSSVariables(state);
  if (format === "tailwind") return exportTailwindConfig(state);
  if (format === "figma") return exportFigmaTokens(state);
  return JSON.stringify(generateExportReport(state), null, 2);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ExportRequest;
    const format = payload.format ?? "report";

    if (!["json", "css", "tailwind", "figma", "report"].includes(format)) {
      return NextResponse.json(
        {
          error: "Unsupported export format.",
        },
        { status: 400 }
      );
    }

    const state = {
      ...DEFAULT_STATE,
      ...sanitizePartialState(payload.state ?? {}),
    };

    const validation = validateTheme(state);
    if (!validation.canExport && format !== "report") {
      return NextResponse.json(
        {
          error: "Theme has blocking validation issues.",
          validation,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      format,
      output: resolveExport(format as ExportFormat, state),
      validation,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to process export payload.",
      },
      { status: 400 }
    );
  }
}
