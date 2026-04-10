import type { DesignState } from "@/lib/design-state";

export interface ThemeVersion {
  id: string;
  themeName: string;
  author: string;
  note: string;
  createdAt: string;
  state: DesignState;
}

export interface ThemeVersionDiff {
  field: keyof DesignState;
  from: DesignState[keyof DesignState];
  to: DesignState[keyof DesignState];
}

export function createThemeVersion(input: {
  state: DesignState;
  themeName: string;
  author: string;
  note?: string;
}): ThemeVersion {
  const timestamp = new Date().toISOString();
  return {
    id: `ver_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    themeName: input.themeName,
    author: input.author,
    note: input.note?.trim() || "Snapshot",
    createdAt: timestamp,
    state: input.state,
  };
}

export function diffThemeVersions(from: DesignState, to: DesignState): ThemeVersionDiff[] {
  const keys = Object.keys(from) as (keyof DesignState)[];
  const changes: ThemeVersionDiff[] = [];

  for (const key of keys) {
    if (from[key] !== to[key]) {
      changes.push({
        field: key,
        from: from[key],
        to: to[key],
      });
    }
  }

  return changes;
}

export function restoreThemeVersion(version: ThemeVersion): DesignState {
  return version.state;
}

export function pushThemeVersion(list: ThemeVersion[], next: ThemeVersion, maxEntries = 50): ThemeVersion[] {
  return [next, ...list].slice(0, maxEntries);
}
