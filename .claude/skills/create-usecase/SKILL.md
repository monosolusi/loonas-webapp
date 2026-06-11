---
name: create-usecase
description: Create a domain use case that orchestrates a single business operation — resolves the Clerk session and delegates to a repository. Use when adding an action like list, get, create, update, or delete that the presentation layer will invoke via a hook. Triggers include "create use case", "add use case", "new business operation", "buat usecase".
paths: src/features/**/domain/usecases/**
---

# Create Use Case

A use case encapsulates one business operation (list, get, create, update, delete, preview, etc.). It:
1. Resolves the authenticated `SessionEntity` from `SessionRepository`.
2. Delegates to the feature's repository method.
3. Returns `DataState<T>` so the caller doesn't need try/catch.

Use cases are what presentation hooks invoke — hooks should never talk to a repository directly.

## When to use

- Exposing any repository method to the presentation layer.
- Coordinating multiple repositories in one logical operation (e.g. cascade delete, composed preview). If multi-repo orchestration gets complex, split into private methods.

One repository method = one use case. Don't combine `list` + `get` into the same use case.

## File location & naming

| Item | Rule |
| --- | --- |
| Path | `src/features/{feature}/domain/usecases/{verb}-{noun}.usecases.ts` |
| Filename | `{verb}-{noun}.usecases.ts` — **note the `.usecases.ts` suffix for new files** (legacy files use just `.ts`; match existing convention when editing) |
| Class names | `{Verb}{Noun}UseCase` + `{Verb}{Noun}UseCaseParams` |

Verb conventions: `Get`, `List`, `Create`, `Update`, `Delete`, `Preview`, `Restore`, etc.

## Rules

1. **Define the use case's own input type** inside this file. Do NOT import `*Params` from the repository — the use case owns its API surface. Map to repo params internally.
2. **Params class pattern**: `export class {Verb}{Noun}UseCaseParams { constructor(public readonly params: SomeInput) {} }`. For single-field inputs (e.g. `id`), you can use `constructor(public readonly id: string) {}`.
3. **Implement `UseCase<ResultType, ParamsType>`** from `@/core/resources/use-case`.
4. **`execute()` is a workflow**, not a monolith. Always begin by calling the private `resolveSession()` helper, then delegate to the repository. Wrap with try/catch returning `DataFailed`.
5. **`resolveSession()` is the standard private helper** — same shape across all use cases:
   ```ts
   private async resolveSession(): Promise<SessionEntity> {
     const session = await this.sessionRepository.retrieve();
     if (session instanceof DataFailed) throw session.error;
     if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
     return session.data;
   }
   ```
6. **Return type is always `DataState<T>`**. Never throw to callers — wrap in `DataFailed`.
7. Constructor takes the feature repository first, then `SessionRepository`.

## Template

```ts
import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";
import { {Noun}Repository } from "@/features/{feature}/domain/repositories/{noun}";

type {Verb}{Noun}Input = {
  // fields the caller provides — own shape, independent of repo params
};

export class {Verb}{Noun}UseCaseParams {
  constructor(public readonly params: {Verb}{Noun}Input) {}
}

export class {Verb}{Noun}UseCase
  implements UseCase<DataState<{Noun}Entity>, {Verb}{Noun}UseCaseParams>
{
  constructor(
    private readonly {noun}Repository: {Noun}Repository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: {Verb}{Noun}UseCaseParams): Promise<DataState<{Noun}Entity>> {
    try {
      const session = await this.resolveSession();
      return await this.{noun}Repository.{verb}(params.params, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
```

## Variants by operation

- **Get by id**: `UseCaseParams` wraps a single `id: string`. Execute calls `repository.get(params.id, session)`.
- **List (paginated)**: Return type is `DataState<PaginatedData<{Noun}Entity>>`.
- **Delete**: Return type is `DataState<void>`.
- **Multi-step**: `execute()` delegates to private action methods. Keep `execute()` short and readable — it should read like a workflow.

## References

- [`references/create-usecase.ts`](references/create-usecase.ts) — standard create operation with wrapped input.
- [`references/get-usecase.ts`](references/get-usecase.ts) — get-by-id with single-arg params class.
- [`references/list-usecase.ts`](references/list-usecase.ts) — paginated list returning `PaginatedData`.

## Common pitfalls

- **Importing repo params** — define `{Verb}{Noun}Input` locally. Map to repo params at call site if shapes differ.
- **Throwing to callers** — always wrap in `DataFailed`. Presentation/hook code expects a `DataState`.
- **Bloated `execute()`** — if logic grows, extract private helpers. `execute()` should be readable top-to-bottom as a flow.
- **Skipping `resolveSession()`** — even operations that feel "trivial" still need the session; the backend relies on the Clerk JWT to resolve the account.
- **Filename without `.usecases.ts`** — new use cases should use the `.usecases.ts` suffix. Only preserve the legacy `.ts` suffix when editing older files.

## After creating

Wire the use case into a hook (see `create-hook-list`, `create-hook-get`, or `create-hook-mutation` depending on operation type).
