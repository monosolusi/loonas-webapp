---
name: project-lns738-review-learnings
description: LNS-738 cash-category/settings substrate review — refresh-arrow false positive to stop flagging; doc comments naming endpoint→error-code mappings must be checked per-endpoint against the live spec
metadata:
  type: project
---

LNS-738 (cash categories CRUD + cash-entry-settings get/update, FE substrate, no UI): reviewed CLEAN with one Minor — a doc comment that misstates which endpoint returns which error code.

**False positive to stop flagging — `refresh: () => mutate()` in a hook's ErrorState.** `use-list-cash-category.ts` (and its sibling `use-list-cash-entries.ts`) bind the error-state `refresh` as an expression-bodied arrow while the loaded state binds `mutate` directly. The CLAUDE.md refresh rule targets *typing* refresh as `() => void`; here the declared type is `KeyedMutator<T>`, the arrow hands back the promise, and a block-body edit would fail `tsc` — so the guarantee the rule exists for holds. Do not flag it as a defect; at most note the intra-hook inconsistency.

**Why:** I spent review time on it and the type contract already prevents the failure mode.

**How to apply:** In SWR read hooks, check the *declared type* of `refresh` (must be `KeyedMutator<T>`), not the arrow-vs-direct binding shape.

---

**Doc comments that name endpoint→error-code mappings are claims, not facts.** `domain/helpers/cash-category-eligibility.ts` documented the server gate as 422 `CASH_CATEGORY_DIRECTION_MISMATCH` "(category create/update)" + 422 `CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH` (settings update). The live spec disagrees per-endpoint: DIRECTION_MISMATCH is declared on category **create only** (PATCH cannot mismatch — `direction` is not updatable); category PATCH/DELETE reject a referenced category with **409 CASH_CATEGORY_REFERENCED**, and the settings PATCH declares REFERENCED too. A follow-up UI ticket wiring error copy off that comment would handle a 422 that never arrives and miss the 409 that does.

**How to apply:** When a diff's comment maps error codes to endpoints, list each endpoint's declared codes from `dev-api.loonas.id/openapi.json` and diff them against the comment (same pass as the schema check, one python pass over `paths`). `python3` over `/tmp/openapi.json` with a per-operation `codes = [c for c in CODES if c in json.dumps(op)]` loop takes seconds.

**Related shortcut for the LNS-738 follow-up UI ticket:** `CASH_CATEGORY_REFERENCED` blocks category **update and delete** once any entry references it, so a successful rename implies no cash entry carries that category — mutation hooks need no cascade invalidation of `LIST_CASH_ENTRIES` / `GET_CASH_ENTRY` for the embedded `CashEntryCategory` snapshot.

[[project_lns371_review_learnings]]
