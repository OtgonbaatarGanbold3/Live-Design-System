import { describe, expect, it } from "vitest";
import type { DesignState } from "@/lib/design-state";
import {
  createThemeVersion,
  diffThemeVersions,
  pushThemeVersion,
  restoreThemeVersion,
} from "@/versioning/themeVersions";

const BASE_STATE: DesignState = {
  background: "#ffffff",
  text: "#111111",
  primary: "#2563eb",
  secondary: "#4b5563",
  accent: "#14b8a6",
  fontFamily: "system-ui",
  typeScale: "1.25",
  fontWeight: "Regular",
  letterSpacing: 0,
  borderRadius: 8,
  buttonStyle: "Filled",
  baseSpacing: 16,
  shadowIntensity: "Soft",
  borderVisibility: "Subtle",
  preset: null,
};

describe("theme versioning", () => {
  it("creates and restores snapshots", () => {
    const version = createThemeVersion({
      state: BASE_STATE,
      themeName: "Test",
      author: "tester",
      note: "initial",
    });

    expect(version.themeName).toBe("Test");
    expect(restoreThemeVersion(version)).toEqual(BASE_STATE);
  });

  it("tracks diffs between states", () => {
    const diff = diffThemeVersions(BASE_STATE, {
      ...BASE_STATE,
      primary: "#7c3aed",
      baseSpacing: 20,
    });

    expect(diff.map((item) => item.field)).toEqual(expect.arrayContaining(["primary", "baseSpacing"]));
  });

  it("caps history length when pushing", () => {
    const first = createThemeVersion({
      state: BASE_STATE,
      themeName: "Test",
      author: "tester",
    });
    const second = createThemeVersion({
      state: { ...BASE_STATE, accent: "#f97316" },
      themeName: "Test",
      author: "tester",
    });

    const list = pushThemeVersion([first], second, 1);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(second.id);
  });
});
