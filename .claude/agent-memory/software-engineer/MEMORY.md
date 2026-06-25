# Software Engineer Memory

## Feedback

- [Model classes implement AbstractModel](feedback_model_implements_abstract_model.md) — every `data/models/` class needs `implements AbstractModel`, incl. *ResultModel envelopes + nested toValue() value objects (LNS-369 M1+m1)
- [Use-case params are a class](feedback_usecase_params_class.md) — use-case input is always a named params CLASS, never a bare type alias, even when the plan writes `type Input` (LNS-369 m2)
- [SWR conditional fetching via null key](feedback_swr_conditional_enabled.md) — add `enabled?: boolean` to hook params; pass `null` SWR key when disabled
- [Discriminated union narrowing in components](feedback_discriminated_union_narrowing.md) — use sequential boolean flags, not compound checks, to narrow InitialState|LoadedState|ErrorState
- [Verify computed state is consumed](feedback_verify_computed_state_consumed.md) — before completing, confirm every computed validation/error state (rangeError, isDisabled) is actually rendered; escalate plan-forced incompleteness instead of shipping a "known tradeoff" (LNS-374 fix loop)
- [CSS hidden vs conditional render](feedback_css_hidden_vs_conditional_render.md) — CSS `hidden`/`sm:hidden` dual-layout keeps BOTH branches mounted → duplicates singleton-DOM elements (`autoFocus`, `aria-live`, `id`); use viewport-conditional render when a branch has one (LNS-364 row + footer fix loops)
- [No eslint-disable for unconfigured rules](feedback_eslint_disable_missing_rule.md) — react-hooks/exhaustive-deps is NOT in this project's ESLint config; adding a disable comment for it causes a lint error (LNS-344)
- [Ship spec copy verbatim](feedback_spec_copy_verbatim.md) — quoted user-facing strings in the brief are literals; ship as-is, flag a proposed deviation rather than silently substituting (LNS-371 "disimpan" vs "diposting")
- [CoA editor implementation patterns](feedback_coa_editor_patterns.md) — three-state parent sentinel, mutation hook Rule 3, inner component extraction, TextInput has no tooltip/ref (LNS-117)
- [Use-case private methods return plain + throw](feedback_usecase_private_methods_plain_return.md) — private action methods return a plain type and throw on DataFailed; execute() owns the single DataState wrap; REPEAT of LNS-379 (LNS-117 M1)
- [Use case owns business decisions](feedback_use_case_owns_business_decisions.md) — idempotency-key gen / retry identity belongs in execute(), not the service; key-in-service mints a fresh key per call and defeats idempotency (LNS-117 M2)
- [Move means delete the source](feedback_move_means_delete_source.md) — "move/relocate" = delete the old files; verify the old dir is empty + nothing imports the old path (LNS-117)
- [Grid child count walkthrough](feedback_grid_child_count_walkthrough.md) — a conditional bare child of grid-cols-N displaces siblings when shown; count children in both states, wrap conditional+sibling in a column div (LNS-117)

## Project

- [LNS-379 opening balance wizard](project_lns379_opening_balance_wizard.md) — key decisions: 3200 FE-computed residual, tri-state GET hook, idempotency key pattern, balance gate = hasAnyNonZeroInput
