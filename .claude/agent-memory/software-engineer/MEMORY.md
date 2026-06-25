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
- [Use-case private methods return plain + throw](feedback_usecase_private_methods_plain_return.md) — private action methods return plain type + throw; execute() owns sole DataSuccess wrap; NEVER call new DataSuccess inside a private (LNS-379/117/381 M1, 3x repeat)
- [Inline validation hints are required](feedback_inline_validation_hints_required.md) — every "Error —" string in a brief/UID table needs a `<span>` render site in the form; disabled-button is additive not a substitute (LNS-381 QA)
- [Use case owns business decisions](feedback_use_case_owns_business_decisions.md) — idempotency-key gen / retry identity belongs in execute(), not the service; key-in-service mints a fresh key per call and defeats idempotency (LNS-117 M2)
- [Move means delete the source](feedback_move_means_delete_source.md) — "move/relocate" = delete the old files; verify the old dir is empty + nothing imports the old path (LNS-117)
- [Grid child count walkthrough](feedback_grid_child_count_walkthrough.md) — a conditional bare child of grid-cols-N displaces siblings when shown; count children in both states, wrap conditional+sibling in a column div (LNS-117)
- [Single dialog warn→ack](feedback_single_dialog_warn_ack.md) — warn→ack flow = inline body-mode switch in ONE LoonasDialog; second sibling dialog = second focus trap (LNS-372)
- [Route map dynamic segment](feedback_route_map_dynamic_segment.md) — dynamic route header titles use if-block in useMemo, NOT bracket key in ROUTE_MAP (usePathname returns real UUIDs)
- [Table row nested interactive](feedback_table_row_nested_interactive.md) — expand + ActionMenu: outer div grid, button col-span for expand, ActionMenu sibling in last col — never nest ActionMenu inside button
- [Provider Rule 7 exception](feedback_provider_rule7_exception.md) — page-level orchestrator provider may import _components/ directly; Rule 7 bars feature-level providers, not co-located page providers

## Project

- [LNS-379 opening balance wizard](project_lns379_opening_balance_wizard.md) — key decisions: 3200 FE-computed residual, tri-state GET hook, idempotency key pattern, balance gate = hasAnyNonZeroInput
- [LNS-372 journal detail + reverse action](project_lns372_journal_detail_reverse.md) — shipped 2026-06-25, PR #98; warn→ack single-dialog pattern, page-level provider Rule 7 exception, dynamic ROUTE_MAP if-block
- [LNS-378 year-end close + retained earnings](project_lns378_year_end_close.md) — R1–R6 risks mitigated; 3200 preselect, verbatim token, two journal-id keys, null not "", provider-extended not new
