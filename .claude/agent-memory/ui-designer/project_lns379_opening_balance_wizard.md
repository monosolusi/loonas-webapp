---
name: lns379-opening-balance-wizard
description: LNS-379 Opening Balance Wizard — full design spec, entry point, per-step layout, state map, U1–U4 resolutions
metadata:
  type: project
---

Opening Balance Wizard for migrating UMKM. Route `/finance/opening-balance`.

Key design decisions:
- U1: Full abstraction (plain-category card layer, never show debit/credit grid to owner). Grid is hidden engine.
- U2: Three groups — Apa yang Anda miliki (Aset), Apa yang Anda utangi (Liabilitas), Modal usaha Anda (Ekuitas).
- U3: LabaRugiMigrationNotice goes on Step 2 (date selection) contextually, not review step.
- U4: Plain balance feedback copy: "Angka belum pas — cek kembali isian Anda" (unbalanced), "Semua angka sudah pas" (balanced).

Entry point: WizardSetupCard (hero card, above journal list or on /finance/opening-balance route) for un-migrated tenants. Not buried in nav.

**Why:** WCAG 2.1 AA; non-accountant UMKM owners must complete one-time irreversible setup with zero jargon.
**How to apply:** Always route BE/API open questions to EL. The `JournalLineEditor` is never exposed to the user — the wizard maps plain category amounts → balanced lines invisibly.
