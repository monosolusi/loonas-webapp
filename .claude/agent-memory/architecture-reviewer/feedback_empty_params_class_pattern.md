---
name: empty-params-class-pattern
description: Empty params class is an anti-pattern when UseCase base supports Params=void; flag as should-fix
metadata:
  type: feedback
---

When a use case requires no business parameters (params are already resolved internally via session), an empty params class like `class RetrieveXxxUseCaseParams {}` is an anti-pattern. The `UseCase` base class supports `Params = void` — use cases with no params should use that default and accept no `execute()` argument.

The empty params class forces every caller to instantiate a meaningless `new RetrieveXxxUseCaseParams()` and forces `execute(_params)` with an ignored argument. Both are noise.

**Why:** Discovered in LNS-384 review of `retrieve-account-verification-work.ts`. The `RetrieveAccountVerificationWorkUseCaseParams {}` class was emptied as part of the JWT migration but not removed. Three callsites must each instantiate the empty class.

**How to apply:** Flag any `class XxxUseCaseParams {}` with no properties as a should-fix. Direct the author to use `UseCase<ReturnValue>` (defaulting `Params = void`) and remove the params class entirely. Cite `.claude/skills/create-usecase/SKILL.md`.
