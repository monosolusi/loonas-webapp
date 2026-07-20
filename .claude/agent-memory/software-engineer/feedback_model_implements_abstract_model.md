---
name: model-implements-abstract-model
description: Every data-layer Model class (data/models/) must declare `implements AbstractModel` — including *ResultModel envelopes and nested value-object models that expose toValue() instead of toEntity()
metadata:
  type: feedback
---

**Rule:** Every class under `data/models/` must declare `implements AbstractModel` (from `@/core/resources/model`). This applies uniformly — including `*ResultModel` response-envelope models and nested value-object models that expose `toValue()` instead of `toEntity()`. The `toValue()` vs `toEntity()` distinction does NOT exempt a class from the marker.

**Why:** On 2026-06-15 (LNS-369) architecture-review raised M1 + m1: `JournalWriteResultModel` (an envelope wrapping `{data, warnings[]}`) and `JournalPostedByModel` (a nested value object using `toValue()`) were both written without `implements AbstractModel`. The `create-model` skill (Rule 1) requires the marker on every model class regardless of whether it maps to a full entity or a plain value type. Two classes in the same PR missed it, forcing a fix loop.

**How to apply:** After writing any class in `data/models/`, self-check before marking the task done — does it `implements AbstractModel` and import it from `@/core/resources/model`? Result-envelope and nested value-object models still need the marker.

Related: [[usecase-params-class]]
