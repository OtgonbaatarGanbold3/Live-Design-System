import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const eventsPath = path.join(root, "analytics", "design-health-events.json");
const outputPath = path.join(root, "analytics", "weekly-summary.json");

function safeReadEvents() {
  if (!fs.existsSync(eventsPath)) {
    return [];
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(eventsPath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rate(part, total) {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(1));
}

function summarize(events) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const weeklyEvents = events.filter((event) => {
    const time = new Date(event.timestamp).getTime();
    return Number.isFinite(time) && time >= weekAgo.getTime() && time <= now.getTime();
  });

  const exportAttempts = weeklyEvents.filter((event) => event.type === "export_attempted").length;
  const exportSuccesses = weeklyEvents.filter((event) => event.type === "export_succeeded").length;
  const validations = weeklyEvents.filter((event) => event.type === "theme_validated");
  const validThemes = validations.filter((event) => event.payload?.isValid === true).length;

  return {
    periodStart: weekAgo.toISOString(),
    periodEnd: now.toISOString(),
    totalEvents: weeklyEvents.length,
    exportSuccessRate: rate(exportSuccesses, exportAttempts),
    accessibilityPassRate: rate(validThemes, validations.length),
    manualOverrides: weeklyEvents.filter((event) => event.type === "manual_override").length,
  };
}

function run() {
  const events = safeReadEvents();
  const summary = summarize(events);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

  console.log(`Weekly summary written to ${outputPath}`);
}

run();
