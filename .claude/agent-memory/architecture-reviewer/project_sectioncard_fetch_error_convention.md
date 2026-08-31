---
name: sectioncard-fetch-error-convention
description: established convention for a SectionCard data-fetch-error state — text-error-* palette, ExclamationCircleIcon, retry button — not yet in CLAUDE.md but consistent across the codebase
metadata:
  type: project
---

Precedent components for "this card's data failed to load" inside a `SectionCard`:
- `src/app/(authenticated)/accounting/opening-balance/_components/wizard-fetch-error.tsx`
- `src/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/cogs-block-error.tsx`
- (also `gross-profit-block-error.tsx`, `cost-structure-block-error.tsx` in the same profitability route)

All use `text-error-*` (`text-error-300`/`text-error-400`, red) + `ExclamationCircleIcon` (not `ExclamationTriangleIcon`), and all offer a retry `SecondaryButton` ("Coba Lagi" / "Muat Ulang") so a transient failure is recoverable without a full page reload.

**Why this matters for review**: `text-warning-*` (amber) + `ExclamationTriangleIcon` reads as "heads up" rather than "this failed," and is the wrong signal for a data-fetch-error state — it's inconsistent with the rest of the app's error-state vocabulary. A fetch-error card with no retry action is also a UX regression relative to precedent, since the only recovery is a hard reload.

**How to apply**: when reviewing a new component that renders a SectionCard's data-fetch-error state, check palette (`error-*` not `warning-*`), icon (`ExclamationCircleIcon` not `ExclamationTriangleIcon`), and whether a retry action is offered. Found first in LNS-489's `product-detail-production-error.tsx`, which used `warning-300` + `ExclamationTriangleIcon` with no retry — flagged Minor/non-blocking (not a hard CLAUDE.md rule, but a real, checkable convention deviation). [[revalidate-swr-key-throws-in-catch]] was the same review's Major finding, for context.

**Two scopes, two shapes — do not cross-flag.** The `size-5 text-error-300` shape above is the *in-card* convention. The *full-page* accounting shape is different and equally established: `ExclamationCircleIcon size-10 text-neutral-200` + page copy + retry + a nav link out — `journal-detail-error.tsx`, `cash-entry-detail-error.tsx`, `cash-entry-settings-error.tsx` (LNS-743). So `text-neutral-200` on a page-level error icon is precedent-following, not the in-card drift; scope the component to its mount point before flagging the palette. CLAUDE.md only codifies the in-card shape (and warns against copying the page-scoped `receipt-error.tsx` into a card), which is why the page-level shape is recorded here.
