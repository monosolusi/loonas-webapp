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
- [Render both mutually-exclusive dialogs](feedback_headless_ui_dialog_closed_is_inert.md) — the wrapping Transition unmounts a closed Dialog only AFTER its leave animation (unmount defaults true); an early return skips the fade
- [Route map dynamic segment](feedback_route_map_dynamic_segment.md) — dynamic route header titles use if-block in useMemo, NOT bracket key in ROUTE_MAP (usePathname returns real UUIDs)
- [Table row nested interactive](feedback_table_row_nested_interactive.md) — expand + ActionMenu: outer div grid, button col-span for expand, ActionMenu sibling in last col — never nest ActionMenu inside button
- [Provider Rule 7 exception](feedback_provider_rule7_exception.md) — page-level orchestrator provider may import _components/ directly; Rule 7 bars feature-level providers, not co-located page providers
- [EL plan overrides earlier UI spec](feedback_el_plan_overrides_ui_spec.md) — when the EL plan and an earlier UID/UI spec conflict, the EL plan is the later authoritative decision; never silently ship the superseded UI-spec detail (LNS-347 "Margin Tipis" reintroduced)
- [No FE calc for BE-owned money](feedback_no_fe_calc_for_be_owned_money.md) — when BE owns the calc (HPP/profit/COGS/recommended price), render BE values as-is; never FE-multiply money — only a non-monetary % ratio is an allowed FE derivation (LNS-347 "HPP × Unit Terjual" row)
- [Feature commit staging](feedback_feature_commit_staging.md) — stage only src/** explicitly, never `git add -A`; `.claude/agent-memory/` is excluded from feature commits (separate post-reflection chore) (LNS-347 reset+rebase)
- [Mobile-adapt dense form grids](feedback_mobile_adapt_dense_form_grids.md) — form-input matrices (variant/pricing, purchase items) get raw overflow-x-auto+min-w, NOT TableContainer scrollable; that's for read-only data tables only
- [Mobile ActionMenu rows + SectionCard header gap](feedback_mobile_actionmenu_rows_and_sectioncard_header.md) — action-only MobileListCard rows (no href, chevron=false, ActionMenu in trailing slot); SectionCard headerAction overflows on mobile when wide (core gap, cap+scroll locally)
- [Mobile fixed-px children](feedback_mobile_fixed_px_children.md) — components taking a pixel-number prop (e.g. QrisCard's `size` → QRCodeSVG) don't shrink with a fluid wrapper; dual-render two sizes by breakpoint instead of computing one shrunk value (POS QRIS mobile-adapt)
- [Mobile-adapt finance periodic scope](feedback_mobile_adapt_finance_periodic_scope.md) — toolbar flex-wrap > col/row toggle; TabFilter needs explicit width under items-start parents; 3+ control rows exceed MobileListCard's 2 slots; UUID reference rows need wrap+truncate
- [`field: value || undefined` key is always present](feedback_undefined_key_still_present_in_params_obj.md) — `"key" in obj` is always true for this pattern; assert `.field === undefined` + JSON.stringify, not "in" (LNS-570)
- [Partial-update clear needs explicit null](feedback_partial_update_clear_needs_explicit_null.md) — on a PUT with omitted=unchanged/null=clear semantics, `|| undefined` silently defeats clearing; use `|| null` + build body explicitly, never passthrough (LNS-573)
- [Dialog outlives its item](feedback_dialog_outlives_its_item.md) — entity prop goes null before the 200ms leave fade finishes; latch it with `useLatchedValue` in the dialog, never widen the helper's signature to absorb the null
- [Second instance means extract](feedback_second_instance_means_extract.md) — a divergence you spotted argues for extracting the shared row, not a careful copy; grep a rule's literal strings/routes before claiming single ownership
- [Helper owns which, not how](feedback_helper_owns_which_not_how.md) — never encode a rendering hierarchy ("last one is primary") in a shared helper; export the predicate beside the list so a surface can present it differently
- [Repo is not prettier-clean](feedback_repo_is_not_prettier_clean.md) — prettier isn't in CI or hooks and HEAD already fails `--check` widely; new files clean, untouched lines left alone; quote app-router paths, don't glob

## Project

- [LNS-379 opening balance wizard](project_lns379_opening_balance_wizard.md) — key decisions: 3200 FE-computed residual, tri-state GET hook, idempotency key pattern, balance gate = hasAnyNonZeroInput
- [LNS-372 journal detail + reverse action](project_lns372_journal_detail_reverse.md) — shipped 2026-06-25, PR #98; warn→ack single-dialog pattern, page-level provider Rule 7 exception, dynamic ROUTE_MAP if-block
- [LNS-378 year-end close + retained earnings](project_lns378_year_end_close.md) — R1–R6 risks mitigated; 3200 preselect, verbatim token, two journal-id keys, null not "", provider-extended not new
- [LNS-457 failed-postings retry + escalation hint](project_lns457_failed_postings_retry.md) — shared 422-curation helper, double-nested details read, in-memory consecutive-failure counter
