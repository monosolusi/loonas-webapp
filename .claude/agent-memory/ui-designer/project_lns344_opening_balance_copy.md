---
name: lns344-opening-balance-copy
description: Copy strings and placement decisions for LNS-344 — mid-year migration Laba Rugi explainer (Item A) and 422 NORMAL_BALANCE_HINT actionable block (Item B)
metadata:
  type: project
---

Last updated: 2026-06-19.

## Item A — Mid-year migration Laba Rugi explainer

**Placement:** Inline info callout inside `ReportShellSuccess` (inside the SectionCard, above the table). Rendered only when `report.meta.isMigrationStub === true` (BE flag TBD — see open question). Composable as a new `<LabaRugiMigrationNotice />` component inside `laba-rugi-viewer.tsx` or injected via a slot in `laba-rugi-impl.tsx`.

**Copy (final):**
- Heading: "Periode migrasi — laporan dimulai dari tanggal pindah"
- Body: "Laba Rugi ini hanya mencakup aktivitas sejak tanggal migrasi Anda ke Loonas. Laba atau rugi sebelum tanggal tersebut sudah tercatat di akun Saldo Laba Ditahan Periode Sebelumnya (ekuitas), sehingga tidak ada data yang hilang."

**Component pattern:** `bg-primary-50 border border-primary-100 rounded-lg` callout with `InformationCircleIcon` in `text-primary-300`. Matches the established info-callout color family (blue-pale tint, Lunas Blue icon). NOT a warning (ExclamationTriangle) — this is contextual guidance, not an error.

## Item B — 422 NORMAL_BALANCE_HINT

**Two-case design:** single adaptive block, not two separate messages. The discriminator is whether ANY offending line maps to an equity account type (debit-normal, natural equity balance is credit). If so, accumulated-deficit path.

**Generic wrong-side path:**
- Heading: "Periksa sisi debit/kredit akun berikut"
- Body: "Beberapa akun diisi pada sisi yang berlawanan dengan saldo normalnya. Koreksi sesuai petunjuk di bawah ini, lalu coba simpan kembali."
- Per-line item: "[Nama Akun (kode)] — Anda mengisi sisi [Debit/Kredit], saldo normal akun ini adalah [Kredit/Debit]."

**Accumulated-deficit (equity-on-debit) path:**
- Heading: "Saldo akumulasi rugi belum didukung di versi ini"
- Body: "Kami mendeteksi bahwa ekuitas usaha Anda berada di posisi defisit (sisi debit). Kondisi ini belum dapat diproses secara otomatis pada versi saat ini. Hubungi tim Loonas untuk dibantu melanjutkan migrasi saldo awal Anda."
- CTA: text-link "Hubungi Loonas" → opens WhatsApp deep-link (same as PkvWhatsAppPanel CTA pattern)

**Component used:** `JournalLineErrorBlock` extended pattern (or new `NormalBalanceHintBlock` component). Uses `role="alert"` for screen reader immediate announcement. Error-tinted palette: `bg-error-50 border-error-100`. ExclamationCircleIcon `text-error-400`.

**Per-line list:** rendered as `<ul>` with `<li>` items inside the block body. Each item shows the account name + code (from `account_id` resolved to display name via existing ledger-account data), the entered side (`entered_side` → "Debit"/"Kredit"), and the corrected side.

## Open questions (need BE confirmation)
1. Does the Laba Rugi GET endpoint return a flag like `is_migration_stub: boolean` to gate Item A? Without it, FE cannot know which tenants to show the notice to.
2. Does the 422 NORMAL_BALANCE_HINT `details.lines` include account `name` and `code` alongside `account_id`, or does FE need to resolve display name from the local ledger-account cache?
3. Is the equity-on-debit path distinguishable from the generic path by account type in `details.lines`, or does FE need to infer from account_id → type lookup?
