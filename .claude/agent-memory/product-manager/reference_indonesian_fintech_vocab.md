---
name: reference-indonesian-fintech-vocab
description: Indonesian terms used in Loonas accounting UI — short glossary for PRD copy-intent decisions
metadata:
  type: reference
---

Standard vocab used in Loonas accounting copy:

- **Buku Besar** — ledger (general ledger by account)
- **Jurnal Umum** — general journal (list of all journal entries)
- **Bagan Akun** — Chart of Accounts (CoA)
- **Pemetaan Akun** — CoA mapping (how business events map to debit/credit accounts)
- **Pengaturan Akuntansi** — Accounting Settings
- **Biaya Tetap** — Fixed costs (existing feature, not part of Plan B+)
- **Beban Operasional** — Operational expense
- **NPWP** — Nomor Pokok Wajib Pajak (tax ID, 15–16 digits)
- **NPPKP** — Nomor Pengukuhan Pengusaha Kena Pajak (VAT-registered taxpayer ID, max 50 chars)
- **PKP** — Pengusaha Kena Pajak (VAT-registered entity)
- **PPh Final UMKM** — small-business final income tax (0.5%, PP-55/2022)
- **Sektor KLBI** — Klasifikasi Lapangan Usaha Indonesia (business sector code, max 10 alphanumeric)
- **Bentuk Usaha** — legal form (Perseorangan/sole_proprietor, CV, Firma, PT, Koperasi)
- **HPP** — Harga Pokok Penjualan (COGS)
- **Prive** — owner's drawing (equity account 3120)
- **Piutang Penyelesaian Loonas** — escrow receivable specific to Loonas platform (account 1230)

**Why:** Loonas tenants are Indonesian; English accounting jargon should not appear in UI copy. "Manual journal" is the worst term — non-accountants will not understand it. Prefer "Bayar Pajak Final" / "Catat Biaya".

**How to apply:** Use these terms in copy intent for any accounting-facing surface. Reserve English terms for developer docs / internal panels only.
