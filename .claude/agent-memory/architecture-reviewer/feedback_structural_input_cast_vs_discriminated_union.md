---
name: structural-input-cast-vs-discriminated-union
description: When a util takes a structural subset of an entity to route through its getter, a discriminated input union is NOT the cheaper fix — a widened boolean getter blocks assignability; the entity-typed param is
metadata:
  type: feedback
---

When a pure `_utils` formatter takes a **structural subset** of an entity (e.g.
`{ isCorrection: boolean; correctsMovementId: string | null }`) so it can branch on the
entity's getter rather than re-derive the predicate, the follow-on question is always
"why the `as string` cast instead of a discriminated input union?".

**Do not reflexively demand the discriminated union.** An entity getter is typed
`boolean`, not a literal — so `BalanceMovementEntity` is **not assignable** to
`{ isCorrection: false } | { isCorrection: true; correctsMovementId: string }`. TS cannot
narrow a widened `boolean` getter to a literal member, so the union breaks the very call
site (`classify(movement)`) and forces the caller to branch on the raw field — reintroducing
the second predicate spelling the structural type existed to remove. The union is strictly
heavier, not lighter.

The genuinely lighter option, if the hole matters, is typing the param as the **entity class
itself** (app→domain import is legal): it deletes both the structural type and the cast, and
the entity constructor makes the impossible state unconstructible. Cost is only that tests
build `new XEntity({...})` instead of object literals — a plain constructor, no DI.

**Why:** LNS-756 round 2. The cast was provably safe (`isCorrection` is *defined as*
`correctsMovementId !== null`, a tautology, not a convention), so the only residual risk was
a future caller constructing `{ isCorrection: true, correctsMovementId: null }` against the
structural type. Flagging the union would have been actively wrong.

**How to apply:** before flagging a narrowing cast on a structural entity-subset param,
(1) confirm the getter's body makes the invariant a tautology, and (2) check assignability
of the real entity against the proposed union before recommending it. Rank the alternatives
by whether they *remove* or *add* declarations — per the production-grade bound, a finding
that only adds abstraction is not a finding.

Related: [[feedback_route_through_entity_getter_via_structural_type]],
[[project_lns570_review_learnings]].
