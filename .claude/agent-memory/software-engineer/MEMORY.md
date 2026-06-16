# Software Engineer Memory

## Feedback

- [Model classes implement AbstractModel](feedback_model_implements_abstract_model.md) — every `data/models/` class needs `implements AbstractModel`, incl. *ResultModel envelopes + nested toValue() value objects (LNS-369 M1+m1)
- [Use-case params are a class](feedback_usecase_params_class.md) — use-case input is always a named params CLASS, never a bare type alias, even when the plan writes `type Input` (LNS-369 m2)
- [SWR conditional fetching via null key](feedback_swr_conditional_enabled.md) — add `enabled?: boolean` to hook params; pass `null` SWR key when disabled
- [Discriminated union narrowing in components](feedback_discriminated_union_narrowing.md) — use sequential boolean flags, not compound checks, to narrow InitialState|LoadedState|ErrorState
