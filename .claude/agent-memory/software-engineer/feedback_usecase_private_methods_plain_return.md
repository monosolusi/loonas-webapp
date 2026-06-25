---
name: usecase-private-methods-plain-return
description: Use-case private action methods return a plain type and throw on DataFailed; execute() owns the DataSuccess/DataFailed wrap — never let DataState leak out of a private
metadata:
  type: feedback
---

A use case's private action methods (e.g. `createAccount`, `updateAccount`, `deleteAccount`) must return the **plain payload** (`Promise<Entity>`, or `Promise<void>`) and **throw** on failure — unwrap the repo's result with `if (result instanceof DataFailed) throw result.error; return result.data!`. `execute()` is the **only** `DataState` boundary: `try { const session = await this.resolveSession(); const data = await this.action(params, session); return new DataSuccess(data); } catch (err) { return new DataFailed(...) }`. A private that returns `Promise<DataState<...>>` while `execute()` just delegates it out defeats the clean-workflow pattern (Rule 11).

**Why:** Flagged as architecture-review M1 on **both LNS-379 and LNS-117** — a twice-seen mistake, so harden it. `execute()` reads as a clean workflow only when the try/catch + DataState wrap live in exactly one place (execute), with the privates throwing.

**How to apply:** When writing a use case, type each private action method as the plain success type, `throw result.error` on a `DataFailed` from the repo, and let `execute()` do the single `DataSuccess`/`DataFailed` wrap. Mirror an existing accounting use case before writing. Related: [[usecase-params-class]], [[use-case-owns-business-decisions]].
