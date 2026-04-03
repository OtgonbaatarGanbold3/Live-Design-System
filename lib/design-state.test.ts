import { describe, expect, it } from "vitest";
import {
  DEFAULT_STATE,
  parseImportedState,
  queryStringToState,
  stateToTokenJSON,
} from "./design-state";

describe("queryStringToState", () => {
  it("sanitizes invalid hex and clamps numeric values", () => {
    const parsed = queryStringToState(
      "bg=ffffff&text=000000&primary=zzzzzz&spacing=99&radius=-12&baseSpacing=2&weight=Heavy"
    );

    expect(parsed.background).toBe("#ffffff");
    expect(parsed.text).toBe("#000000");
    expect(parsed.primary).toBeUndefined();
    expect(parsed.letterSpacing).toBe(10);
    expect(parsed.borderRadius).toBe(0);
    expect(parsed.baseSpacing).toBe(4);
    expect(parsed.fontWeight).toBeUndefined();
  });
});

describe("state exports", () => {
  it("exports token json with semantic section", () => {
    const output = stateToTokenJSON(DEFAULT_STATE);
    const parsed = JSON.parse(output) as { semantic?: Record<string, string> };

    expect(parsed.semantic).toBeDefined();
    expect(parsed.semantic?.surface).toMatch(/^#/);
    expect(parsed.semantic?.danger).toBe("#dc2626");
  });
});

describe("parseImportedState", () => {
  it("accepts top-level state payloads", () => {
    const imported = parseImportedState(
      JSON.stringify({
        state: {
          background: "#101010",
          text: "#fefefe",
          baseSpacing: 18,
        },
      })
    );

    expect(imported).toMatchObject({
      background: "#101010",
      text: "#fefefe",
      baseSpacing: 18,
    });
  });

  it("returns null for invalid JSON", () => {
    expect(parseImportedState("not-json")).toBeNull();
  });
});
