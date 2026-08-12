---
name: list-impl-single-consumer-not-deprecated
description: A new list page using *-impl.tsx with a single child consumer is NOT a violation of the deprecated *-impl monolith rule — do not flag it; forcing a _providers/ wrapper there breaks provider data locality
metadata:
  type: feedback
---

Do not flag a **new** `*-list-impl.tsx` page as a deprecated-pattern violation when it holds only local list state (page / search / filter / selected-item) with one hook and one child component consuming props.

**Why:** CLAUDE.md's Deprecated table lists "`*-impl.tsx` monolith pattern (new code) → Provider + split components", and it is tempting to read that as banning `*-impl.tsx` outright in any new route. It doesn't — it targets *monoliths* that hold business logic with many sibling consumers. The companion rule, **provider data locality**, says a provider should only host data shared across multiple components. A `_providers/` wrapper for state consumed by exactly one component violates that rule to satisfy a rule that wasn't broken. The two rules bound each other; quoting one without the other manufactures a finding. (Ruled 2026-08-11 on `inventory/stock-adjustment/_components/stock-adjustment-list-impl.tsx` — 4 `useState` + 1 SWR hook + a props-driven row.)

**How to apply:** flag `*-impl.tsx` only when the impl actually holds business logic (mutations, submit/dirty tracking, error mapping) **or** when two or more sibling `_components/` need the same state — that is when the provider earns its keep. For a plain list page, the shared abstraction is already the list-page standard (`ListPageHeader` + `TableToolbar` + `TableSearch` + `TableContainer`/`TableHeader`/`TablePagination`); re-wiring those primitives per page is the intended cost, not duplication to eliminate. Say so explicitly in the report as a considered-and-cleared item so the EL knows it was ruled on rather than missed. Related: [[dead-substate-components]], [[provider-empty-state-gap]].
