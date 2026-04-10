export type DesignHealthEventType =
  | "session_started"
  | "theme_validated"
  | "export_attempted"
  | "export_succeeded"
  | "template_selected"
  | "manual_override";

export interface DesignHealthEvent {
  type: DesignHealthEventType;
  timestamp: string;
  payload?: Record<string, string | number | boolean | null | undefined>;
}

export interface DesignHealthMetrics {
  timeToFirstValidThemeSeconds: number | null;
  exportSuccessRate: number;
  accessibilityPassRate: number;
  templateReuseRate: number;
  manualOverrides: number;
  byTemplate: Record<string, {
    selections: number;
    exports: number;
    accessibilityPassRate: number;
  }>;
}

const STORAGE_KEY = "aestheticos:design-health-events:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readHealthEvents(): DesignHealthEvent[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DesignHealthEvent[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((event) => typeof event.type === "string" && typeof event.timestamp === "string");
  } catch {
    return [];
  }
}

export function writeHealthEvents(events: DesignHealthEvent[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-2000)));
}

export function recordHealthEvent(
  type: DesignHealthEventType,
  payload?: Record<string, string | number | boolean | null | undefined>
): void {
  const events = readHealthEvents();
  events.push({
    type,
    timestamp: new Date().toISOString(),
    payload,
  });
  writeHealthEvents(events);
}

function toRate(part: number, total: number): number {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(1));
}

function getLatestSessionStart(events: DesignHealthEvent[]): Date | null {
  const sessionStart = [...events].reverse().find((event) => event.type === "session_started");
  if (!sessionStart) return null;
  const date = new Date(sessionStart.timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function calculateDesignHealthMetrics(events: DesignHealthEvent[]): DesignHealthMetrics {
  const exportAttempts = events.filter((event) => event.type === "export_attempted").length;
  const exportSuccesses = events.filter((event) => event.type === "export_succeeded").length;

  const validations = events.filter((event) => event.type === "theme_validated");
  const passedValidations = validations.filter((event) => event.payload?.isValid === true).length;

  const templateSelections = events
    .filter((event) => event.type === "template_selected")
    .map((event) => String(event.payload?.template ?? "unknown"));

  const distinctTemplates = new Set(templateSelections);
  const templateReuseRate = toRate(
    Math.max(0, templateSelections.length - distinctTemplates.size),
    templateSelections.length
  );

  const manualOverrides = events.filter((event) => event.type === "manual_override").length;

  const sessionStart = getLatestSessionStart(events);
  const firstValid = validations.find((event) => event.payload?.isValid === true);

  const timeToFirstValidThemeSeconds =
    sessionStart && firstValid
      ? Math.max(0, Math.round((new Date(firstValid.timestamp).getTime() - sessionStart.getTime()) / 1000))
      : null;

  const byTemplate: DesignHealthMetrics["byTemplate"] = {};

  for (const template of templateSelections) {
    if (!byTemplate[template]) {
      byTemplate[template] = {
        selections: 0,
        exports: 0,
        accessibilityPassRate: 0,
      };
    }

    byTemplate[template].selections += 1;
  }

  for (const event of events) {
    if (event.type === "export_succeeded") {
      const template = String(event.payload?.template ?? "unknown");
      if (!byTemplate[template]) {
        byTemplate[template] = {
          selections: 0,
          exports: 0,
          accessibilityPassRate: 0,
        };
      }
      byTemplate[template].exports += 1;
    }
  }

  for (const [template, row] of Object.entries(byTemplate)) {
    const templateValidations = validations.filter(
      (event) => String(event.payload?.template ?? "unknown") === template
    );
    const templatePasses = templateValidations.filter((event) => event.payload?.isValid === true).length;
    row.accessibilityPassRate = toRate(templatePasses, templateValidations.length);
  }

  return {
    timeToFirstValidThemeSeconds,
    exportSuccessRate: toRate(exportSuccesses, exportAttempts),
    accessibilityPassRate: toRate(passedValidations, validations.length),
    templateReuseRate,
    manualOverrides,
    byTemplate,
  };
}

export function getDesignHealthMetrics(): DesignHealthMetrics {
  return calculateDesignHealthMetrics(readHealthEvents());
}

export function getWeeklySummary(now = new Date()): {
  periodStart: string;
  periodEnd: string;
  metrics: DesignHealthMetrics;
} {
  const all = readHealthEvents();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const weekly = all.filter((event) => {
    const timestamp = new Date(event.timestamp).getTime();
    return timestamp >= weekAgo.getTime() && timestamp <= now.getTime();
  });

  return {
    periodStart: weekAgo.toISOString(),
    periodEnd: now.toISOString(),
    metrics: calculateDesignHealthMetrics(weekly),
  };
}
