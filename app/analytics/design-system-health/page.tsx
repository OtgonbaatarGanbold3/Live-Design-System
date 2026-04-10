"use client";

import { useMemo } from "react";
import { getDesignHealthMetrics } from "@/analytics/design-system-health";

function MetricCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-neutral-400">{hint}</p>
    </div>
  );
}

export default function DesignSystemHealthPage() {
  const metrics = useMemo(() => getDesignHealthMetrics(), []);

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-4 py-8 text-white md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Design System Health</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Quality and productivity metrics for the design-system workspace.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Time To First Valid Theme"
            value={
              metrics.timeToFirstValidThemeSeconds === null
                ? "-"
                : `${metrics.timeToFirstValidThemeSeconds}s`
            }
            hint="Target under 180 seconds"
          />
          <MetricCard
            title="Export Success Rate"
            value={`${metrics.exportSuccessRate}%`}
            hint="Successful exports / attempts"
          />
          <MetricCard
            title="Accessibility Pass Rate"
            value={`${metrics.accessibilityPassRate}%`}
            hint="Themes passing validation"
          />
          <MetricCard
            title="Template Reuse Rate"
            value={`${metrics.templateReuseRate}%`}
            hint="Repeated template selection"
          />
          <MetricCard
            title="Manual Overrides"
            value={`${metrics.manualOverrides}`}
            hint="Total manual control edits"
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-neutral-800">
          <div className="border-b border-neutral-800 bg-neutral-900/60 px-4 py-3">
            <h2 className="text-sm font-medium">By Template</h2>
          </div>

          {Object.keys(metrics.byTemplate).length === 0 ? (
            <div className="p-4 text-sm text-neutral-400">No template telemetry yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-neutral-950/80 text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Template</th>
                    <th className="px-4 py-3">Selections</th>
                    <th className="px-4 py-3">Exports</th>
                    <th className="px-4 py-3">Accessibility Pass Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metrics.byTemplate)
                    .sort((a, b) => b[1].selections - a[1].selections)
                    .map(([template, row]) => (
                      <tr key={template} className="border-t border-neutral-800">
                        <td className="px-4 py-3 text-neutral-100">{template}</td>
                        <td className="px-4 py-3 text-neutral-300">{row.selections}</td>
                        <td className="px-4 py-3 text-neutral-300">{row.exports}</td>
                        <td className="px-4 py-3 text-neutral-300">{row.accessibilityPassRate}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
