---
name: feedback-idempotency-key-layer
description: Idempotency-Key generation belongs in the use-case layer, not the service/HTTP layer — service-layer placement makes retries non-idempotent
metadata:
  type: feedback
---

Idempotency keys for HTTP mutations must be generated in the use-case `execute()` method and passed down through params (use-case params → repo params → service params → HTTP header). Generating inside the service impl (`crypto.randomUUID()` in `ServiceImpl.create()`) is a Major violation: the service layer makes a domain-level decision (is this a fresh attempt or a retry?), and the key is unobservable at the use-case level.

Found in LNS-117 `LedgerAccountServiceImpl.create()` (line 114). EL's plan had explicitly called for use-case ownership.

**Why:** Every re-trigger from the hook generates a new random key, making each call effectively a new idempotency window — server-side deduplication becomes ineffective on user-driven retries.

**How to apply:** When reviewing POST/PATCH mutations that carry an `Idempotency-Key` header, trace where `crypto.randomUUID()` is called. If inside a `*ServiceImpl` method, flag Major. Correct location is inside `UseCase.execute()`, with the key threaded through as a field on the use-case param class.

[[feedback_usecase_private_method_datastate]]
