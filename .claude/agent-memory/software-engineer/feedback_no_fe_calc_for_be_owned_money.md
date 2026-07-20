---
name: no-fe-calc-for-be-owned-money
description: When the BE contract owns a calculation (HPP, gross profit, COGS, recommended price), render the BE values as-is — never re-derive or multiply money on the FE; the only allowed FE derivation is a non-monetary ratio for display
metadata:
  type: feedback
---

**Rule:** When the feature's contract states the BE owns the calculation (e.g. HPP / gross profit / COGS / recommended price), render only the money values the BE returns. Do NOT compute a displayed currency amount on the FE — even when the multiplicand and multiplier are both present in the response. The one permitted FE derivation on money-adjacent data is a **dimensionless ratio for display** (e.g. a margin %), never a rupiah figure.

**Why:** LNS-347 — I added an "HPP × Unit Terjual" row rendering `IDRFormatter.toCurrency(inputs.hppPerUnit * inputs.unitsSold)`, an FE-multiplied money value, despite "no client-side money calculation" being a repeated NFR. EL ruled it out (dropped the row). FE-multiplied money silently diverges if the BE formula changes (adjustments, returns), eroding the trust the BE-owns-the-math design exists to protect.

**How to apply:** Before reporting done, scan every `IDRFormatter.toCurrency(...)` (and any money render) for arithmetic inside the parens — if you find `a * b` / `a - b` on money, delete it and either render a raw BE field or request the BE expose the figure. NUANCE: this bars FE money math where the BE owns the figure; it does NOT bar a user-entered computed input where the FE legitimately owns the value (e.g. the opening-balance residual in [[project_lns379_opening_balance_wizard]]). Related: [[verify-computed-state-consumed]].
