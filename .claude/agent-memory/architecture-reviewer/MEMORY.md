# Architecture Reviewer Memory

- [Co-located sub-component anti-pattern](feedback_colocated_subcomponent_antipattern.md) — Engineers put private JSX-returning helpers inside parent files; flag as one-component-per-file violation
- [Retained file name flag](feedback_retained_name_flag.md) — When sub-components keep old parent-widget name prefix after refactor, flag as minor naming drift for EL consideration
- [Empty params class anti-pattern](feedback_empty_params_class_pattern.md) — Empty `class XxxUseCaseParams {}` is a should-fix; use `UseCase<ReturnValue>` with void default instead
- [Text-link button h-11 exception](feedback_button_h11_exception.md) — `h-11` does not apply to text-link-styled `<button>` elements; only to form-interactive controls
- [Inline style tab indicator](feedback_inline_style_tab_indicator.md) — Sliding tab indicator via `style` prop + imperative DOM mutation is a Rule 13 violation; use CSS custom props via className
- [Feature imports app layer](feedback_feature_imports_app_layer.md) — `features/**/presentations/**` must never import from `@/app/`; promote shared components to `core/` first (found in LNS-375 buku-besar-viewer)
- [CSS-hidden dual-branch singleton semantics](feedback_css_hidden_dual_branch_singleton.md) — CSS `hidden`/`sm:hidden` dual-layout keeps BOTH branches mounted; sweep the whole diff for ANY duplicated singleton element (`autoFocus`, `aria-live`/`role=status`, unique `id`, `aria-labelledby`), not just the first found (LNS-364: caught autofocus, missed footer aria-live)
- [LNS-371 accounting mutation SWR keys + source/repo coupling](project_lns371_review_learnings.md) — Mutation SWR keys are universally hardcoded in accounting hooks (pre-existing); domain/sources/journal imports params from domain/repositories (pre-existing LNS-369); create-page providers don't need guarantee pattern
- [Presentation imports data/models Blocker](feedback_presentation_imports_data_models.md) — app/ and presentations/ must never import from data/models/; only domain/sources/ has that exemption (found LNS-379 provider)
- [Use-case private method must not return DataState](feedback_usecase_private_method_datastate.md) — private methods throw on failure and return plain types; returning DataState from a private method is a Major violation (found LNS-379)
- [Idempotency-Key belongs in use case, not service layer](feedback_idempotency_key_layer.md) — `crypto.randomUUID()` inside ServiceImpl is a Major violation; key must be generated in UseCase.execute() and threaded through params (found LNS-117)
