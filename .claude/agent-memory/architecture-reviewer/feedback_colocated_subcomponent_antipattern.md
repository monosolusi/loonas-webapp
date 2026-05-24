---
name: feedback-colocated-subcomponent-antipattern
description: Engineers frequently co-locate private sub-components (e.g. ActivityIcon) inside a larger component file instead of extracting to their own file — one-component-per-file rule violation.
metadata:
  type: feedback
---

Engineers sometimes place small helper React components (functions that return JSX, have their own props interface) inside a parent component file as private module-scope functions. Examples seen: `ActivityIcon` inside `dashboard-recent-activity-row.tsx` (LNS-232).

**Why:** The one-component-per-file convention is a hard rule in CLAUDE.md and the create-component skill. Private helper components still count as components.

**How to apply:** When reviewing, scan every file for non-exported JSX-returning functions — if they have their own props interface and return JSX, flag as a one-component-per-file violation. Pure utility functions (mapStatus, toActivityView) that return plain objects or primitives are fine to co-locate.
