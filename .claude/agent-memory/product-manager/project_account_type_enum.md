---
name: project-account-type-enum
description: AccountType is a 10-member FE enum (incl. cogs, no non-contra sibling) — NOT "5 base + contra variants"; verify from source before any type-branching AC
metadata:
  type: project
---

The FE-local `AccountType` enum (`src/features/accounting/domain/enums/account-type.ts`) has **10 members**, with Bahasa labels in `ACCOUNT_TYPE_LABELS`:

`asset` (Aset), `contra_asset` (Kontra Aset), `liability` (Liabilitas), `equity` (Ekuitas), `contra_equity` (Kontra Ekuitas), `revenue` (Pendapatan), `contra_revenue` (Kontra Pendapatan), `cogs` (Harga Pokok Penjualan), `expense` (Beban), `contra_expense` (Kontra Beban).

**Why:** Both the LNS-117 ticket body AND the BE `CoaAccount` contract notes describe `type` as "asset|liability|equity|revenue|expense + contra variants" — which reads as 5-base-plus-some-contra. The real source set is 10 and notably includes `cogs` (HPP), which has NO non-contra base-pattern sibling. An AC or FE branch built on the imprecise "5 + contra" framing (e.g. a type-select offering only 5, or a "if not asset/liability/equity/revenue/expense then …" branch) would be wrong. This is the exact exhaustiveness trap the methodology guards against (cf. LNS-387 VerificationOutcome 2-vs-3).

**How to apply:** Any accounting PRD whose AC or FE branch ranges over account type (create-account type picker, neraca/laba-rugi section bucketing, type-driven sign conventions) must enumerate these 10 verbatim from the enum file — never from the ticket prose or BE contract summary. Confirm the BE POST/PUT contract accepts the same 10-value set when the surface writes `type`. Related: [[project-coa-mapping-shape]] (the mapping `amount_role` uses a value `cogs` too — distinct concept, same vocab).
