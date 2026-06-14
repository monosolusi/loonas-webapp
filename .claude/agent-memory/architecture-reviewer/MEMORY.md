# Architecture Reviewer Memory

- [Co-located sub-component anti-pattern](feedback_colocated_subcomponent_antipattern.md) — Engineers put private JSX-returning helpers inside parent files; flag as one-component-per-file violation
- [Retained file name flag](feedback_retained_name_flag.md) — When sub-components keep old parent-widget name prefix after refactor, flag as minor naming drift for EL consideration
- [Empty params class anti-pattern](feedback_empty_params_class_pattern.md) — Empty `class XxxUseCaseParams {}` is a should-fix; use `UseCase<ReturnValue>` with void default instead
- [Text-link button h-11 exception](feedback_button_h11_exception.md) — `h-11` does not apply to text-link-styled `<button>` elements; only to form-interactive controls
