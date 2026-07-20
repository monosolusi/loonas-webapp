---
name: project-tax-posture-lns380
description: Tax Posture settings page LNS-380 — design decisions, component choices, open questions for EL
metadata:
  type: project
---

# LNS-380 — Tax Posture Settings Page (`/settings/tax-posture`)

## Key decisions locked

- **Layout:** Stacked sections (no tabs). Form SectionCard on top, Change History SectionCard below. Tabs rejected — tasks are sequential not alternative.
- **`is_pkp` read-only:** StatusChip (neutral/success variant) + helper text. No toggle, no lock icon. Copy: "Dikelola otomatis oleh Loonas berdasarkan aktivasi PPN. Tidak dapat diubah di sini."
- **Null triad first-time state:** Pre-fill defaults (Perorangan, is_pph_final_umkm=true, is_pkp=false), show single caption-weight line "Postur pajak belum diatur. Data di bawah adalah nilai default sistem." No error banner, no empty-state CTA.
- **Legal form labels:** sole_proprietor→Perorangan, cv→CV, firma→Firma, pt→PT, koperasi→Koperasi.
- **403 state:** LockClosedIcon (neutral-200) + "Akses Tidak Diizinkan" heading + body copy. No red. role="alert".

## Component map

- Form card: SectionCard + TextInput (npwp, nppkp, sektor_klbi, date fields) + SelectInput (legal_form) + Headless UI Switch for is_pph_final_umkm + StatusChip for is_pkp
- History card: SectionCard + TableContainer + vertical card-like rows (NOT a flat grid — changed_fields is variable-length) + TablePagination
- Page shell: DetailPageHeader (backHref="/settings")
- Provider: TaxPostureProvider with two SWR keys (posture + history)

## History row design (v1 BE payload confirmed)

BE payload per entry: `created_at`, `actor_role`, `actor_user_id` (suppressed — opaque, no display value), `changed_fields` (map: field→{prior,next}), `npwp_classification` (nullable).

**Row layout:** 2-zone vertical structure inside TableContainer.
- Zone 1 (row header): `flex items-center justify-between` — timestamp (text-sm text-neutral-400, Luxon "DD MMM YYYY, HH:mm") on left; StatusChip neutral variant for actor_role ("Owner"/"Accountant"/"Internal") on right.
- Zone 2 (changed fields): `flex flex-col gap-y-2` — each changed field on one line: `grid grid-cols-[minmax(140px,_1.5fr)_1fr_20px_1fr]` — field label (medium, neutral-500) | prior value (muted, neutral-300) | → (aria-hidden) | next value (semibold, neutral-500).

**Prior value null/empty:** render as italic "Belum diatur" in text-neutral-200.

**npwp_classification badge:** when npwp changes and classification present, render StatusChip inline after next value — neutral for npwp_15/npwp_16, warning for nik_as_npwp (compliance signal).

**Field label map:** legal_form→Bentuk Usaha, npwp→NPWP, nppkp→NPPKP, pkp_effective_date→Tanggal Efektif PKP, pph_final_eligibility_start→Mulai PPh Final UMKM, sektor_klbi→Sektor KLBI, is_pph_final_umkm→PPh Final UMKM, is_pkp→Status PKP.

**Boolean display:** is_pph_final_umkm + is_pkp render as "Aktif"/"Tidak Aktif", never raw true/false.

**Table header:** minimal 2-col — "WAKTU & PERUBAHAN" left, "PERAN" right. No column header needed for changed-fields zone.

**A11y:** arrow → wrapped in aria-hidden + sr-only "diubah menjadi"; actor_role chip prefixed with sr-only "Diubah oleh:"; timestamp in `<time dateTime={isoString}>`.

**V2 upgrade path:** row header right zone can accept avatar + name + role without layout change when BE adds display name endpoint.

## A11y flags

- StatusChip neutral variant: text-neutral-400 on bg-neutral-100 ≈ 1.2:1, fails AA. Flagged as open question — EL to grep call sites before patching.
- Interactive toggle focus ring: solid ring-primary-300 required (not /20 opacity). Solid #007BFF on white ≈ 3.98:1, passes 3:1 non-text AA.

## Open questions for EL (not yet resolved)

1. StatusChip neutral contrast fix scope (all call sites vs local override)
2. Interactive toggle approach (new ToggleInput vs inline Headless UI Switch)
3. Toast primitive existence (check package.json)
4. TablePagination count label hardcodes "data" — recommend adding optional `countLabel` prop (default "data") so history can say "perubahan". EL to decide scope.
5. Unsaved-changes navigation guard (PM to confirm for v1)

## ROUTE_MAP and tile

- Add `"/settings/tax-posture": { title: "Pengaturan" }` to `header-title.tsx`
- Add SettingsCategoryCard for "Postur Pajak" in `/settings/page.tsx`, gated on `hasFeature("accounting")`

**Why:** This page is part of the accounting bootstrap (same feature gate as Fixed Costs, CoA Mappings). The ROUTE_MAP entry is mandatory — without it chrome header silently falls back to "Dashboard".

**How to apply:** When revisiting this page in future sessions, the decisions above are locked for v1. The open questions need EL resolution before implementation can finalize.

[[project_settings_page]] [[design_language]] [[project_accounting_surfaces_ia]]
