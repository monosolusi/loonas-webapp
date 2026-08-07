---
name: feedback_provider_dead_context_values
description: Provider exposes context fields (onRetry, shellState, isLoadingPage) that no consumer wires — dead context is a UX-completeness gap, not just dead code
metadata:
  type: feedback
---

When a page-level provider exposes context fields that no `_components/` consumer destructures, that is not just dead code — it is usually a **wired-in-the-provider, forgotten-in-the-view** UX gap. The most common shape: the provider builds `onRetry` (calls `hookResult.refresh?.()`), puts it in the context type, but the view never wires it to any error UI, so non-403 errors render a plain "Gagal memuat data." with no retry button.

**Why:** LNS-640 cost-valuation-gaps — provider exposed `onRetry`, `shellState`, and `isLoadingPage`; the view consumed none of them. Every sibling accounting report view (buku-besar, trial-balance, income-statement, cash-flow, notes) wires `onRetry` to a report error component, so the omission was visible only by cross-checking siblings. The provider looked complete; the view looked complete; the gap was between them.

**How to apply:** After reading the provider's context type, grep the view files for every field name in that type. Any field with zero hits outside the provider file is either (a) dead context to remove, or (b) a forgotten wire — usually the latter when the field is an action callback like `onRetry`. Cross-check sibling report/list views for the same field to see if they wire it. Related: [[feedback_dead_substate_components]] (scaffolded-but-unused files), [[feedback_provider_empty_state_gap]] (provider emits a state the view never handles).