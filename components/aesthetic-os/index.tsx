"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { TopBar } from "./top-bar";
import { ControlPanel } from "./control-panel";
import { PreviewArea } from "./preview-area";
import {
  type DesignState,
  type PresetName,
  type SavedTheme,
  type SharedSnapshot,
  PRESETS,
  DEFAULT_STATE,
  sanitizePartialState,
  stateToQueryString,
  queryStringToState,
} from "@/lib/design-state";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const MAX_HISTORY = 50;
const MAX_SNAPSHOTS = 30;
const MAX_SAVED_THEMES = 30;
const SAVED_THEMES_KEY = "aestheticos:saved-themes:v1";
const SNAPSHOTS_KEY = "aestheticos:snapshots:v1";

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

export function AestheticOS() {
  const [store, dispatch] = useReducer(designerReducer, INITIAL_STORE);
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    return loadSavedThemes();
  });
  const [compareThemeId, setCompareThemeId] = useState<string | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const compareState = useMemo(() => {
    return savedThemes.find((theme) => theme.id === compareThemeId)?.state ?? null;
  }, [savedThemes, compareThemeId]);

  // Load state from URL on mount
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
    if (!store.isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(savedThemes));
  }, [savedThemes, store.isHydrated]);

  // Update URL when state changes
  useEffect(() => {
    if (store.isHydrated && typeof window !== "undefined") {
      const queryString = stateToQueryString(store.state);
      const newUrl = `${window.location.pathname}?${queryString}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [store.state, store.isHydrated]);

  const handlePresetChange = useCallback((preset: PresetName) => {
    dispatch({ type: "applyPreset", preset });
  }, []);

  const handleStateChange = useCallback(
    (updates: Partial<DesignState>, options?: { commit?: boolean }) => {
      dispatch({
        type: "applyUpdates",
        updates: sanitizePartialState(updates),
        commit: options?.commit ?? true,
      });
    },
    []
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

  const handleSaveTheme = useCallback(() => {
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
  }, [savedThemes.length, store.state]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
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
        onImportState={handleImportState}
        onCreateShareLink={createShareLink}
        onSaveTheme={handleSaveTheme}
        onOpenControls={() => setIsControlsOpen(true)}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden h-full md:flex">
          <ControlPanel
            state={store.state}
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
          />
        </div>

        <PreviewArea state={store.state} compareState={compareState} />
      </div>

      <Sheet open={isControlsOpen} onOpenChange={setIsControlsOpen}>
        <SheetContent side="left" className="w-[92vw] max-w-[360px] border-neutral-800 bg-[#0f0f0f] p-0">
          <ControlPanel
            state={store.state}
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
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
