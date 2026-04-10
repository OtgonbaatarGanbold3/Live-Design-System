"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { TopBar } from "./top-bar";
import { ControlPanel } from "./control-panel";
import { PreviewArea } from "./preview-area";
import {
  type DesignState,
  type PresetName,
  type SavedTheme,
  type SharedSnapshot,
  type TemplateName,
  PRESETS,
  DEFAULT_STATE,
  sanitizePartialState,
  stateToQueryString,
  queryStringToState,
} from "@/lib/design-state";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { validateTheme } from "@/constraints";
import { FEELING_PRESETS, applyFeelingPreset, type FeelingPresetName } from "@/presets";
import { getTemplateRecommendedDefaults } from "@/lib/template-defaults";
import { recordHealthEvent } from "@/analytics/design-system-health";
import {
  createThemeVersion,
  pushThemeVersion,
  restoreThemeVersion,
  type ThemeVersion,
} from "@/versioning/themeVersions";
import { getFeatureFlags } from "@/lib/feature-flags";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_HISTORY = 50;
const MAX_SNAPSHOTS = 30;
const MAX_SAVED_THEMES = 30;
const MAX_THEME_VERSIONS = 60;
const SAVED_THEMES_KEY = "aestheticos:saved-themes:v1";
const SNAPSHOTS_KEY = "aestheticos:snapshots:v1";
const VERSIONS_KEY = "aestheticos:theme-versions:v1";
const ONBOARDING_KEY = "aestheticos:onboarding:complete:v1";

interface DesignerStore {
  state: DesignState;
  history: DesignState[];
  historyIndex: number;
  isHydrated: boolean;
  hasUncommittedChanges: boolean;
}

type DesignerAction =
  | { type: "hydrate"; state: DesignState }
  | { type: "setHydrated" }
  | { type: "applyPreset"; preset: PresetName }
  | { type: "applyState"; state: DesignState }
  | { type: "applyUpdates"; updates: Partial<DesignState>; commit: boolean }
  | { type: "commit" }
  | { type: "undo" }
  | { type: "redo" };

function statesEqual(a: DesignState, b: DesignState): boolean {
  return stateToQueryString(a) === stateToQueryString(b);
}

function pushToHistory(history: DesignState[], historyIndex: number, nextState: DesignState) {
  const head = history.slice(0, historyIndex + 1);
  if (head.length > 0 && statesEqual(head[head.length - 1], nextState)) {
    return { history: head, historyIndex: head.length - 1 };
  }

  const withNext = [...head, nextState];
  if (withNext.length > MAX_HISTORY) {
    withNext.shift();
  }

  return {
    history: withNext,
    historyIndex: withNext.length - 1,
  };
}

function designerReducer(store: DesignerStore, action: DesignerAction): DesignerStore {
  switch (action.type) {
    case "hydrate": {
      return {
        state: action.state,
        history: [action.state],
        historyIndex: 0,
        isHydrated: true,
        hasUncommittedChanges: false,
      };
    }

    case "setHydrated": {
      return {
        ...store,
        isHydrated: true,
      };
    }

    case "applyPreset": {
      const nextState: DesignState = { ...PRESETS[action.preset], preset: action.preset };
      const nextHistory = pushToHistory(store.history, store.historyIndex, nextState);
      return {
        ...store,
        state: nextState,
        history: nextHistory.history,
        historyIndex: nextHistory.historyIndex,
        hasUncommittedChanges: false,
      };
    }

    case "applyState": {
      const nextHistory = pushToHistory(store.history, store.historyIndex, action.state);
      return {
        ...store,
        state: action.state,
        history: nextHistory.history,
        historyIndex: nextHistory.historyIndex,
        hasUncommittedChanges: false,
      };
    }

    case "applyUpdates": {
      const nextState = { ...store.state, ...action.updates };
      if (statesEqual(store.state, nextState)) {
        return store;
      }

      if (!action.commit) {
        return {
          ...store,
          state: nextState,
          hasUncommittedChanges: true,
        };
      }

      const nextHistory = pushToHistory(store.history, store.historyIndex, nextState);
      return {
        ...store,
        state: nextState,
        history: nextHistory.history,
        historyIndex: nextHistory.historyIndex,
        hasUncommittedChanges: false,
      };
    }

    case "commit": {
      if (!store.hasUncommittedChanges) {
        return store;
      }
      const nextHistory = pushToHistory(store.history, store.historyIndex, store.state);
      return {
        ...store,
        history: nextHistory.history,
        historyIndex: nextHistory.historyIndex,
        hasUncommittedChanges: false,
      };
    }

    case "undo": {
      if (store.historyIndex <= 0) {
        return store;
      }

      const nextIndex = store.historyIndex - 1;
      return {
        ...store,
        state: store.history[nextIndex],
        historyIndex: nextIndex,
        hasUncommittedChanges: false,
      };
    }

    case "redo": {
      if (store.historyIndex >= store.history.length - 1) {
        return store;
      }

      const nextIndex = store.historyIndex + 1;
      return {
        ...store,
        state: store.history[nextIndex],
        historyIndex: nextIndex,
        hasUncommittedChanges: false,
      };
    }
  }
}

const INITIAL_STORE: DesignerStore = {
  state: DEFAULT_STATE,
  history: [DEFAULT_STATE],
  historyIndex: 0,
  isHydrated: false,
  hasUncommittedChanges: false,
};

function loadSavedThemes(): SavedTheme[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_THEMES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as SavedTheme[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((theme) => {
        const safeState = sanitizePartialState(theme.state);
        return {
          ...theme,
          state: {
            ...DEFAULT_STATE,
            ...safeState,
          },
        };
      })
      .filter((theme) => typeof theme.id === "string" && typeof theme.name === "string");
  } catch {
    return [];
  }
}

function loadSnapshots(): Record<string, SharedSnapshot> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SNAPSHOTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, SharedSnapshot>;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

function loadThemeVersions(): ThemeVersion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(VERSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ThemeVersion[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function AestheticOS() {
  const featureFlags = getFeatureFlags();
  const [store, dispatch] = useReducer(designerReducer, INITIAL_STORE);
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    return loadSavedThemes();
  });
  const [versions, setVersions] = useState<ThemeVersion[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    return loadThemeVersions();
  });
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("SaaS Landing");
  const [compareThemeId, setCompareThemeId] = useState<string | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1);
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingPresetName>("Calm");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("SaaS Landing");
  const hasTrackedSessionStart = useRef(false);

  const compareState = useMemo(() => {
    return savedThemes.find((theme) => theme.id === compareThemeId)?.state ?? null;
  }, [savedThemes, compareThemeId]);

  const validation = useMemo(() => validateTheme(store.state), [store.state]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const snapshotId = params.get("snapshot");

      if (snapshotId) {
        const snapshots = loadSnapshots();
        const snapshot = snapshots[snapshotId];
        if (snapshot) {
          const safeSnapshotState = sanitizePartialState(snapshot.state);
          dispatch({
            type: "hydrate",
            state: { ...DEFAULT_STATE, ...safeSnapshotState },
          });
        } else {
          dispatch({ type: "setHydrated" });
        }
      } else {
        const query = window.location.search.slice(1);
        if (query) {
          const parsed = queryStringToState(query);
          const initialState = { ...DEFAULT_STATE, ...parsed };
          dispatch({ type: "hydrate", state: initialState });
        } else {
          dispatch({ type: "setHydrated" });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!store.isHydrated || !featureFlags.guidedMode || typeof window === "undefined") {
      return;
    }

    const completed = window.localStorage.getItem(ONBOARDING_KEY) === "1";
    if (!completed) {
      const frame = window.requestAnimationFrame(() => {
        setShowOnboarding(true);
        setOnboardingStep(1);
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [store.isHydrated, featureFlags.guidedMode]);

  useEffect(() => {
    if (!store.isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(savedThemes));
  }, [savedThemes, store.isHydrated]);

  useEffect(() => {
    if (!store.isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
  }, [versions, store.isHydrated]);

  useEffect(() => {
    if (store.isHydrated && typeof window !== "undefined") {
      const queryString = stateToQueryString(store.state);
      const newUrl = `${window.location.pathname}?${queryString}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [store.state, store.isHydrated]);

  useEffect(() => {
    if (!store.isHydrated || hasTrackedSessionStart.current) return;
    hasTrackedSessionStart.current = true;
    recordHealthEvent("session_started", { template: activeTemplate });
  }, [store.isHydrated, activeTemplate]);

  useEffect(() => {
    if (!store.isHydrated) return;
    recordHealthEvent("theme_validated", {
      template: activeTemplate,
      isValid: validation.valid,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
    });
  }, [validation.valid, validation.errors.length, validation.warnings.length, activeTemplate, store.isHydrated]);

  const handlePresetChange = useCallback((preset: PresetName) => {
    dispatch({ type: "applyPreset", preset });
  }, []);

  const handleStateChange = useCallback(
    (updates: Partial<DesignState>, options?: { commit?: boolean }) => {
      const commit = options?.commit ?? true;
      dispatch({
        type: "applyUpdates",
        updates: sanitizePartialState(updates),
        commit,
      });

      if (commit && Object.keys(updates).length > 0) {
        recordHealthEvent("manual_override", { template: activeTemplate });
      }
    },
    [activeTemplate]
  );

  const handleImportState = useCallback((updates: Partial<DesignState>) => {
    dispatch({
      type: "applyUpdates",
      updates: sanitizePartialState(updates),
      commit: true,
    });
  }, []);

  const handleStateCommit = useCallback(() => {
    dispatch({ type: "commit" });
  }, []);

  const handleUndo = useCallback(() => {
    dispatch({ type: "undo" });
  }, []);

  const handleRedo = useCallback(() => {
    dispatch({ type: "redo" });
  }, []);

  const handleTemplateChange = useCallback((template: TemplateName) => {
    setActiveTemplate(template);
    recordHealthEvent("template_selected", { template, source: "preview" });
  }, []);

  const handleApplyTemplateDefaults = useCallback((template: TemplateName) => {
    const defaults = getTemplateRecommendedDefaults(template);
    dispatch({
      type: "applyUpdates",
      updates: sanitizePartialState({ ...defaults, preset: null }),
      commit: true,
    });
    recordHealthEvent("manual_override", { template, source: "template-default" });
  }, []);

  const handleApplyFeelingPreset = useCallback(
    (preset: FeelingPresetName) => {
      const next = applyFeelingPreset(store.state, preset);
      dispatch({ type: "applyState", state: next });
      recordHealthEvent("manual_override", { template: activeTemplate, source: `feeling:${preset}` });
    },
    [store.state, activeTemplate]
  );

  const handleCreateVersion = useCallback(() => {
    const note = window.prompt("Snapshot note", `Edit for ${activeTemplate}`) ?? "";
    const next = createThemeVersion({
      state: store.state,
      themeName: store.state.preset ?? activeTemplate,
      author: "local-user",
      note,
    });
    setVersions((previous) => pushThemeVersion(previous, next, MAX_THEME_VERSIONS));
  }, [activeTemplate, store.state]);

  const handleRestoreVersion = useCallback(
    (versionId: string) => {
      const version = versions.find((entry) => entry.id === versionId);
      if (!version) return;
      dispatch({ type: "applyState", state: restoreThemeVersion(version) });
    },
    [versions]
  );

  const handleResetSection = useCallback(
    (section: "colors" | "typography" | "shape" | "spacing" | "effects") => {
      const baseline = store.state.preset
        ? { ...PRESETS[store.state.preset], preset: store.state.preset }
        : DEFAULT_STATE;

      if (section === "colors") {
        handleStateChange({
          background: baseline.background,
          text: baseline.text,
          primary: baseline.primary,
          secondary: baseline.secondary,
          accent: baseline.accent,
        });
        return;
      }

      if (section === "typography") {
        handleStateChange({
          fontFamily: baseline.fontFamily,
          typeScale: baseline.typeScale,
          fontWeight: baseline.fontWeight,
          letterSpacing: baseline.letterSpacing,
        });
        return;
      }

      if (section === "shape") {
        handleStateChange({
          borderRadius: baseline.borderRadius,
          buttonStyle: baseline.buttonStyle,
        });
        return;
      }

      if (section === "spacing") {
        handleStateChange({
          baseSpacing: baseline.baseSpacing,
        });
        return;
      }

      handleStateChange({
        shadowIntensity: baseline.shadowIntensity,
        borderVisibility: baseline.borderVisibility,
      });
    },
    [store.state.preset, handleStateChange]
  );

  const handleResetAll = useCallback(() => {
    dispatch({ type: "applyState", state: DEFAULT_STATE });
  }, []);

  const completeOnboarding = useCallback(() => {
    const fromFeeling = applyFeelingPreset(store.state, selectedFeeling);
    const templateDefaults = sanitizePartialState({
      ...getTemplateRecommendedDefaults(selectedTemplate),
      preset: null,
    });
    dispatch({
      type: "applyState",
      state: {
        ...fromFeeling,
        ...templateDefaults,
      },
    });

    setActiveTemplate(selectedTemplate);
    setShowOnboarding(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_KEY, "1");
    }
    recordHealthEvent("template_selected", { template: selectedTemplate, source: "onboarding" });
  }, [store.state, selectedFeeling, selectedTemplate]);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_KEY, "1");
    }
  }, []);

  const handleSaveTheme = useCallback(() => {
    if (featureFlags.constraintBlocking && !validation.canExport) {
      window.alert("Resolve critical validation issues before saving this theme.");
      return;
    }

    const suggestedName = store.state.preset ?? `Theme ${savedThemes.length + 1}`;
    const name = window.prompt("Save theme as", suggestedName)?.trim();
    if (!name) return;

    const now = new Date().toISOString();
    setSavedThemes((previous) => {
      const existingIndex = previous.findIndex(
        (theme) => theme.name.toLowerCase() === name.toLowerCase()
      );

      if (existingIndex >= 0) {
        const next = [...previous];
        next[existingIndex] = {
          ...next[existingIndex],
          state: store.state,
          updatedAt: now,
        };
        return next;
      }

      const nextTheme: SavedTheme = {
        id: `theme_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        name,
        state: store.state,
        createdAt: now,
        updatedAt: now,
      };

      return [nextTheme, ...previous].slice(0, MAX_SAVED_THEMES);
    });
  }, [savedThemes.length, store.state, validation.canExport, featureFlags.constraintBlocking]);

  const handleLoadTheme = useCallback(
    (id: string) => {
      const match = savedThemes.find((theme) => theme.id === id);
      if (!match) return;
      dispatch({ type: "applyState", state: match.state });
      setIsControlsOpen(false);
    },
    [savedThemes]
  );

  const handleDeleteTheme = useCallback((id: string) => {
    setSavedThemes((previous) => previous.filter((theme) => theme.id !== id));
    setCompareThemeId((previous) => (previous === id ? null : previous));
  }, []);

  const handleCompareTheme = useCallback((id: string | null) => {
    setCompareThemeId(id);
  }, []);

  const createShareLink = useCallback(() => {
    if (typeof window === "undefined") return "";

    const id = `snap_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const snapshot: SharedSnapshot = {
      id,
      version: 1,
      state: store.state,
      createdAt: new Date().toISOString(),
    };

    const snapshots = loadSnapshots();
    const entries = Object.entries({ ...snapshots, [id]: snapshot })
      .sort(([, a], [, b]) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, MAX_SNAPSHOTS);

    window.localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(Object.fromEntries(entries)));

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("snapshot", id);
    return url.toString();
  }, [store.state]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          event.preventDefault();
          handleRedo();
        } else {
          event.preventDefault();
          handleUndo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  if (!store.isHydrated) {
    return (
      <div className="h-screen w-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-teal-500 motion-pulse-soft" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden motion-fade-in">
      <TopBar
        currentPreset={store.state.preset}
        onPresetChange={handlePresetChange}
        designState={store.state}
        activeTemplate={activeTemplate}
        canExport={validation.canExport}
        onImportState={handleImportState}
        onCreateShareLink={createShareLink}
        onSaveTheme={handleSaveTheme}
        onOpenControls={() => setIsControlsOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden h-full md:flex">
          <ControlPanel
            state={store.state}
            activeTemplate={activeTemplate}
            validation={validation}
            onChange={handleStateChange}
            onCommit={handleStateCommit}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={store.historyIndex > 0}
            canRedo={store.historyIndex < store.history.length - 1}
            savedThemes={savedThemes}
            onSaveTheme={handleSaveTheme}
            onLoadTheme={handleLoadTheme}
            onDeleteTheme={handleDeleteTheme}
            onCompareTheme={handleCompareTheme}
            compareThemeId={compareThemeId}
            onResetSection={handleResetSection}
            onResetAll={handleResetAll}
            onApplyFeelingPreset={handleApplyFeelingPreset}
            versions={versions}
            onCreateVersion={handleCreateVersion}
            onRestoreVersion={handleRestoreVersion}
          />
        </div>

        <PreviewArea
          state={store.state}
          compareState={compareState}
          activeTemplate={activeTemplate}
          onTemplateChange={handleTemplateChange}
          onApplyTemplateDefaults={handleApplyTemplateDefaults}
        />
      </div>

      <Sheet open={isControlsOpen} onOpenChange={setIsControlsOpen}>
        <SheetContent side="left" className="w-[92vw] max-w-[360px] border-neutral-800 bg-[#0f0f0f] p-0">
          <ControlPanel
            state={store.state}
            activeTemplate={activeTemplate}
            validation={validation}
            onChange={handleStateChange}
            onCommit={handleStateCommit}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={store.historyIndex > 0}
            canRedo={store.historyIndex < store.history.length - 1}
            savedThemes={savedThemes}
            onSaveTheme={handleSaveTheme}
            onLoadTheme={handleLoadTheme}
            onDeleteTheme={handleDeleteTheme}
            onCompareTheme={handleCompareTheme}
            compareThemeId={compareThemeId}
            onResetSection={handleResetSection}
            onResetAll={handleResetAll}
            onApplyFeelingPreset={handleApplyFeelingPreset}
            versions={versions}
            onCreateVersion={handleCreateVersion}
            onRestoreVersion={handleRestoreVersion}
          />
        </SheetContent>
      </Sheet>

      {featureFlags.guidedMode && showOnboarding && (
        <div className="fixed inset-0 z-[70] bg-black/70 p-4 backdrop-blur-sm">
          <div className="mx-auto mt-8 w-full max-w-2xl rounded-xl border border-neutral-700 bg-[#111111] p-5 text-white shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Guided Setup</h2>
                <p className="text-sm text-neutral-400">Get a valid theme in under three minutes.</p>
              </div>
              <button
                type="button"
                onClick={dismissOnboarding}
                className="rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800"
              >
                Skip
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    onboardingStep >= step ? "bg-emerald-500" : "bg-neutral-800"
                  )}
                />
              ))}
            </div>

            {onboardingStep === 1 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Step 1: Choose feeling</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {FEELING_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setSelectedFeeling(preset.name)}
                      className={cn(
                        "rounded border p-3 text-left",
                        selectedFeeling === preset.name
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-neutral-700 bg-neutral-900 hover:border-neutral-500"
                      )}
                    >
                      <p className="text-sm font-medium">{preset.name}</p>
                      <p className="mt-1 text-xs text-neutral-400">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Step 2: Choose template</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(["SaaS Landing", "Portfolio", "Agency", "E-commerce"] as TemplateName[]).map((template) => (
                    <button
                      key={template}
                      type="button"
                      onClick={() => setSelectedTemplate(template)}
                      className={cn(
                        "rounded border p-3 text-left",
                        selectedTemplate === template
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-neutral-700 bg-neutral-900 hover:border-neutral-500"
                      )}
                    >
                      <p className="text-sm font-medium">{template}</p>
                      <p className="mt-1 text-xs text-neutral-400">
                        Recommended defaults available for this template.
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Step 3: Fine tune</h3>
                <div className="rounded border border-neutral-700 bg-neutral-900 p-3 text-sm text-neutral-200">
                  <p>
                    Feeling preset: <span className="font-medium text-white">{selectedFeeling}</span>
                  </p>
                  <p>
                    Template: <span className="font-medium text-white">{selectedTemplate}</span>
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    You can use Basic mode for quick edits, then switch to Advanced when needed.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setOnboardingStep((previous) =>
                    previous <= 1 ? 1 : ((previous - 1) as 1 | 2 | 3)
                  )
                }
                disabled={onboardingStep === 1}
                className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800"
              >
                Back
              </Button>

              {onboardingStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => setOnboardingStep((previous) => (previous + 1) as 1 | 2 | 3)}
                >
                  Next
                </Button>
              ) : (
                <Button type="button" onClick={completeOnboarding}>
                  Apply and Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
