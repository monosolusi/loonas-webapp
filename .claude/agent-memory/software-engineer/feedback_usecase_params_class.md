---
name: usecase-params-class
description: Use-case inputs are always a named params CLASS (export class XUseCaseParams { constructor(...) {} }), never a bare type alias — even when the EL plan writes `type Input = {...}`
metadata:
  type: feedback
---

**Rule:** A new use case's input is always a named params **class** (`export class XUseCaseParams { constructor(public readonly ...) {} }`), matching the feature's existing use cases — never a bare `type` alias passed directly as the `UseCase<R, Input>` generic. This holds even when the EL plan hands you `type Input = {...}`; convert it to the class form. Name it `{Verb}{Noun}UseCaseParams`.

**Why:** On 2026-06-15 (LNS-369) architecture-review raised m2: `GetJournalUseCaseParams` used the canonical class form, but `CreateJournalUseCaseInput`/`ReverseJournalUseCaseInput` were plain type aliases — intra-PR inconsistency against every other accounting use case (`CreateCoaMappingUseCaseParams`, etc.). Params-independence was satisfied either way, but the class form is the established convention and the reviewer flagged the drift.

**How to apply:** When writing a new use case, look at one existing use case in the same feature first and mirror its params shape (a class). Don't inherit a bare-type-alias shape from a plan verbatim — normalize to the params class.

Related: [[model-implements-abstract-model]]
