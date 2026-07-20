---
name: project-coa-accounts-page
description: LNS-117 CoA Accounts page — Daftar Akun under Settings › Bagan Akun, form factor decision (modal), seeded-row hide pattern, delete guard copy
metadata:
  type: project
---

LNS-117 ships tenant-facing CoA management at /settings/chart-of-accounts/accounts, with Pemetaan Akun relocated to /settings/chart-of-accounts/mappings (308 redirect). Two independent routes under a new "Bagan Akun" NavigationGroup in the Settings nav.

**Key design decisions made:**

- UI-3 (form factor): Modal (LoonasDialog width="lg") — matches CoaMappings surface exactly, no new patterns needed.
- UI-2 (seeded delete affordance): HIDE Hapus from ActionMenu on seeded rows in tenant-only view (default). When "Tampilkan akun bawaan" toggle reveals seeded rows, show a disabled-style Hapus chip reading "Tidak dapat dihapus" as teaching moment.
- UI-1 (journal-line link): Show linked state ("lihat X entri terkait" as link to /finance/journals?account={id}) when EL confirms the journal filter route exists. Degrade to count-only plain text if route is not navigable.

**State matrix:** empty (tenant-only no accounts) / loading (skeleton) / populated (tenant-only default) / seeded-revealed / error / access-denied.

**Why:** Consistent with existing CoaMappings pattern; hide-not-disable for cleaner default; graceful link degradation avoids dead links.

**How to apply:** When designing subsequent CoA sub-surfaces, reuse this modal pattern and the "Tampilkan akun bawaan" toggle as the seeded-reveal idiom.
