# AestheticOS

AestheticOS is a real-time design system playground built with Next.js. It lets you tune colors, typography, spacing, shape, and depth while previewing multiple template types side-by-side.

## Highlights

- Real-time design controls with undo/redo history
- URL-synced state for shareable themes
- Snapshot links for short-link sharing
- Saved theme library in local storage
- Side-by-side compare mode
- Responsive preview frames (desktop, tablet, mobile)
- Accessibility-oriented guidance (contrast and hierarchy warnings)
- Multi-format export:
  - CSS custom properties
  - Token JSON
  - Tailwind theme snippet
- Import from exported JSON theme payloads

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- Vercel Analytics events
- Vitest (unit tests)
- Playwright (e2e tests)

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Run in development

```bash
npm run dev
```

3. Open the app

```text
http://localhost:3000
```

## Scripts

- `npm run dev`: Start local dev server
- `npm run build`: Production build
- `npm run start`: Start production server
- `npm run lint`: ESLint checks
- `npm run lint:fix`: Auto-fix lint issues
- `npm run typecheck`: TypeScript checks
- `npm run test`: Run unit tests
- `npm run test:watch`: Run unit tests in watch mode
- `npm run test:e2e`: Run Playwright e2e tests

## Sharing and Persistence

- Theme edits are reflected in the URL query string.
- The `Share` action creates a snapshot link with a compact `snapshot` id.
- Saved themes are stored in local storage under:
  - `aestheticos:saved-themes:v1`
  - `aestheticos:snapshots:v1`

## Validation and Safety

- Query string values are sanitized and clamped to safe ranges.
- Imported JSON is validated before applying.
- Build-time type checking is enabled.

## Project Structure

- `app/`: Next.js app entry and global styles
- `components/aesthetic-os/`: Playground shell, controls, and preview templates
- `lib/design-state.ts`: State model, presets, validation, exports, and utility logic
- `tests/e2e/`: Playwright integration tests
- `.github/workflows/ci.yml`: CI for lint, typecheck, tests, build, and e2e

## CI

GitHub Actions runs:

1. Typecheck
2. Lint
3. Unit tests
4. Build
5. Playwright e2e

## Notes

- If Playwright is not installed locally, run:

```bash
npx playwright install chromium
```
