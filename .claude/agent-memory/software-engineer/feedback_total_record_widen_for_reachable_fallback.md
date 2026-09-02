---
name: feedback_total_record_widen_for_reachable_fallback
description: When indexing a TOTAL Record<EnumType,string> with the entity's own narrow type, the `?? fallback` branch is dead code — widen the lookup type to string first.
type: feedback
---

A domain enum label map typed `Record<SourceRefTypeType, string>` (or similarly a `Record<KnownUnion, string>`)
is a TOTAL function over its own type — indexing it with a value already narrowed to that type can never miss,
so `SourceRefTypeLabel[t] ?? t` is unreachable/untestable, and `tsc`/lint may even flag the `??` as unnecessary.

**How to apply:** when a brief/plan calls for "an unrecognised enum member should fall back to the raw string"
(future-proofing against a BE-added member the FE hasn't shipped a label for), the consuming util function must
accept the WIDENED type (`string`, not the narrow union) and index through a `Record<string, string>` alias of
the same total map:

```ts
export function resolveXLabel(x: string): string {
  const labels: Record<string, string> = XLabel; // widen: only place the fallback becomes reachable
  return labels[x] ?? x;
}
```

This makes the fallback branch genuinely exercisable by a unit test passing a value outside the known union
(`resolveXLabel("unknown.enum.member")` → the raw string, not `undefined`). Confirmed working pattern on
LNS-756 (`_utils/movement-row-display.ts::resolveSourceRefTypeLabel`), where the EL plan explicitly flagged
this as a "known trap" and acceptance criterion — the enum file itself (`source-ref-type.ts`) documents that
its own total map deliberately has NO fallback baked in, naming the consuming util as its single owner.

Same family as [[feedback_derived_invariant_getters]] (CLAUDE.md) — the failure mode is a naive re-derivation
that looks correct but is either dead code or drifts from the source of truth.
