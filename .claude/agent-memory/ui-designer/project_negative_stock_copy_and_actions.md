---
name: project_negative_stock_copy_and_actions
description: Negative-stock page copy + StockAdjustmentBlockedDialog 3-button fix — canonical recovery-path sentence, inline-link-not-third-button pattern, contrast catch on text-primary-300
metadata:
  type: project
---

## Canonical recovery-path sentence (reuse verbatim wherever this rule appears)

`"catat pembelian atau produksi yang belum tercatat untuk memulihkan saldo"` (drop "atau produksi"
for raw-material-only contexts). Prior to this pass the three surfaces that state this same BE rule
(`STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE`) disagreed on vocabulary — page-level had no copy at all,
`stock-adjustment-blocked-dialog.tsx` said "pembelian atau produksi", the 422 error in
`server-error.ts` said "penerimaan barang" (purchase-only framing, wrong for finished goods). Any
future surface touching this rule should reuse this exact phrase, not re-derive its own wording.

**Why:** Nielsen #4 (Consistency and Standards) — same rule, same words, everywhere it appears.

## Pattern: item-type-conditional action → inline link, not a third footer button

When a dialog footer already has [Dismiss] + [Primary universal action], and a THIRD action only
applies to a subset of cases (e.g. `stockItem.isFinishedGoods` gating a "Catat Produksi" path that
doesn't exist for raw materials), do not add it as a third `SecondaryButton` in the footer — that's
exactly the "3 competing buttons" complaint (LNS negative-stock ticket, 2026-08-11). Instead: keep
the footer at a stable 2 buttons always, and fold the conditional path into the body copy as an
inline `Link` (text-primary-400, underline, not a button). The footer's shape/meaning then never
changes based on which row the user came from — see [[project_lns457_failed_postings_retry]] for
the sibling "reuse existing affordance rather than add a new control" instinct.

**How to apply:** whenever a footer would grow past 2 buttons because ONE of the buttons is
conditional/doesn't-always-apply, that's the signal to demote it to inline text, not to accept a
variable-width footer.

## Contrast catch: text-primary-300 fails AA for inline TEXT links; use text-primary-400

`#007BFF` (primary-300) on white ≈ 3.98:1 — fails the 4.5:1 AA floor for normal-weight body-size
text (this is a TEXT contrast check, distinct from the non-text 3:1 checks already logged in
[[design_language]]). The KYC escape-hatch precedent (`text-primary-300 text-sm hover:underline`,
see [[project_kyc_rejected_escape_hatch]]) likely carries this same gap — do not copy that class
combo forward into new AA-invoking contexts without re-checking. Use `text-primary-400` (#005ABB,
"Blue Deep") instead — computed ≈6.61:1, passes AA, and is DESIGN.md's own documented purpose for
that token ("blue text that needs more contrast on white"). Also spec the link `underline` by
default (not `hover:underline`-only) when it sits inline among plain-colored text of similar visual
weight — WCAG 1.4.1 Use-of-Color needs a non-color cue that doesn't depend on hovering.

## Pattern: shared static ServerError message can't be item-type-precise — split fact/action instead

`server-error.ts` error messages are single shared constants with no per-item templating. When a
BE error's recovery path genuinely varies by item/entity type (e.g. finished-goods-only production
path), don't hardcode one path's vocabulary into the shared string (that was the literal bug —
"penerimaan barang" implied purchase-only even for finished goods). Keep the shared message generic
("catat transaksi yang belum tercatat...") and push the item-type precision into the CTA button(s)
rendered alongside it, which DO have access to the entity via component props. Check first whether
the component already receives the full entity (it did here — `StockAdjustmentFormDialogProps`
already had `stockItem: StockItemEntity`, zero new prop-threading needed) before assuming a bigger
plumbing change is required.
