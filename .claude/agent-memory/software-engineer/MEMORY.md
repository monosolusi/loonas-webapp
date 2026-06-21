# Software Engineer Memory

## Feedback

- [Model classes implement AbstractModel](feedback_model_implements_abstract_model.md) — every `data/models/` class needs `implements AbstractModel`, incl. *ResultModel envelopes + nested toValue() value objects (LNS-369 M1+m1)
- [Use-case params are a class](feedback_usecase_params_class.md) — use-case input is always a named params CLASS, never a bare type alias, even when the plan writes `type Input` (LNS-369 m2)
- [SWR conditional fetching via null key](feedback_swr_conditional_enabled.md) — add `enabled?: boolean` to hook params; pass `null` SWR key when disabled
- [Discriminated union narrowing in components](feedback_discriminated_union_narrowing.md) — use sequential boolean flags, not compound checks, to narrow InitialState|LoadedState|ErrorState
- [Verify computed state is consumed](feedback_verify_computed_state_consumed.md) — before completing, confirm every computed validation/error state (rangeError, isDisabled) is actually rendered; escalate plan-forced incompleteness instead of shipping a "known tradeoff" (LNS-374 fix loop)
- [CSS hidden vs conditional render](feedback_css_hidden_vs_conditional_render.md) — CSS `hidden`/`sm:hidden` dual-layout keeps BOTH branches mounted → duplicates singleton-DOM elements (`autoFocus`, `aria-live`, `id`); use viewport-conditional render when a branch has one (LNS-364 row + footer fix loops)
- [No eslint-disable for unconfigured rules](feedback_eslint_disable_missing_rule.md) — react-hooks/exhaustive-deps is NOT in this project's ESLint config; adding a disable comment for it causes a lint error (LNS-344)
