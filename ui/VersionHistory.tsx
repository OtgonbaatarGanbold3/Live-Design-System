"use client";

import { useMemo } from "react";
import { RotateCcw, Save } from "lucide-react";
import type { DesignState } from "@/lib/design-state";
import { Button } from "@/components/ui/button";
import { diffThemeVersions, type ThemeVersion } from "@/versioning/themeVersions";

interface VersionHistoryProps {
  versions: ThemeVersion[];
  currentState: DesignState;
  onRestore: (versionId: string) => void;
  onSnapshot: () => void;
}

export function VersionHistory({ versions, currentState, onRestore, onSnapshot }: VersionHistoryProps) {
  const versionsWithDiff = useMemo(() => {
    return versions.map((version) => ({
      version,
      diff: diffThemeVersions(version.state, currentState),
    }));
  }, [versions, currentState]);

  return (
    <section className="rounded border border-neutral-800 bg-neutral-900/50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Version History</h3>
          <p className="text-xs text-neutral-500">Save snapshots and rollback to previous versions.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSnapshot}
          className="h-7 border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800"
        >
          <Save className="mr-1.5 h-3.5 w-3.5" />
          Snapshot
        </Button>
      </div>

      {versionsWithDiff.length === 0 ? (
        <p className="text-xs text-neutral-500">No versions yet. Save a snapshot after meaningful edits.</p>
      ) : (
        <div className="flex max-h-52 flex-col gap-2 overflow-auto pr-1">
          {versionsWithDiff.map(({ version, diff }) => (
            <div key={version.id} className="rounded border border-neutral-700 bg-neutral-950/70 p-2">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-medium text-white">{version.note}</p>
                <span className="text-[10px] text-neutral-500">{new Date(version.createdAt).toLocaleString()}</span>
              </div>
              <div className="mb-2 text-[11px] text-neutral-400">
                <span>{version.author}</span>
                <span className="mx-1">|</span>
                <span>{diff.length} field changes from current</span>
              </div>
              {diff.length > 0 && (
                <p className="mb-2 text-[10px] text-neutral-500">
                  Changed: {diff.slice(0, 4).map((item) => item.field).join(", ")}
                  {diff.length > 4 ? "..." : ""}
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRestore(version.id)}
                className="h-6 border-neutral-700 bg-transparent px-2 text-[10px] text-neutral-300 hover:bg-neutral-800"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Restore
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
