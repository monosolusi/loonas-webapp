---
name: use-case-owns-business-decisions
description: Business decisions (idempotency-key generation, "new attempt vs retry") belong in the use case, not the transport/service layer — a key minted in the service generates a fresh one per call and defeats idempotency
metadata:
  type: feedback
---

Generate idempotency keys (and any "is this a new attempt or a retry" decision) in the **use case's `execute()`**, then thread the value down: use-case params → repo params → service, where the service only injects it into the header. Generating `crypto.randomUUID()` inside the service `create()` mints a **fresh key on every call** — so a network retry or double-submit produces a *new* key and creates duplicate records, defeating the exact guarantee the required `Idempotency-Key` exists to provide. The key identifies the *attempt*, which is a domain concept, not a transport detail.

**Why:** LNS-117 architecture-review M2 — the key was generated in `LedgerAccountServiceImpl.create()` instead of `CreateLedgerAccountUseCase.execute()`, breaking retry idempotency. Precedent: `use-post-opening-balance` / `use-close-period` generate in the use case.

**How to apply:** Idempotency key, attempt identity, retry semantics → the use case, never the service. When the EL plan names a layer explicitly ("generate in execute()"), do not relocate it for ergonomic convenience; a deviation that shifts a layer boundary needs a verified reason stated at implementation time, not post-hoc. Related: [[usecase-private-methods-plain-return]].
