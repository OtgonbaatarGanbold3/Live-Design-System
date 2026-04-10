"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  Loader2,
  Sparkles,
  Shuffle,
  RotateCcw,
  RotateCw,
  Contrast,
  AlertCircle,
  Check,
  BookmarkPlus,
  Eye,
  Trash2,
  CircleCheck,
  TriangleAlert,
  Info,
  RefreshCcw,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  type BorderVisibility,
  type ButtonStyle,
  type ColorScheme,
  DEFAULT_STATE,
  generateRandomColors,
  getContrastLevel,
  getContrastRatio,
  getDesignGuidance,
  getSemanticTokens,
  type DesignState,
  type FontWeight,
  type SavedTheme,
  type ShadowIntensity,
  type TemplateName,
  type TypeScale,
  TYPE_SCALE_OPTIONS,
} from "@/lib/design-state";
import type { ValidationResult } from "@/constraints";
import { FEELING_PRESETS, type FeelingPresetName } from "@/presets";
import coverage from "@/coverage/componentCoverage.json";
import { VersionHistory } from "@/ui/VersionHistory";
import type { ThemeVersion } from "@/versioning/themeVersions";
import { cn } from "@/lib/utils";
import { ValidationWarningPanel } from "@/components/aesthetic-os/validation-warning-panel";

interface ControlPanelProps {
  state: DesignState;
  activeTemplate: TemplateName;
  validation: ValidationResult;
  onChange: (updates: Partial<DesignState>, options?: { commit?: boolean }) => void;
  onCommit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  savedThemes: SavedTheme[];
  onSaveTheme: () => void;
  onLoadTheme: (id: string) => void;
  onDeleteTheme: (id: string) => void;
  onCompareTheme: (id: string | null) => void;
  compareThemeId: string | null;
  onResetSection: (section: "colors" | "typography" | "shape" | "spacing" | "effects") => void;
  onResetAll: () => void;
  onApplyFeelingPreset: (preset: FeelingPresetName) => void;
  versions: ThemeVersion[];
  onCreateVersion: () => void;
  onRestoreVersion: (versionId: string) => void;
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  contrastWith?: string;
}

function ColorInput({ label, value, onChange, contrastWith }: ColorInputProps) {
  const contrast = contrastWith ? getContrastRatio(value, contrastWith) : null;
  const level = contrast ? getContrastLevel(contrast) : null;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-neutral-700 bg-transparent"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">{label}</span>
          {contrast !== null && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-neutral-500">{contrast.toFixed(1)}</span>
              {level === "aaa" && <Check className="w-3 h-3 text-green-500" />}
              {level === "aa" && <Contrast className="w-3 h-3 text-yellow-500" />}
              {level === "fail" && <AlertCircle className="w-3 h-3 text-red-500" />}
            </div>
          )}
        </div>
        <Input
          value={value.toUpperCase()}
          onChange={(e) => {
            const nextValue = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(nextValue)) {
              onChange(nextValue);
            }
          }}
          className="h-7 text-xs bg-neutral-900 border-neutral-700 text-white font-mono"
        />
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  action?: ReactNode;
}

function Section({ title, children, defaultOpen = true, action }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-neutral-800">
      <div className="flex items-center gap-2 px-4">
        <CollapsibleTrigger className="flex flex-1 items-center justify-between py-3 text-sm font-medium text-white hover:bg-neutral-800/50 transition-colors">
          <span>{title}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-neutral-400 transition-transform",
              open && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        {action && <div>{action}</div>}
      </div>
      <CollapsibleContent className="px-4 pb-4">
        <div className="flex flex-col gap-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const COLOR_SCHEMES: ColorScheme[] = [
  "Monochromatic",
  "Analogous",
  "Complementary",
  "Split Complementary",
  "Triadic",
];

type PanelMode = "basic" | "advanced";

const COMPONENT_COVERAGE = coverage.components as Record<string, { supported: string[]; unsupported: string[] }>;

export function ControlPanel({
  state,
  activeTemplate,
  validation,
  onChange,
  onCommit,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  savedThemes,
  onSaveTheme,
  onLoadTheme,
  onDeleteTheme,
  onCompareTheme,
  compareThemeId,
  onResetSection,
  onResetAll,
  onApplyFeelingPreset,
  versions,
  onCreateVersion,
  onRestoreVersion,
}: ControlPanelProps) {
  const [panelMode, setPanelMode] = useState<PanelMode>("basic");
  const [vibeInput, setVibeInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("Analogous");

  const guidance = getDesignGuidance(state);
  const semantic = getSemanticTokens(state);

  const criticalIssues = validation.issues.filter((issue) => issue.severity === "error");
  const hasBlockingIssues = criticalIssues.length > 0;
  const isAdvanced = panelMode === "advanced";

  const coverageRows = useMemo(() => Object.entries(COMPONENT_COVERAGE), []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateRandomColors(colorScheme);
      onChange(generated);
      setIsGenerating(false);
    }, 1200);
  };

  const handleRandomize = () => {
    onChange(generateRandomColors(colorScheme));
  };

  const resetButton = (section: "colors" | "typography" | "shape" | "spacing" | "effects") => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => onResetSection(section)}
      className="h-6 px-2 text-[10px] text-neutral-400 hover:bg-neutral-700"
      aria-label={`Reset ${section}`}
    >
      <RefreshCcw className="mr-1 h-3 w-3" />
      Reset
    </Button>
  );

  return (
    <aside className="w-full md:w-[360px] h-full bg-[#0f0f0f] border-r border-neutral-800 overflow-y-auto flex flex-col">
      <div className="p-3 border-b border-neutral-800 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 h-8 bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:opacity-30"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 h-8 bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:opacity-30"
          >
            <RotateCw className="w-3.5 h-3.5 mr-1" />
            Redo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetAll}
            className="h-8 bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-1" />
            All
          </Button>
        </div>

        <div className="flex items-center gap-1 rounded border border-neutral-800 p-1">
          <button
            type="button"
            onClick={() => setPanelMode("basic")}
            className={cn(
              "flex-1 rounded px-2 py-1.5 text-xs transition-colors",
              panelMode === "basic"
                ? "bg-white text-black"
                : "text-neutral-300 hover:bg-neutral-800"
            )}
          >
            Basic
          </button>
          <button
            type="button"
            onClick={() => setPanelMode("advanced")}
            className={cn(
              "flex-1 rounded px-2 py-1.5 text-xs transition-colors",
              panelMode === "advanced"
                ? "bg-white text-black"
                : "text-neutral-300 hover:bg-neutral-800"
            )}
          >
            Advanced
          </button>
        </div>

        <div className="rounded border border-neutral-800 bg-neutral-900/40 px-2 py-1.5 text-[11px] text-neutral-400">
          Active template: <span className="text-neutral-200">{activeTemplate}</span>
        </div>

        {hasBlockingIssues && (
          <div className="rounded border border-rose-900 bg-rose-950/40 px-2 py-1.5 text-[11px] text-rose-100">
            Export and save are blocked until {criticalIssues.length} critical validation issue{criticalIssues.length === 1 ? "" : "s"} are fixed.
          </div>
        )}
      </div>

      <div className="flex-1">
        <Section title="Feeling Presets" defaultOpen>
          <p className="text-xs text-neutral-500">
            One-click emotion presets mapped to recommended template directions.
          </p>
          <div className="grid gap-2">
            {FEELING_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onApplyFeelingPreset(preset.name)}
                className="rounded border border-neutral-700 bg-neutral-900/60 p-2 text-left transition-colors hover:border-neutral-500"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-white">{preset.name}</span>
                  <WandSparkles className="h-3.5 w-3.5 text-neutral-500" />
                </div>
                <p className="text-[11px] text-neutral-400">{preset.description}</p>
                <p className="mt-1 text-[10px] text-neutral-500">
                  Best for: {preset.recommendedTemplates.join(", ")}
                </p>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Basic Controls" defaultOpen>
          <ColorInput
            label="Primary"
            value={state.primary}
            onChange={(value) => onChange({ primary: value, preset: null })}
            contrastWith={state.background}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400">Font Family</label>
            <Input
              value={state.fontFamily}
              onChange={(event) => onChange({ fontFamily: event.target.value, preset: null })}
              className="h-8 text-xs bg-neutral-900 border-neutral-700 text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400">Type Scale</label>
            <Select
              value={state.typeScale}
              onValueChange={(value) => onChange({ typeScale: value as TypeScale, preset: null })}
            >
              <SelectTrigger className="h-8 text-xs bg-neutral-900 border-neutral-700 text-white w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_SCALE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-400">Radius</label>
              <span className="text-xs text-neutral-500">{state.borderRadius}px</span>
            </div>
            <Slider
              value={[state.borderRadius]}
              onValueChange={([value]) => onChange({ borderRadius: value, preset: null }, { commit: false })}
              onValueCommit={onCommit}
              min={0}
              max={32}
              step={1}
              className="[&_[data-slot=slider-track]]:bg-neutral-800 [&_[data-slot=slider-range]]:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-400">Spacing Density</label>
              <span className="text-xs text-neutral-500">{state.baseSpacing}px</span>
            </div>
            <Slider
              value={[state.baseSpacing]}
              onValueChange={([value]) => onChange({ baseSpacing: value, preset: null }, { commit: false })}
              onValueCommit={onCommit}
              min={4}
              max={24}
              step={2}
              className="[&_[data-slot=slider-track]]:bg-neutral-800 [&_[data-slot=slider-range]]:bg-white"
            />
          </div>
        </Section>

        {isAdvanced && (
          <>
            <Section title="Colors" action={resetButton("colors")}>
              <div className="flex items-end gap-2">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label className="text-xs text-neutral-400">Color Scheme</label>
                  <Select
                    value={colorScheme}
                    onValueChange={(value) => setColorScheme(value as ColorScheme)}
                  >
                    <SelectTrigger className="h-8 text-xs bg-neutral-900 border-neutral-700 text-white w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_SCHEMES.map((scheme) => (
                        <SelectItem key={scheme} value={scheme}>
                          {scheme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRandomize}
                  className="h-8 border-neutral-700 bg-transparent px-3 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  <Shuffle className="mr-1.5 h-3.5 w-3.5" />
                  Randomize
                </Button>
              </div>

              <ColorInput
                label="Background"
                value={state.background}
                onChange={(value) => onChange({ background: value, preset: null })}
              />
              <ColorInput
                label="Text"
                value={state.text}
                onChange={(value) => onChange({ text: value, preset: null })}
                contrastWith={state.background}
              />
              <ColorInput
                label="Primary"
                value={state.primary}
                onChange={(value) => onChange({ primary: value, preset: null })}
                contrastWith={state.background}
              />
              <ColorInput
                label="Secondary"
                value={state.secondary}
                onChange={(value) => onChange({ secondary: value, preset: null })}
                contrastWith={state.background}
              />
              <ColorInput
                label="Accent"
                value={state.accent}
                onChange={(value) => onChange({ accent: value, preset: null })}
                contrastWith={state.background}
              />

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(semantic).map(([name, color]) => (
                  <div key={name} className="rounded border border-neutral-700 bg-neutral-900/60 p-2">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full border border-neutral-600" style={{ backgroundColor: color }} />
                      <span className="text-[10px] uppercase tracking-wide text-neutral-400">{name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Typography" action={resetButton("typography")}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Font Family</label>
                <Input
                  value={state.fontFamily}
                  onChange={(event) => onChange({ fontFamily: event.target.value, preset: null })}
                  className="h-8 text-xs bg-neutral-900 border-neutral-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Type Scale</label>
                <Select
                  value={state.typeScale}
                  onValueChange={(value) => onChange({ typeScale: value as TypeScale, preset: null })}
                >
                  <SelectTrigger className="h-8 text-xs bg-neutral-900 border-neutral-700 text-white w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_SCALE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Font Weight</label>
                <ToggleGroup
                  type="single"
                  value={state.fontWeight}
                  onValueChange={(value) => value && onChange({ fontWeight: value as FontWeight, preset: null })}
                  className="w-full grid grid-cols-4"
                >
                  {(["Light", "Regular", "Medium", "Bold"] as FontWeight[]).map((weight) => (
                    <ToggleGroupItem
                      key={weight}
                      value={weight}
                      className="text-[10px] h-7 bg-neutral-900 border-neutral-700 text-neutral-300 data-[state=on]:bg-white data-[state=on]:text-black"
                    >
                      {weight}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-neutral-400">Letter Spacing</label>
                  <span className="text-xs text-neutral-500">{state.letterSpacing}px</span>
                </div>
                <Slider
                  value={[state.letterSpacing]}
                  onValueChange={([value]) => onChange({ letterSpacing: value, preset: null }, { commit: false })}
                  onValueCommit={onCommit}
                  min={-2}
                  max={10}
                  step={0.5}
                  className="[&_[data-slot=slider-track]]:bg-neutral-800 [&_[data-slot=slider-range]]:bg-white"
                />
              </div>
            </Section>

            <Section title="Shape" action={resetButton("shape")}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-neutral-400">Border Radius</label>
                  <span className="text-xs text-neutral-500">{state.borderRadius}px</span>
                </div>
                <Slider
                  value={[state.borderRadius]}
                  onValueChange={([value]) => onChange({ borderRadius: value, preset: null }, { commit: false })}
                  onValueCommit={onCommit}
                  min={0}
                  max={32}
                  step={1}
                  className="[&_[data-slot=slider-track]]:bg-neutral-800 [&_[data-slot=slider-range]]:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Button Style</label>
                <ToggleGroup
                  type="single"
                  value={state.buttonStyle}
                  onValueChange={(value) => value && onChange({ buttonStyle: value as ButtonStyle, preset: null })}
                  className="w-full"
                >
                  {(["Filled", "Outline", "Ghost"] as ButtonStyle[]).map((style) => (
                    <ToggleGroupItem
                      key={style}
                      value={style}
                      className="flex-1 text-xs h-8 bg-neutral-900 border-neutral-700 text-neutral-300 data-[state=on]:bg-white data-[state=on]:text-black"
                    >
                      {style}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </Section>

            <Section title="Spacing" action={resetButton("spacing")}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-neutral-400">Base Spacing Unit</label>
                  <span className="text-xs text-neutral-500">{state.baseSpacing}px</span>
                </div>
                <Slider
                  value={[state.baseSpacing]}
                  onValueChange={([value]) => onChange({ baseSpacing: value, preset: null }, { commit: false })}
                  onValueCommit={onCommit}
                  min={4}
                  max={24}
                  step={2}
                  className="[&_[data-slot=slider-track]]:bg-neutral-800 [&_[data-slot=slider-range]]:bg-white"
                />
              </div>
            </Section>

            <Section title="Effects" action={resetButton("effects")}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Shadow Intensity</label>
                <ToggleGroup
                  type="single"
                  value={state.shadowIntensity}
                  onValueChange={(value) => value && onChange({ shadowIntensity: value as ShadowIntensity, preset: null })}
                  className="w-full grid grid-cols-4"
                >
                  {(["None", "Soft", "Medium", "Strong"] as ShadowIntensity[]).map((shadow) => (
                    <ToggleGroupItem
                      key={shadow}
                      value={shadow}
                      className="text-[10px] h-7 bg-neutral-900 border-neutral-700 text-neutral-300 data-[state=on]:bg-white data-[state=on]:text-black"
                    >
                      {shadow}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Border Visibility</label>
                <ToggleGroup
                  type="single"
                  value={state.borderVisibility}
                  onValueChange={(value) => value && onChange({ borderVisibility: value as BorderVisibility, preset: null })}
                  className="w-full grid grid-cols-4"
                >
                  {(["None", "Subtle", "Medium", "Strong"] as BorderVisibility[]).map((border) => (
                    <ToggleGroupItem
                      key={border}
                      value={border}
                      className="text-[10px] h-7 bg-neutral-900 border-neutral-700 text-neutral-300 data-[state=on]:bg-white data-[state=on]:text-black"
                    >
                      {border}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </Section>
          </>
        )}

        <Section title="Validation" defaultOpen>
          <ValidationWarningPanel validation={validation} />
        </Section>

        <Section title="Guidance" defaultOpen={!isAdvanced}>
          <div className="flex flex-col gap-2">
            {guidance.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded border p-2 text-xs",
                  item.level === "critical" && "border-red-900 bg-red-950/40 text-red-100",
                  item.level === "warning" && "border-yellow-900 bg-yellow-950/40 text-yellow-100",
                  item.level === "good" && "border-emerald-900 bg-emerald-950/40 text-emerald-100"
                )}
              >
                <div className="mb-1 flex items-center gap-1.5 font-medium">
                  {item.level === "critical" && <TriangleAlert className="h-3.5 w-3.5" />}
                  {item.level === "warning" && <Info className="h-3.5 w-3.5" />}
                  {item.level === "good" && <CircleCheck className="h-3.5 w-3.5" />}
                  {item.title}
                </div>
                <p className="opacity-85">{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        {isAdvanced && (
          <Section title="Component Coverage Matrix" defaultOpen={false}>
            <div className="rounded border border-neutral-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400">
                  <tr>
                    <th className="px-2 py-2">Component</th>
                    <th className="px-2 py-2">Supported</th>
                    <th className="px-2 py-2">Unsupported</th>
                  </tr>
                </thead>
                <tbody>
                  {coverageRows.map(([component, row]) => (
                    <tr key={component} className="border-t border-neutral-800 align-top">
                      <td className="px-2 py-2 text-neutral-200">{component}</td>
                      <td className="px-2 py-2 text-neutral-400">{row.supported.join(", ")}</td>
                      <td className="px-2 py-2 text-neutral-500">{row.unsupported.length === 0 ? "-" : row.unsupported.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        <Section title="Versioning" defaultOpen={false}>
          <VersionHistory
            versions={versions}
            currentState={state}
            onSnapshot={onCreateVersion}
            onRestore={onRestoreVersion}
          />
        </Section>

        <Section
          title="Saved Themes"
          action={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSaveTheme}
              className="h-6 w-6 p-0 hover:bg-neutral-700"
              aria-label="Save current theme"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
            </Button>
          }
          defaultOpen={false}
        >
          {savedThemes.length === 0 ? (
            <p className="text-xs text-neutral-500">No saved themes yet. Click the bookmark icon to save this one.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {savedThemes.map((theme) => (
                <div key={theme.id} className="rounded border border-neutral-700 bg-neutral-900/60 p-2">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-white">{theme.name}</p>
                    <span className="text-[10px] text-neutral-500">{new Date(theme.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadTheme(theme.id)}
                      className="h-6 flex-1 border-neutral-700 bg-transparent text-[10px] text-neutral-300 hover:bg-neutral-800"
                    >
                      Load
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onCompareTheme(compareThemeId === theme.id ? null : theme.id)}
                      className={cn(
                        "h-6 border-neutral-700 bg-transparent px-2 text-neutral-300 hover:bg-neutral-800",
                        compareThemeId === theme.id && "border-emerald-700 text-emerald-300"
                      )}
                      aria-label="Toggle compare theme"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteTheme(theme.id)}
                      className="h-6 border-neutral-700 bg-transparent px-2 text-neutral-300 hover:bg-neutral-800"
                      aria-label="Delete saved theme"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {isAdvanced && (
        <div className="p-4 border-t border-neutral-800">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400">Describe a vibe...</label>
            <Input
              value={vibeInput}
              onChange={(event) => setVibeInput(event.target.value)}
              placeholder="e.g., warm sunset minimalism"
              className="h-8 text-xs bg-neutral-900 border-neutral-700 text-white"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !vibeInput.trim()}
                className="w-full h-8 text-xs bg-white text-black hover:bg-neutral-200"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Generate
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange(DEFAULT_STATE)}
                className="h-8 border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800"
              >
                Reset Seed
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
