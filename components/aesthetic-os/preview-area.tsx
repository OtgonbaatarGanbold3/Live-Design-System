"use client";

import { useState } from "react";
import { Columns2, Monitor, Smartphone, Tablet } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { DesignState, TemplateName } from "@/lib/design-state";
import { SaasLanding } from "./templates/saas-landing";
import { Portfolio } from "./templates/portfolio";
import { Agency } from "./templates/agency";
import { Ecommerce } from "./templates/ecommerce";
import { cn } from "@/lib/utils";

interface PreviewAreaProps {
  state: DesignState;
  compareState: DesignState | null;
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

function PreviewPane({
  label,
  state,
  viewport,
  ActiveComponent,
}: {
  label: string;
  state: DesignState;
  viewport: ViewportMode;
  ActiveComponent: React.ComponentType<{ state: DesignState }>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</div>
      <div className={cn("mx-auto transition-all duration-300", VIEWPORT_CLASSES[viewport])}>
        <div className="min-h-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
          <ActiveComponent state={state} />
        </div>
      </div>
    </div>
  );
}

export function PreviewArea({ state, compareState }: PreviewAreaProps) {
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("SaaS Landing");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [compareMode, setCompareMode] = useState(false);

  const ActiveComponent = TEMPLATES.find((t) => t.name === activeTemplate)?.component || SaasLanding;
  const canCompare = Boolean(compareState);
  const showCompare = compareMode && canCompare;

  return (
    <div className="flex-1 flex flex-col bg-neutral-100 overflow-hidden">
      <div className="shrink-0 border-b border-neutral-200 bg-white px-3 py-3 md:px-4">
        <Tabs value={activeTemplate} onValueChange={(v) => setActiveTemplate(v as TemplateName)}>
          <TabsList className="bg-neutral-100">
            {TEMPLATES.map((template) => (
              <TabsTrigger key={template.name} value={template.name} className="text-xs">
                {template.name}
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
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3 md:p-4">
        <div className={cn("mx-auto grid gap-4", showCompare ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1")}>
          <PreviewPane label="Current" state={state} viewport={viewport} ActiveComponent={ActiveComponent} />
          {showCompare && compareState && (
            <PreviewPane
              label="Compare"
              state={compareState}
              viewport={viewport}
              ActiveComponent={ActiveComponent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
