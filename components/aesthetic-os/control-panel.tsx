"use client";

import { useState } from "react";
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
  type DesignState,
  type TypeScale,
  type FontWeight,
  type ButtonStyle,
  type ShadowIntensity,
  type BorderVisibility,
  type ColorScheme,
  type SavedTheme,
  TYPE_SCALE_OPTIONS,
  generateRandomColors,
  getContrastRatio,
  getContrastLevel,
  getDesignGuidance,
  getSemanticTokens,
} from "@/lib/design-state";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  state: DesignState;
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
            const val = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
              onChange(val);
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
  children: React.ReactNode;
  defaultOpen?: boolean;
  action?: React.ReactNode;
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

export function ControlPanel({
  state,
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
}: ControlPanelProps) {
  const [vibeInput, setVibeInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("Analogous");
  const guidance = getDesignGuidance(state);
  const semantic = getSemanticTokens(state);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation with random colors based on vibe input
    setTimeout(() => {
      const vibeColors = generateRandomColors(colorScheme);
      onChange(vibeColors);
      setIsGenerating(false);
    }, 1500);
  };

  const handleRandomize = () => {
    const colors = generateRandomColors(colorScheme);
    onChange(colors);
  };

  return (
    <aside className="w-full md:w-[320px] h-full bg-[#0f0f0f] border-r border-neutral-800 overflow-y-auto flex flex-col">
      {/* Quick Actions Bar */}
      <div className="p-3 border-b border-neutral-800 flex items-center gap-2">
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
      </div>

      <div className="flex-1">
        <Section title="Colors">
          {/* Color Scheme Selector */}
          <div className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Color Scheme</label>
              <Select
                value={colorScheme}
                onValueChange={(v) => setColorScheme(v as ColorScheme)}
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
            onChange={(v) => onChange({ background: v, preset: null })}
          />
          <ColorInput
            label="Text"
            value={state.text}
            onChange={(v) => onChange({ text: v, preset: null })}
            contrastWith={state.background}
          />
          <ColorInput
            label="Primary"
            value={state.primary}
            onChange={(v) => onChange({ primary: v, preset: null })}
            contrastWith={state.background}
          />
          <ColorInput
            label="Secondary"
            value={state.secondary}
            onChange={(v) => onChange({ secondary: v, preset: null })}
            contrastWith={state.background}
          />
          <ColorInput
            label="Accent"
            value={state.accent}
            onChange={(v) => onChange({ accent: v, preset: null })}
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

        <Section title="Typography">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400">Font Family</label>
            <Input
              value={state.fontFamily}
              onChange={(e) => onChange({ fontFamily: e.target.value, preset: null })}
              placeholder="e.g., Inter, Roboto"
              className="h-8 text-xs bg-neutral-900 border-neutral-700 text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400">Type Scale</label>
            <Select
              value={state.typeScale}
              onValueChange={(v) => onChange({ typeScale: v as TypeScale, preset: null })}
            >
              <SelectTrigger className="h-8 text-xs bg-neutral-900 border-neutral-700 text-white w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_SCALE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
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
              onValueChange={(v) => v && onChange({ fontWeight: v as FontWeight, preset: null })}
              className="w-full grid grid-cols-4"
            >
              {(["Light", "Regular", "Medium", "Bold"] as FontWeight[]).map((w) => (
                <ToggleGroupItem
                  key={w}
                  value={w}
                  className="text-[10px] h-7 bg-neutral-900 border-neutral-700 text-neutral-300 data-[state=on]:bg-white data-[state=on]:text-black"
                >
                  {w}
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
              onValueChange={([v]) => onChange({ letterSpacing: v, preset: null }, { commit: false })}
              onValueCommit={() => onCommit()}
              min={-2}
              max={10}
              step={0.5}
              className="[&_[data-slot=slider-track]]:bg-neutral-800 [&_[data-slot=slider-range]]:bg-white"
            />
          </div>
        </Section>

        <Section title="Shape">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-400">Border Radius</label>
              <span className="text-xs text-neutral-500">{state.borderRadius}px</span>
            </div>
            <Slider
              value={[state.borderRadius]}
              onValueChange={([v]) => onChange({ borderRadius: v, preset: null }, { commit: false })}
              onValueCommit={() => onCommit()}
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
              onValueChange={(v) => v && onChange({ buttonStyle: v as ButtonStyle, preset: null })}
              className="w-full"
            >
              {(["Filled", "Outline", "Ghost"] as ButtonStyle[]).map((s) => (
                <ToggleGroupItem
                  key={s}
                  value={s}
                  className="flex-1 text-xs h-8 bg-neutral-900 border-neutral-700 text-neutral-300 data-[state=on]:bg-white data-[state=on]:text-black"
                >
                  {s}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </Section>

        <Section title="Spacing">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-400">Base Spacing Unit</label>
              <span className="text-xs text-neutral-500">{state.baseSpacing}px</span>
            </div>
            <Slider
              value={[state.baseSpacing]}
              onValueChange={([v]) => onChange({ baseSpacing: v, preset: null }, { commit: false })}
              onValueCommit={() => onCommit()}
              min={4}
              max={24}
              step={2}
              className="[&_[data-slot=slider-track]]:bg-neutral-800 [&_[data-slot=slider-range]]:bg-white"
            />
          </div>
        </Section>

        <Section title="Effects">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400">Shadow Intensity</label>
            <ToggleGroup
              type="single"
              value={state.shadowIntensity}
              onValueChange={(v) =>
                v && onChange({ shadowIntensity: v as ShadowIntensity, preset: null })
              }
              className="w-full grid grid-cols-4"
            >
              {(["None", "Soft", "Medium", "Strong"] as ShadowIntensity[]).map((s) => (
                <ToggleGroupItem
                  key={s}
                  value={s}
                  className="text-[10px] h-7 bg-neutral-900 border-neutral-700 text-neutral-300 data-[state=on]:bg-white data-[state=on]:text-black"
                >
                  {s}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400">Border Visibility</label>
            <ToggleGroup
              type="single"
              value={state.borderVisibility}
              onValueChange={(v) =>
                v && onChange({ borderVisibility: v as BorderVisibility, preset: null })
              }
              className="w-full grid grid-cols-4"
            >
              {(["None", "Subtle", "Medium", "Strong"] as BorderVisibility[]).map((s) => (
                <ToggleGroupItem
                  key={s}
                  value={s}
                  className="text-[10px] h-7 bg-neutral-900 border-neutral-700 text-neutral-300 data-[state=on]:bg-white data-[state=on]:text-black"
                >
                  {s}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </Section>

        <Section title="Guidance" defaultOpen>
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

      <div className="p-4 border-t border-neutral-800">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-400">Describe a vibe...</label>
          <Input
            value={vibeInput}
            onChange={(e) => setVibeInput(e.target.value)}
            placeholder="e.g., warm sunset minimalism"
            className="h-8 text-xs bg-neutral-900 border-neutral-700 text-white"
          />
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
        </div>
      </div>
    </aside>
  );
}
