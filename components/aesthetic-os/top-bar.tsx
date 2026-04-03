"use client";

import { useRef, useState } from "react";
import {
  Check,
  Share2,
  Download,
  Palette,
  Upload,
  Braces,
  BookmarkPlus,
  PanelLeftOpen,
  Code2,
} from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import {
  type PresetName,
  PRESETS,
  type DesignState,
  parseImportedState,
  stateToCSS,
  stateToTailwindTheme,
  stateToTokenJSON,
} from "@/lib/design-state";
import { cn } from "@/lib/utils";

const PRESET_NAMES: PresetName[] = [
  "Minimal",
  "Swiss",
  "Brutalist",
  "Y2K",
  "Vaporwave",
  "Glassmorphism",
  "Dark Academia",
  "Memphis",
  "Nature",
  "Earth",
  "Terracotta",
];

interface TopBarProps {
  currentPreset: PresetName | null;
  onPresetChange: (preset: PresetName) => void;
  designState: DesignState;
  onImportState: (updates: Partial<DesignState>) => void;
  onCreateShareLink: () => string;
  onSaveTheme: () => void;
  onOpenControls: () => void;
}

export function TopBar({
  currentPreset,
  onPresetChange,
  designState,
  onImportState,
  onCreateShareLink,
  onSaveTheme,
  onOpenControls,
}: TopBarProps) {
  const [status, setStatus] = useState<
    "css" | "tokens" | "tailwind" | "share" | "import" | "save" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showStatus = (nextStatus: NonNullable<typeof status>) => {
    setStatus(nextStatus);
    setTimeout(() => setStatus(null), 2000);
  };

  const copyToClipboard = async (
    value: string,
    nextStatus: Exclude<NonNullable<typeof status>, "import" | "save">,
    eventName: string
  ) => {
    await navigator.clipboard.writeText(value);
    showStatus(nextStatus);
    track(eventName);
  };

  const handlePresetClick = (preset: PresetName) => {
    onPresetChange(preset);
    track("preset_selected", { preset });
  };

  const handleExportCSS = async () => {
    const css = stateToCSS(designState);
    await copyToClipboard(css, "css", "export_css");
  };

  const handleExportTokens = async () => {
    await copyToClipboard(stateToTokenJSON(designState), "tokens", "export_tokens_json");
  };

  const handleExportTailwind = async () => {
    await copyToClipboard(stateToTailwindTheme(designState), "tailwind", "export_tailwind_theme");
  };

  const handleShare = async () => {
    const url = onCreateShareLink();
    await copyToClipboard(url, "share", "share_snapshot_created");
  };

  const handleSaveTheme = () => {
    onSaveTheme();
    showStatus("save");
    track("theme_saved");
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    const imported = parseImportedState(content);
    if (imported) {
      onImportState(imported);
      showStatus("import");
      track("theme_imported");
    }
    event.target.value = "";
  };

  return (
    <header className="sticky top-0 z-50 flex min-h-[60px] items-center gap-2 border-b border-neutral-800 bg-[#0f0f0f] px-3 py-2 md:px-4 motion-slide-in">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportFile}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onOpenControls}
        className="h-8 border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white md:hidden"
        aria-label="Open controls"
      >
        <PanelLeftOpen className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Palette className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-white text-sm">AestheticOS</span>
      </div>

      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 px-4">
          {PRESET_NAMES.map((preset) => {
            const presetColors = PRESETS[preset];
            return (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                  currentPreset === preset
                    ? "bg-white text-black"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                )}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: presetColors.primary }}
                />
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <Upload className="w-4 h-4 md:mr-1.5" />
          <span className="hidden md:inline">Import</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSaveTheme}
          className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <BookmarkPlus className="w-4 h-4 md:mr-1.5" />
          <span className="hidden md:inline">Save</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <Share2 className="w-4 h-4 md:mr-1.5" />
          <span className="hidden md:inline">Share</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportCSS}
          className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <Download className="w-4 h-4 md:mr-1.5" />
          <span className="hidden md:inline">CSS</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportTokens}
          className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <Braces className="h-4 w-4 md:mr-1.5" />
          <span className="hidden md:inline">Tokens</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportTailwind}
          className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <Code2 className="h-4 w-4 md:mr-1.5" />
          <span className="hidden md:inline">Tailwind</span>
        </Button>
        {status && (
          <span className="hidden items-center gap-1 text-xs text-emerald-300 xl:flex">
            <Check className="h-3.5 w-3.5" />
            {status === "css" && "CSS copied"}
            {status === "tokens" && "Token JSON copied"}
            {status === "tailwind" && "Tailwind theme copied"}
            {status === "share" && "Share link copied"}
            {status === "import" && "Theme imported"}
            {status === "save" && "Theme saved"}
          </span>
        )}
      </div>
    </header>
  );
}
