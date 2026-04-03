const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...await import("eslint-config-next/core-web-vitals").then((m) => m.default),
  ...await import("eslint-config-next/typescript").then((m) => m.default),
];

export default config;
