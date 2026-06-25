---
name: project-calk-viewer-scope
description: LNS-376 CALK viewer — module layer scaffolded by LNS-365 but untyped; net-new = polymorphic typed model + tab-enable + provider/impl/dispatcher-viewer; CONTRACT RESOLVED — 5 notes, MIXED content (note 3 = line_items table), branch on content_type
metadata:
  type: project
---

LNS-376 = FE read-only CALK (Catatan atas Laporan Keuangan / Notes to Financial Statements) viewer on the shared report shell. FE-only adoption of shipped BE contract `GET /accounting/reports/calk?as_of=` (LNS-361/362 Done) — `Frontend` label only, NO `fe-requested-be`.

**CONTRACT RESOLVED (EL parsed live OpenAPI, 2026-06-25) — supersedes my earlier "prose-only" framing + the "unknown shape" note below:**
- `notes[]` = exactly **5**, ordered by `note_number` (array order == note order; render as-is, NO client sort).
- `CalkNote`: `note_number`, `paragraph_ref` (SAK ref e.g. "6.2(a)"), `title`, `content_type` enum **`"text" | "line_items"`**, `kind` (always "hybrid"), `requires_tenant_confirmation` (bool), `text` (nullable string), `lines` (nullable `CalkLine[]`).
- **Notes 1,2,4,5 = `text` prose; Note 3 = `line_items`** → table of `CalkLine` `{label, bucket, amount (raw IDR int), display_order}` sorted by `display_order`. **Viewer + model BRANCH on `content_type`.**
- `CalkMeta`: `tenant_id, entity_name, title, subtitle, as_of, as_of_display (BE pre-formatted Indonesian long date — render VERBATIM, never reformat; LNS-377-class blank/off-by-one risk), periode, fiscal_year_start_as_of, period_status (open|closed|locked), currency, generated_at`.
- **Model is POLYMORPHIC:** typed `CalkMeta`/`CalkNote`/`CalkLine` under root `CalkModel→CalkReportEntity`. Structural analog = **Neraca** (single-period as-of), NOT arus-kas. No imbalance banner; no ROUTE_MAP entry (tab on existing `/finance/reports`).
- UID: prose `max-w-prose leading-7`; line-items as quiet `<dl>` label / right-aligned IDR (NumberDisplay `prefix="Rp"`, `tabular-nums`, integer rupiah no decimals), not a heavy table. Viewer = `calk-viewer` dispatcher + children `calk-note-text` + `calk-note-line-items`.
- **PM call (OQ-PM-1): tab label = `CALK` all-caps** (acronym; mixed-case "CaLK" in strip was inconsistent).
- **Known-open (non-blocking):** no-data-period BE behavior (5 template notes sparse vs 404?) — FE ships `calk-empty-body` defensively either way.

**Already shipped by [[project-report-shell-contract]] (LNS-365):** CALK module layer — `get-calk-report.usecases.ts`, `use-get-calk-report.ts(.types)`, `data/sources/report.ts getCalk()` (calls the endpoint, `{data}` unwrap, JWT tenant), `data/repositories/report.ts getCalk()`, SWR key `GET_CALK_REPORT`. BUT untyped: `CalkReportData = { data: Record<string,any> }` and repo passes raw JSON (no model/toEntity) — same pre-typing state Neraca was in. Tab in `reports-tab-strip.tsx` is `disabled:true` ("Segera hadir") and `activeTab` unions exclude `"calk"`.

**Net-new for LNS-376:** (1) polymorphic typed model (`CalkReportEntity` + `CalkMeta`/`CalkNote`/`CalkLine`), retype `CalkReportData`, wire `toEntity()` in repo getCalk; (2) enable tab + widen `activeTab` union in tab-strip (`disabled:true`→false, label→`CALK`); (3) `page.tsx` ActiveTab + handler guard + mount; (4) ADD `calk-provider.tsx`, `calk-impl.tsx`, `calk-viewer.tsx` (dispatcher) + `calk-note-text.tsx` + `calk-note-line-items.tsx`, `calk-empty-body.tsx`. **No imbalance** path.

**Already scaffolded by [[project-report-shell-contract]] (LNS-365):** CALK module layer — `get-calk-report.usecases.ts`, `use-get-calk-report`, `data/sources/report.ts getCalk()` (endpoint + `{data}` unwrap + JWT tenant), `data/repositories/report.ts getCalk()`, SWR key `GET_CALK_REPORT`. Was untyped `Record<string,any>` (repo passed raw JSON, no model) — LNS-376 types it.

**Report-viewer wiring pattern (all 6 reports):** `page.tsx` tab router → `_providers/{r}-provider.tsx` (asOf state + hook + derives shellState loading/empty/success/error + onRetry) → `_components/{r}-impl.tsx` (adapter: provider ctx → ReportShell props, wraps in role=tabpanel) → `presentations/components/reports/{r}-viewer.tsx` (presentational props-only). Inactive tabs unmount (no bg fetch).

**Why:** scoping LNS-376; PRD delivered + finalized 2026-06-25.
**How to apply:** if re-scoping CALK or another report viewer, reuse this delta map + the 4-layer wiring pattern; CALK contract fields above are now FE-confirmed (typed in this ticket).
