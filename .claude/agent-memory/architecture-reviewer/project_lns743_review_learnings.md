---
name: lns743-review-learnings
description: LNS-743 cash-entry-settings arch review — details.code unwrap template validated; provider-imports-_components and page-level error shape are false positives; one Minor (retry offered on a terminal 403)
metadata:
  type: project
---

Review of the LNS-743 cash-entry-settings page diff (2026-08-31) came back near-clean (one Minor). Things verified so future reviews don't re-litigate them:

- **The `details.code` unwrap in a `classify-*` helper is the validated template, not a smell.** `classifySaveError` does `err.code === ErrorCodes.UNKNOWN.code ? err.details?.code ?? err.code : err.code`. It holds because `HttpRequest` (unknown-code branch) passes `code: data.code` into details, and `ServerError`'s constructor does `Object.assign({}, {code: registryCode, ...}, details)` so the real BE code always wins in `details.code`. Extends the [[lns738-review-learnings]] `details.status`-not-`httpCode` rule: branch on the *unwrapped* code, never `httpCode`.
- **A page-level provider importing from its own `_components/` is established** (6 precedents: profitability, cash-entry-detail, journal-detail, recipe-edit, product-create, production-create). Not a layering violation.
- **`refresh: () => mutate()` typed as `KeyedMutator`** — confirmed again (see [[lns738-review-learnings]]): when the hook returns the raw `mutate`, `refresh?.().catch(() => {})` in a retry is correct, not an unguarded mutate.
- **`LedgerAccountCombobox` already calls `useListAllLedgerAccounts` itself**, so a page provider calling the same hook is the same SWR cache, not a provider-data-locality violation. Provider still needs its own copy to resolve saved-id→entity / detect a stale saved id.
- **One real Minor found**: `cash-entry-settings-error.tsx` offers "Coba lagi" unconditionally while the GET contract declares 403 (terminal) alongside 200 — its own comment asserts "every failure here is worth a retry", which the contract contradicts. Rule to reuse: the CLAUDE.md "omit the retry button when the error is terminal" carve-out is NOT_NOT_FOUND-only in the text; it generalizes to 403. Gate the retry on the error code.
- **Eligibility helper used as designed**: `cash-category-eligibility` doc comment says "narrow an account list before it reaches a picker, never to decide whether a request may be sent" — LNS-743 does exactly that (picker `filter` only, server-authoritative 422 rendered inline). A call site that instead *blocks* the request on the helper is the drift to flag.
