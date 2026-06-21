---
name: presentation-never-imports-data-models
description: When planning component/hook/resolver signatures, type them against domain entities/types — NEVER data/models. The data/models import exemption is domain/sources/ ONLY.
metadata:
  type: feedback
---

When I specify file signatures in an implementation plan, presentation-layer code (components, hooks, presentation helpers/resolvers) and domain-layer code must consume **domain entities/types**, never `@/features/*/data/models/*`.

**Why:** LNS-344 Phase-3 — my brief typed `NormalBalanceHintBlock` (component) and `normalBalanceHintResolver` (presentation helper) directly against `NormalBalanceHintLineModel` from `data/models/`. Arch-review raised it as a 🔴 change-introduced Blocker (presentation reaching into data violates Clean Architecture layering). The CLAUDE.md note that `domain/sources/` MAY import data models is the ONLY exemption — it does NOT extend to presentation or to domain entities/usecases.

**How to apply:** When a parser/`fromJson` lives in the data layer but its output is consumed by presentation or domain, the data model needs a `toEntity()` that maps to a domain type (`domain/entities/` or `domain/types/`), and the parser helper should return the domain type, not the Model. Type every component/hook/resolver prop and every usecase signature against the domain type. Reserve `data/models` imports for: data-layer internals and `domain/sources/` interfaces only. Catch this at plan time by scanning my own file-signature sketches for `data/models` appearing in a presentation/ or domain/entities path.
