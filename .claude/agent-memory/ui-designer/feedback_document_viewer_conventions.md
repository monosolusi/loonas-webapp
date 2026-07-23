---
name: document-viewer-conventions
description: Validated layout, typography, and statutory-copy conventions for prose/document report viewers (e.g. CALK)
metadata:
  type: feedback
---

Conventions validated on LNS-376 (CALK / Catatan atas Laporan Keuangan viewer) for any **document/prose report viewer** surface (statements, notes, summaries) — distinct from the tabular report viewers. EL/SWE accepted all of these without challenge; they are non-obvious and engineers tend to "normalize" them away, so spell them out in the spec's "Do NOT optimize away" section.

**Layout & typography**
- **`max-w-prose` goes on the per-note/article wrapper, NOT the `SectionCard` container.** The card border spans full width; the prose column caps at ~65ch and the right-side white space on desktop is intentional — a 120-char statutory line is harder to read. Engineers consistently suspect this is a bug and remove it; flag it as deliberate.
- **`leading-7` (1.75), not `leading-6` (1.5), for sustained prose bodies.** Tabular report cells use `leading-6`; do not normalize prose to match them — prose needs more inter-line air.
- **Label/amount pairs embedded in a prose document use `<dl>` (dt/dd), not `<table>`.** A `<table>` reads as a data-grid break in a prose reading flow; a `<dl>` carries the same visual weight as a paragraph block while staying semantically correct for key/value pairs. (CALK Note 3 line-items.)
- **Spec a surface-specific loading skeleton, not the shared `ReportShellLoading`.** The generic shell skeleton is a 3-column tabular shape that misrepresents prose content before it loads; a prose viewer needs a prose-shaped skeleton (title bar + paragraph lines) to avoid layout-shift surprise. (Nice-to-have; generic is an acceptable v1 fallback.)
- **Row dividers use `divide-neutral-100` / `border-neutral-100` (#D9DADA on white ≈ 1.7:1).** This fails the 3:1 non-text WCAG AA bar but matches `neraca-section.tsx` and every other report row rule in this codebase. Flag the contrast shortfall in the spec WITH the project-pattern justification; default to the established pattern, escalate to EL only if strict AA enforcement is required for the surface.

**Indonesian SAK-EMKM statutory copy**
- **Date anchor prefix is `Per {date}`** (e.g. "Per 30 Juni 2026") rendered above the content when a BE-formatted `as_of_display` is shown. Do not render the raw date string alone — "Per" is the standard Indonesian accounting date convention.
- **Paragraph references use the prefix `Catatan {ref}`** (e.g. "Catatan 6.2(a)") as a small subdued line below each note title — the correct SAK-EMKM citation convention.

See [[provisional-shape-dependent-layout]] — for a document viewer whose item shape is a discriminated union (e.g. CALK's `content_type`), confirm the shape with EL before committing these treatments.
