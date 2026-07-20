---
name: idr-formatter-centralized-parse-seam
description: IDRFormatter (core/utilities/currency) is the canonical IDR-integer parse/format pair — reuse for editable money inputs, do not write a new parser
metadata:
  type: project
---

`src/core/utilities/currency/domain/formatters/idr-formatter.ts` already provides the centralized, drift-free IDR-integer parse/format pair:

- `IDRFormatter.toNumber(value: string): number` — strips `[^0-9]`, `parseInt`, returns 0 on empty. Round-trip verified: `"1.500.000"`→`1500000`, `"Rp 1.500.000"`→`1500000`, `""`→`0`, `"-5"`→`5` (strips minus → non-negative), `"12.50"`→`1250` (strips dot → integer, no float drift), `"abc"`→`0`.
- `IDRFormatter.toThousand(value: number): string` — `toLocaleString("id-ID",{style:"decimal"})`; `1500000`→`"1.500.000"`. Exact inverse of `toNumber`.
- `IDRFormatter.toCurrency(...)` — adds "Rp" prefix via Intl currency formatter (used by entity `displayBalance`).

`NumberDisplay` (`core/presentations/components/number-display.tsx`) is DISPLAY-ONLY (`toLocaleString("id-ID")`) — covers read-only totals, NOT editable input.

**Why:** LNS-364 Q-EL5 — the journal-line editor needed editable IDR-integer money inputs; the NFR demanded a single centralized parser to avoid float drift. `IDRFormatter.toNumber`/`toThousand` already are that seam.

**How to apply:** For any new editable rupiah-integer input, route string⇄int through `IDRFormatter.toNumber`/`toThousand` — do not hand-roll a regex parser. Pair with the React-19 controlled-input caveat: keep the canonical integer in parent state, format the displayed string cursor-stably (format-on-blur or reconcile only when the parsed integer changes) — never set `value={toThousand(toNumber(raw))}` on every keystroke (cursor-jump / revert anti-pattern per React docs).
