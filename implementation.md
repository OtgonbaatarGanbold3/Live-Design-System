You are a senior product engineer and design-systems architect.  
Your task is to implement the next phase of the `live_design_system` project.

## Project context
`live_design_system` allows customization of design elements (color, text, shape, spacing, templates) to generate aesthetic outcomes (“feelings”) while keeping outputs consistent, accessible, and production-ready.

## Main goals
1. Build a robust Design Token Engine.
2. Add a Rule/Constraint Layer to prevent poor combinations.
3. Introduce emotion-driven Theme Presets.
4. Provide Live Preview for interactive states.
5. Add Export/Integration outputs (JSON, CSS variables, Tailwind, Figma tokens).
6. Add Theme Versioning and rollback.
7. Create a Component Coverage Matrix.
8. Add Template Quality Scoring.

---

## A. Resolve current cons (with implementation strategy)

### 1) Scope creep and overwhelming UX
**Problem:** Too many customization controls can confuse users.  
**Resolution approach:** Progressive disclosure + guided mode.

**Implementation:**
- Add two modes:
  - **Basic mode:** only key controls (primary color, font pair, radius, spacing density).
  - **Advanced mode:** full token editor.
- Add “recommended defaults” per template.
- Add onboarding wizard:
  - Step 1: choose feeling
  - Step 2: choose template
  - Step 3: fine-tune
- Add “Reset section” and “Reset all” controls.

**Acceptance criteria:**
- First-time user can generate a complete usable theme in under 3 minutes.
- Advanced controls are hidden by default.

---

### 2) Inconsistent/ugly or inaccessible combinations
**Problem:** Unconstrained customization can break aesthetics and accessibility.  
**Resolution approach:** Automated guardrails and validation engine.

**Implementation:**
- Create `constraints/` module with:
  - WCAG contrast validation (AA minimum)
  - typography scale validation
  - spacing scale consistency checks
  - radius/shadow harmony checks
- Prevent invalid save/export if critical violations exist.
- Show inline warnings with fix suggestions:
  - “Increase text contrast by 12%”
  - “Use spacing scale step 4 instead of 5 for this component”

**Acceptance criteria:**
- 100% of exported themes pass minimum contrast rules for text/background pairs.
- Validation errors are visible and actionable.

---

### 3) Weak scalability/maintainability from loose token structure
**Problem:** Poor naming and token hierarchy creates long-term technical debt.  
**Resolution approach:** Strict token schema with semantic mapping.

**Implementation:**
- Add token layers:
  1. **Primitive tokens** (raw values): color.blue.500, space.4, radius.md
  2. **Semantic tokens** (intent): color.bg.surface, color.text.primary, space.component.padding.md
  3. **Component tokens**: button.primary.bg, input.border.focus
- Define schema in `tokens/schema.json`.
- Add token linter:
  - naming convention
  - required semantic coverage
  - no direct primitive use in components (unless explicitly allowed)
- Add migration script for old token names.

**Acceptance criteria:**
- Token CI check fails on schema violations.
- Components consume semantic/component tokens, not arbitrary raw values.

---

### 4) Template quality dependency
**Problem:** Low-quality templates reduce trust and outcomes.  
**Resolution approach:** Template QA pipeline and scoring.

**Implementation:**
- Add `template_score` module:
  - Accessibility score (0–100)
  - Responsiveness score (0–100)
  - Consistency score (0–100)
  - Performance score (0–100)
- Compute overall weighted score.
- In template picker:
  - show score badge
  - show “recommended” label for high-scoring templates
- Add minimum quality threshold for publishing templates.

**Acceptance criteria:**
- Every template has a visible score breakdown.
- Templates below threshold are flagged as “needs improvement”.

---

### 5) Lack of measurable outcomes
**Problem:** Hard to know if project is improving.  
**Resolution approach:** Product telemetry and quality metrics dashboard.

**Implementation:**
- Track:
  - Time to first valid theme
  - Export success rate
  - Accessibility pass rate
  - Template reuse rate
  - Number of manual overrides
- Add internal dashboard page `analytics/design-system-health`.
- Add weekly summary job.

**Acceptance criteria:**
- Metrics available by project and by template.
- Team can compare baseline vs current sprint performance.

---

## B. Core implementation plan for next goals

### Goal 1: Design Token Engine
**Tasks:**
- Create canonical token registry.
- Add CRUD APIs for tokens.
- Add inheritance support (base theme -> variant).
- Support dark/light mode token branches.

**Deliverables:**
- `tokens/schema.json`
- `tokens/registry.ts`
- `services/tokenResolver.ts`
- tests for resolution and fallback behavior

---

### Goal 2: Rule/Constraint Layer
**Tasks:**
- Build validation pipeline (`validateTheme(theme)`).
- Add severity levels: error/warning/info.
- Attach remediation suggestions for each failed rule.

**Deliverables:**
- `constraints/rules/*`
- `constraints/engine.ts`
- UI warning panel component
- tests with invalid/valid fixtures

---

### Goal 3: Feeling-based Theme Presets
**Tasks:**
- Define 6 presets: Calm, Bold, Playful, Premium, Minimal, Editorial.
- Map each preset to token bundles.
- Add preview cards + one-click apply.

**Deliverables:**
- `presets/*.json`
- `presets/index.ts`
- preset preview UI

---

### Goal 4: Live Preview + Component States
**Tasks:**
- Real-time token application with no reload.
- Preview states: default, hover, focus, active, disabled, error.
- Side-by-side desktop/mobile preview.

**Deliverables:**
- `preview/ThemePreview.tsx`
- `preview/StateSwitcher.tsx`
- snapshot tests for state rendering

---

### Goal 5: Export/Integration
**Tasks:**
- Build exporters:
  - Design Tokens JSON
  - CSS variables
  - Tailwind config extension
  - Figma tokens format
- Add “Export report” showing validation + compatibility.

**Deliverables:**
- `exporters/json.ts`
- `exporters/cssVariables.ts`
- `exporters/tailwind.ts`
- `exporters/figma.ts`
- download UI and API endpoints

---

### Goal 6: Theme Versioning
**Tasks:**
- Save version snapshots with metadata (author, timestamp, note).
- Diff view between versions.
- Restore previous version.

**Deliverables:**
- `versioning/themeVersions.ts`
- `ui/VersionHistory.tsx`
- rollback tests

---

### Goal 7: Component Coverage Matrix
**Tasks:**
- Track token support per component.
- Show unsupported token dimensions.
- Use matrix to prioritize backlog.

**Deliverables:**
- `coverage/componentCoverage.json`
- coverage dashboard table UI

---

### Goal 8: Template Quality Scoring
**Tasks:**
- Implement score calculators.
- Add CI gate for minimum template score.
- Display score in selection and admin views.

**Deliverables:**
- `quality/scoreEngine.ts`
- `quality/weights.json`
- CI check integration

---

## C. Architecture and implementation standards
- Use strict TypeScript types for token schema and validation results.
- Add unit tests for each rule and exporter.
- Add integration tests for end-to-end flow:
  - select preset -> customize -> validate -> export.
- Add feature flags for phased rollout.
- Keep all modules composable and framework-agnostic where possible.

---

## D. Delivery sequence (recommended)
1. Token schema + resolver  
2. Constraint engine  
3. Presets  
4. Live preview states  
5. Exporters  
6. Versioning  
7. Coverage matrix  
8. Quality scoring + CI gates + analytics

---

## E. Definition of Done
A sprint is complete only when:
- All 8 goals have working MVP implementations.
- Accessibility validation is enforced.
- Exports succeed for all supported formats.
- Version history and rollback work.
- Template scoring is visible and enforced in CI.
- Dashboard shows measurable improvement metrics.
- Tests pass in CI with documented architecture decisions.

---

## F. Output format required from implementation agent
Return:
1. Summary of files created/modified
2. Key architectural decisions
3. Any migrations required
4. Test results
5. Known limitations and next iteration recommendations