# Architecture Reviewer Memory

- [Co-located sub-component anti-pattern](feedback_colocated_subcomponent_antipattern.md) — Engineers put private JSX-returning helpers inside parent files; flag as one-component-per-file violation
- [Retained file name flag](feedback_retained_name_flag.md) — When sub-components keep old parent-widget name prefix after refactor, flag as minor naming drift for EL consideration
- [Empty params class anti-pattern](feedback_empty_params_class_pattern.md) — Empty `class XxxUseCaseParams {}` is a should-fix; use `UseCase<ReturnValue>` with void default instead
- [Text-link button h-11 exception](feedback_button_h11_exception.md) — `h-11` does not apply to text-link-styled `<button>` elements; only to form-interactive controls
- [Inline style tab indicator](feedback_inline_style_tab_indicator.md) — Sliding tab indicator via `style` prop + imperative DOM mutation is a Rule 13 violation; use CSS custom props via className
- [Feature imports app layer](feedback_feature_imports_app_layer.md) — `features/**/presentations/**` must never import from `@/app/`; promote shared components to `core/` first (found in LNS-375 buku-besar-viewer)
- [CSS-hidden dual-branch singleton semantics](feedback_css_hidden_dual_branch_singleton.md) — CSS `hidden`/`sm:hidden` dual-layout keeps BOTH branches mounted; sweep the whole diff for ANY duplicated singleton element (`autoFocus`, `aria-live`/`role=status`, unique `id`, `aria-labelledby`), not just the first found (LNS-364: caught autofocus, missed footer aria-live)
