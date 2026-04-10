"use client";

import { useMemo, useState } from "react";
import { Columns2, Monitor, Smartphone, Tablet, Split } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { DesignState, TemplateName } from "@/lib/design-state";
import { SaasLanding } from "./templates/saas-landing";
import { Portfolio } from "./templates/portfolio";
import { Agency } from "./templates/agency";
import { Ecommerce } from "./templates/ecommerce";
import { cn } from "@/lib/utils";
import { scoreTemplate, getMinimumPublishScore } from "@/quality/scoreEngine";
import { ThemePreview } from "@/preview/ThemePreview";
import { StateSwitcher, type PreviewInteractionState } from "@/preview/StateSwitcher";

interface PreviewAreaProps {
  state: DesignState;
  compareState: DesignState | null;
  activeTemplate: TemplateName;
  onTemplateChange: (template: TemplateName) => void;
  onApplyTemplateDefaults: (template: TemplateName) => void;
}

type ViewportMode = "desktop" | "tablet" | "mobile";

const TEMPLATES: { name: TemplateName; component: React.ComponentType<{ state: DesignState }> }[] = [
  { name: "SaaS Landing", component: SaasLanding },
  { name: "Portfolio", component: Portfolio },
  { name: "Agency", component: Agency },
  { name: "E-commerce", component: Ecommerce },
];

const VIEWPORT_CLASSES: Record<ViewportMode, string> = {
  desktop: "w-full max-w-[1400px]",
  tablet: "w-full max-w-[860px]",
  mobile: "w-full max-w-[430px]",
};

function scoreTone(overall: number, threshold: number): string {
  if (overall < threshold) {
    return "text-rose-600";
  }

  if (overall >= 88) {
    return "text-emerald-600";
  }

  return "text-amber-600";
}

function PreviewPane({
  label,
  previewState,
  state,
  viewport,
  dualViewport,
  ActiveComponent,
}: {
  label: string;
  previewState: PreviewInteractionState;
  state: DesignState;
  viewport: ViewportMode;
  dualViewport: boolean;
  ActiveComponent: React.ComponentType<{ state: DesignState }>;
}) {
  if (dualViewport) {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</div>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <ThemePreview
            state={state}
            viewport="desktop"
            interactionState={previewState}
            ActiveTemplate={ActiveComponent}
          />
          <ThemePreview
            state={state}
            viewport="mobile"
            interactionState={previewState}
            ActiveTemplate={ActiveComponent}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</div>
      <div className={cn("mx-auto transition-all duration-300", VIEWPORT_CLASSES[viewport])}>
        <ThemePreview
          state={state}
          viewport={viewport}
          interactionState={previewState}
          ActiveTemplate={ActiveComponent}
        />
      </div>
    </div>
  );
}

export function PreviewArea({
  state,
  compareState,
  activeTemplate,
  onTemplateChange,
  onApplyTemplateDefaults,
}: PreviewAreaProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [previewState, setPreviewState] = useState<PreviewInteractionState>("default");
  const [dualViewport, setDualViewport] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const ActiveComponent = TEMPLATES.find((t) => t.name === activeTemplate)?.component || SaasLanding;
  const templateScores = useMemo(() => {
    const entries = TEMPLATES.map((template) => [template.name, scoreTemplate(template.name, state)] as const);
    return Object.fromEntries(entries) as Record<TemplateName, ReturnType<typeof scoreTemplate>>;
  }, [state]);
  const activeScore = templateScores[activeTemplate];
  const minimumScore = getMinimumPublishScore();
  const canCompare = Boolean(compareState);
  const showCompare = compareMode && canCompare;

  return (
    <div className="flex-1 flex flex-col bg-neutral-100 overflow-hidden">
      <div className="shrink-0 border-b border-neutral-200 bg-white px-3 py-3 md:px-4">
        <Tabs value={activeTemplate} onValueChange={(v) => onTemplateChange(v as TemplateName)}>
          <TabsList className="bg-neutral-100">
            {TEMPLATES.map((template) => (
              <TabsTrigger key={template.name} value={template.name} className="text-xs">
                <span>{template.name}</span>
                <span className={cn("ml-1 text-[10px]", scoreTone(templateScores[template.name].overall, minimumScore))}>
                  {templateScores[template.name].overall}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={viewport === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewport("desktop")}
            className="h-8"
          >
            <Monitor className="mr-1.5 h-3.5 w-3.5" />
            Desktop
          </Button>
          <Button
            type="button"
            variant={viewport === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewport("tablet")}
            className="h-8"
          >
            <Tablet className="mr-1.5 h-3.5 w-3.5" />
            Tablet
          </Button>
          <Button
            type="button"
            variant={viewport === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewport("mobile")}
            className="h-8"
          >
            <Smartphone className="mr-1.5 h-3.5 w-3.5" />
            Mobile
          </Button>
          <Button
            type="button"
            variant={showCompare ? "default" : "outline"}
            size="sm"
            onClick={() => setCompareMode((prev) => !prev)}
            disabled={!canCompare}
            className="h-8"
          >
            <Columns2 className="mr-1.5 h-3.5 w-3.5" />
            Compare
          </Button>
          <Button
            type="button"
            variant={dualViewport ? "default" : "outline"}
            size="sm"
            onClick={() => setDualViewport((previous) => !previous)}
            className="h-8"
          >
            <Split className="mr-1.5 h-3.5 w-3.5" />
            Desktop + Mobile
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onApplyTemplateDefaults(activeTemplate)}
            className="h-8"
          >
            Apply Recommended Defaults
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <StateSwitcher value={previewState} onChange={setPreviewState} />
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-600">
              A11y {activeScore.accessibility}
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-600">
              Responsive {activeScore.responsiveness}
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-600">
              Consistency {activeScore.consistency}
            </span>
            <span className={cn("rounded-full px-2 py-1 font-medium", scoreTone(activeScore.overall, minimumScore))}>
              Overall {activeScore.overall}
            </span>
            {activeScore.recommended && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
                Recommended
              </span>
            )}
            {activeScore.needsImprovement && (
              <span className="rounded-full bg-rose-100 px-2 py-1 font-medium text-rose-700">
                Needs Improvement
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3 md:p-4">
        <div className={cn("mx-auto grid gap-4", showCompare ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1")}>
          <PreviewPane
            label="Current"
            previewState={previewState}
            state={state}
            viewport={viewport}
            dualViewport={dualViewport}
            ActiveComponent={ActiveComponent}
          />
          {showCompare && compareState && (
            <PreviewPane
              label="Compare"
              previewState={previewState}
              state={compareState}
              viewport={viewport}
              dualViewport={dualViewport}
              ActiveComponent={ActiveComponent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
