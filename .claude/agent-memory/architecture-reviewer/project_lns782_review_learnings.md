---
name: project_lns782_review_learnings
description: LNS-782 cash-entry category SearchCombobox migration — clean diff; fold-back invariant is total only because the create dialog inherits the provider's current direction
metadata:
  type: project
---

LNS-782 (`refactor/cash-entry-category-search-combobox`, off `origin/release/kas-masuk-kas-keluar`)
swapped `/accounting/cash-entries/new`'s `SelectInput` category picker for `SearchCombobox`, and
extracted option-building to `new/_utils/build-cash-category-options.ts` + colocated test. Verdict
was CLEAN — zero architecture/convention violations, three dismissible Minors (inert `required`,
`emptyMessage` copy, one untested branch combination).

Three things worth carrying forward:

- **The "fold-back" invariant (optimistically-selected-before-refetch) is only total because of a
  fact stored three files away**: `CashCategoryCreateDialog` always creates in the provider's
  *currently selected* `direction`, so `created.direction === direction` always holds, so the
  picker's `category.direction === direction` guard never nulls a live selection. Combined with
  `changeDirection`'s own `setCategory(prev => prev.direction !== next ? null : prev)` reset, the
  "combobox holds a value absent from its options" failure is unreachable. When reviewing an
  optimistic-select-then-fold-back picker, verify the *creator's* direction/scope source, not just
  the fold-back function.

- **Reference identity through a rebuilt option array is a false alarm here.** `options` is a
  `useMemo` that mints brand-new option objects on every `category` change, and `selectedOption` is
  `options.find(...)`. That is safe: Headless UI's `Combobox` (no `by` prop) compares by reference,
  and both the `value` and every `ComboboxOption value` derive from the *same* memoized array in the
  same render. Don't flag rebuilt-options-plus-find as a stale-reference risk without checking
  whether both sides come from one array.

- **`{cond ? <A/> : (list.length === 0 && <B/>)}` is correct**, unlike the classic
  `{list.length && <B/>}` that renders a stray `0` — the `=== 0` yields a boolean. Check the operand
  type before flagging the `&&`-in-JSX shape.

Where I put the `SearchCombobox` component-contract facts: [[feedback_search_combobox_prop_gaps]].
