---
name: inline-link-base-color-convention
description: Inline text links — the in-repo text-primary-300 base fails AA at 3.98:1; new links use text-primary-400
metadata:
  type: feedback
---

The prevailing in-repo inline text-link class is `text-primary-300 underline hover:text-primary-400`
(~6 call sites: `gross-profit-block-no-pos.tsx`, `data-kurang-card.tsx`,
`coa-account-delete-mapping-body.tsx`, `coa-account-delete-journal-lines-body.tsx`,
`production-create-form-card.tsx`, `opening-balance-readonly.tsx`). **That convention fails WCAG AA
for body-size text and must not be propagated to new links.** `primary-300` (`#007BFF`) on white
computes to **3.98:1**, under the 4.5:1 floor PRODUCT.md sets for body text. `primary-400`
(`#005ABB`) computes to **6.61:1** and is DESIGN.md's documented token for "blue text that needs
more contrast on white".

**Why:** raised as a Minor "brand-consistency drift" finding on the negative-stock review
(2026-08-11) against a new link that correctly used `text-primary-400` as its base — the finding was
**rejected by the orchestrator**, who recomputed both ratios. Frequency across call sites is not
evidence of correctness: six sites sharing a defect is six defects, not a convention. This is the
same shape as the already-recorded
[[feedback_warning_callout_token_convention]] catch (`text-warning-400` body text at ~3.4:1) — a
palette token that reads fine to the eye but misses the numeric bar.

**How to apply:** do NOT flag `text-primary-400` as a base state on an inline text link — that is
the correct, AA-passing choice, and there is still `hover:text-primary-500` (`#001933`) available
below it. Only flag a *new* link that uses `text-primary-300` as its base, and flag it as an
accessibility finding, not a consistency one. Before citing any "established convention" from a
color grep, compute the contrast ratio first; if the convention fails, the finding is that the
existing sites need fixing. The pre-existing `primary-300` links are known a11y debt awaiting their
own ticket — do not fold them into an unrelated PR.
