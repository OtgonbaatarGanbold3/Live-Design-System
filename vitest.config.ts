import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    include: [
      "lib/**/*.test.ts",
      "constraints/**/*.test.ts",
      "tokens/**/*.test.ts",
      "exporters/**/*.test.ts",
      "preview/**/*.test.tsx",
      "versioning/**/*.test.ts",
      "quality/**/*.test.ts",
    ],
    environment: "node",
    coverage: {
      enabled: false,
    },
  },
});
