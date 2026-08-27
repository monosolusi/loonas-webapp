---
name: lns741-review-learnings
description: LNS-741 cash-entry detail + cancel-by-reversal review — clean diff, confirms idempotency-status-vs-httpCode rule holds under real review pressure, one recurring duplicated-unwrap Minor.
metadata:
  type: project
---

Reviewed `feat/cash-entry-detail-cancel` (uncommitted, base `release/kas-masuk-kas-keluar`) against the
approved plan at `~/.claude/plans/ticket-lns-741-base-branch-mutable-axolotl.md`. Verdict: CLEAN.
typecheck/lint/test all green, 31/31 new tests pass.

Notable positives worth remembering as precedent for future reviews of this feature:
- `cash-entry-detail-provider.tsx` correctly reads `err.details?.["status"]` for the idempotency-rotation
  decision, never `err.httpCode` — the plan called this out explicitly as "the single most important
  thing not to copy from the template" (the sibling `journal-detail-provider.tsx` rotates on every
  terminal error via `err.httpCode === 422`, which is the wrong template here). Confirms the CLAUDE.md
  `details.status` vs `httpCode` rule is being followed under real implementation, not just stated.
- `resolve-cash-entry-cross-reference.ts` deliberately fixes a latent gap in its own template
  (`journal-reversal-status-card.tsx` ANDs the reversal flag with the target id, so a flagged entity with
  a missing id renders nothing) — selects the branch on status alone, tested explicitly
  (`resolve-cash-entry-cross-reference.test.ts`: "every status other than Active produces a visible chip
  regardless of id presence"). Good instance of a PR fixing a known template defect in the new code
  rather than propagating it.
- Both new inline links use `text-primary-400 underline`, correctly deviating from the
  `journal-reversal-status-card.tsx` / `journal-detail-error.tsx` templates' `text-primary-300
  hover:underline` (documented a11y debt) rather than copying it forward.
- `idempotency-rotation.ts` move from `features/invoice/presentations/helpers/` to `core/helpers/` was
  mechanically clean — grepped for zero stray old-path imports, both real importers
  (`pos-provider.tsx`, `stock-adjustment-dialog.tsx`) rewired even though the plan doc only named one.

One Minor, logged generally at [[feedback_centralize_predicate_with_message_helper]]: the provider's
catch block re-derives the `UNKNOWN`-registry-fallback code unwrap inline (for the
refetch-on-`CASH_ENTRY_ALREADY_CANCELLED` branch) duplicating the identical unwrap already inside
`classify-cancel-error.ts`.
