---
name: provisional-shape-dependent-layout
description: When layout structure depends on an unconfirmed response schema, mark it PROVISIONAL and minimize speculative field detail
metadata:
  type: feedback
---

When a spec section's STRUCTURE — number of sections, row hierarchy, or whether a sub-component exists at all — derives from a backend response schema you cannot read, mark that portion of the spec **PROVISIONAL / shape-dependent** and keep field-level detail minimal. Do not fully spec fields or sub-components for an unconfirmed schema.

This is **additive to, not a replacement for**, flagging the BE shape as an open question. The open question asks; the PROVISIONAL marker signals to EL/SWE that they must confirm the contract before building that portion, so they don't over-index on a design that gets walked back.

**Why:** On LNS-374 the spec drew Laba Rugi as a 2-section (Pendapatan/Beban) table, fully spec'd a non-cash disclosure note with concrete fields {id, description, amount}, and assumed a second compare fetch. The real contract was a fixed multi-bucket single-step ledger, an empty `{}` non-cash item schema (v1 always `[]`), and compare nested in one POST — so EL had to reconcile/walk back several sections.

**How to apply:** Before committing structural detail (section counts, row hierarchies, sub-component schemas), check whether it depends on an unconfirmed contract. If so, mark it PROVISIONAL and hold field-level detail until the shape is confirmed.
