---
name: accounting-bootstrap-plan
description: Locked v1 design plan for accounting bootstrap — Branch B only, B15 resolver-driven tooltips, tax tile copy, v1.1 extension points
metadata:
  type: project
---

Last updated: 2026-05-12. BE confirmed B11–B15.

## Branch decision
Branch A is fully dead. Branch B is sole v1 reality.
- No post-PKP-flip success toast, no 28-account viewer state, no PkvComingSoonTile Branch A variant.
- Regime card: Non-PKP | PKP radio. Selecting PKP opens `PkvWhatsAppPanel` (inline, non-modal).
- No PATCH fires on radio select. Selection is intent-capture only (PM may add no-op PATCH later — zero copy impact).

## PkvWhatsAppPanel copy (verbatim, locked)
> "Untuk mengaktifkan status PKP pada akun Anda, silakan hubungi tim Loonas melalui WhatsApp. Kami akan membantu proses aktivasi dan verifikasi data PKP Anda."
> CTA: "Hubungi via WhatsApp"

## B15 resolver shape
GET /accounting/settings returns:
```
tax_accounts: {
  ppn_input:         { id, code, name } | null,
  ppn_payable:       { id, code, name } | null,
  pph_final_prepaid: { id, code, name } | null,
  pph_final_payable: { id, code, name } | null,
}
```
null = no backing seeded account. Non-PKP tenants get null for ppn_input and ppn_payable.

## Tooltip templates (all resolver-driven)

### ppn_in (PKP-only line, FR-3 gated)
"Mencatat {tax_accounts.ppn_input.name} (akun {tax_accounts.ppn_input.code}) sebagai PPN masukan saat pembelian kena pajak."
Null: Option X — suppress tooltip (line hidden for non-PKP tenants anyway).

### ppn_out (PKP-only line, FR-3 gated)
"Mencatat {tax_accounts.ppn_payable.name} (akun {tax_accounts.ppn_payable.code}) sebagai PPN keluaran saat penjualan kena pajak."
Null: Option X — suppress tooltip.

### dpp (v1.1, no account reference needed)
"Dasar Pengenaan Pajak yang digunakan untuk menghitung PPN. Dicatat terpisah dari nilai penuh transaksi."
Static copy, no resolver.

### gross (amount_role = gross lines)
"Nilai bruto transaksi sebelum potongan pajak. Digunakan sebagai dasar perhitungan DPP dan pajak terkait."
Static copy, no resolver.

## /finance/tax PPh Final balance card captions
PPh Final Dibayar Dimuka: "Saldo dari {tax_accounts.pph_final_prepaid.name} (akun {tax_accounts.pph_final_prepaid.code})"
PPh Final Terutang: "Saldo dari {tax_accounts.pph_final_payable.name} (akun {tax_accounts.pph_final_payable.code})"
Null: render "Akun belum dikonfigurasi" in neutral-400; balance shows —.

## PPN Segera Hadir tile (Branch B, non-PKP tenants)
Title: "PPN"
Description: "Fitur PPN tersedia untuk usaha yang terdaftar sebagai PKP. Hubungi Loonas untuk aktivasi."
Badge: "Segera Hadir" (standard inactive SettingsCategoryCard style)

## ManagedByLoonasBadge (account 1230)
Decision: resolver-driven via system_accounts.platform_escrow, NOT hardcoded.
Rationale: 1230 is platform escrow — wrong semantic fit for tax_accounts. Separate map avoids coupling.
Badge copy: "Dikelola oleh Loonas — {system_accounts.platform_escrow.name} (akun {system_accounts.platform_escrow.code})"
Null: suppress badge entirely.
BE-relay required: system_accounts must be added to GET /accounting/settings.

## v1.1 forward-design calls
- Regime card: NO hidden placeholders for pkp_effective_date or nppkp_number in v1. v1.1 appends rows below the radio — no structural redesign.
- CoA line rows: NO pre-slots for dpp/ppn_in/ppn_out in v1. Line row component must accept amount_role as a prop (not hardcoded) so v1.1 values append naturally.

## Confirmed renumbering (conditional on BE tenant-posting inventory)
1410 PPN Masukan, 1420 PPh Final Dibayar Dimuka, 2210 Utang Pajak PPN, 2220 PPh Final Terutang.
Tooltips render resolver's live value — safe regardless of migration timing.

## BE-relay items (unresolved, need BE answer)
1. Does GET /accounting/settings plan to expose system_accounts.platform_escrow for the 1230 badge?
2. Does PATCH /accounting/settings return the same tax_accounts shape as GET (avoid extra GET round-trip)?
3. Is renumbering applied before v1 ships, or is there a transitional window with old codes?

## Lock status
Unconditionally locked: Branch B UX, PkvWhatsAppPanel copy, FR-3 toggle, tooltip templates + null behavior, tax dashboard captions, PPN tile copy, no v1.1 placeholders.
Resolver-dependent: all copy naming account codes/names, ManagedByLoonasBadge.
Pending PM: whether no-op PATCH fires on PKP radio select.
