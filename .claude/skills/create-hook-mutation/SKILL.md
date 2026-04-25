---
name: create-hook-mutation
description: Create an SWR-mutation hook (use-create / use-update / use-delete) that wraps a write use case and exposes a trigger + isMutating state. Use when a form or action needs to create, update, or delete an entity. Triggers include "mutation hook", "create hook", "update hook", "delete hook", "form submit hook", "useCreate...", "useDelete...". DO NOT use this for reads (use create-hook-list for paginated reads or create-hook-get for single-entity reads).
paths: src/features/**/presentations/hooks/**
---

# Create Mutation Hook (SWR-mutation)

A mutation hook wraps one write operation (create / update / delete / other side effects) using `useSWRMutationClerk`. Callers receive a `{ trigger, isMutating }` pair — **the caller is responsible for calling `revalidateSWRKey(...)` after a successful mutation** (typically from a provider or dialog that knows which lists/details need refreshing).

## When to use

- Submitting a form that creates or updates an entity.
- Deleting an entity (via confirmation dialog).
- Any write action that mutates backend state.

**Do not use for**: reads (→ `create-hook-list` or `create-hook-get`), or for cache invalidation itself (that's `revalidateSWRKey` at the call site).

## File location & naming

| Operation | Filename |
| --- | --- |
| Create | `use-create-{noun}.ts` |
| Update | `use-update-{noun}.ts` |
| Delete | `use-delete-{noun}.ts` |

Path: `src/features/{feature}/presentations/hooks/`. Fetcher name: `{Verb}{Noun}Fetcher` (e.g. `CreateProductionRecordFetcher`).

No `.types.ts` sibling needed — mutation hooks return the generic `useSWRMutationClerk` shape.

## Rules

1. Top of file: `"use client";` directive.
2. Use `useSWRMutationClerk` from `@/core/helpers/use-swr-mutation-clerk` (NOT `useSWR`). It automatically injects `clerk` into the fetcher arg.
3. **Trigger params** = **repo params**. Mutation hooks can re-use the repository's `Create/Update/Delete{Noun}Params` type since the shape is identical. (This is the one place in the presentation layer that imports a repo param type.)
4. **Fetcher signature**: `async function {Verb}{Noun}Fetcher(_: string, { arg }: { arg: FetcherParams }): Promise<Entity | void>`. The first arg (the SWR key) is unused.
5. **SWR key**: pass a unique string literal to `useSWRMutationClerk` (e.g. `"create-production-record"`). Mutation keys are local to the hook and do NOT go in `swr-keys.ts` — that file is for read caches only.
6. **Error handling in fetcher**: throw `result.error` on `DataFailed`. For delete (no entity returned), the fetcher's return type is `void` and the last step is just `if (result instanceof DataFailed) throw result.error;`.
7. **Cache revalidation is the caller's job** — after `await trigger(...)`, the calling provider/dialog calls `revalidateSWRKey(PRODUCTION_SWR_KEYS.LIST_PRODUCTION_RECORDS)` etc. The hook itself does not revalidate.

## Template — create/update

```ts
"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { {Noun}RepositoryImpl } from "@/features/{feature}/data/repositories/{noun}";
import { {Noun}ServiceImpl } from "@/features/{feature}/data/sources/{noun}";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";
import { Create{Noun}Params } from "@/features/{feature}/domain/repositories/{noun}";
import {
  Create{Noun}UseCase,
  Create{Noun}UseCaseParams,
} from "@/features/{feature}/domain/usecases/create-{noun}.usecases";

type Create{Noun}TriggerParams = Create{Noun}Params;
type Create{Noun}FetcherParams = Create{Noun}TriggerParams & { clerk: ReturnType<typeof useClerk> };

async function Create{Noun}Fetcher(
  _: string,
  { arg }: { arg: Create{Noun}FetcherParams },
): Promise<{Noun}Entity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repository = new {Noun}RepositoryImpl(new {Noun}ServiceImpl(new HttpRequest()));
  const useCase = new Create{Noun}UseCase(repository, sessionRepository);
  const result = await useCase.execute(new Create{Noun}UseCaseParams(arg));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreate{Noun}() {
  return useSWRMutationClerk("create-{noun-kebab}", Create{Noun}Fetcher);
}
```

## Template — delete (no entity returned)

```ts
"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { {Noun}RepositoryImpl } from "@/features/{feature}/data/repositories/{noun}";
import { {Noun}ServiceImpl } from "@/features/{feature}/data/sources/{noun}";
import { Delete{Noun}Params } from "@/features/{feature}/domain/repositories/{noun}";
import {
  Delete{Noun}UseCase,
  Delete{Noun}UseCaseParams,
} from "@/features/{feature}/domain/usecases/delete-{noun}.usecases";

type Delete{Noun}TriggerParams = Delete{Noun}Params;
type Delete{Noun}FetcherParams = Delete{Noun}TriggerParams & { clerk: ReturnType<typeof useClerk> };

async function Delete{Noun}Fetcher(
  _: string,
  { arg }: { arg: Delete{Noun}FetcherParams },
): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repository = new {Noun}RepositoryImpl(new {Noun}ServiceImpl(new HttpRequest()));
  const useCase = new Delete{Noun}UseCase(repository, sessionRepository);
  const result = await useCase.execute(new Delete{Noun}UseCaseParams(arg));
  if (result instanceof DataFailed) throw result.error;
}

export function useDelete{Noun}() {
  return useSWRMutationClerk("delete-{noun-kebab}", Delete{Noun}Fetcher);
}
```

## Usage at call site

```tsx
const { trigger: createRecord, isMutating } = useCreate{Noun}();

try {
  const result = await createRecord({ /* ...params */ });
  await revalidateSWRKey(PRODUCTION_SWR_KEYS.LIST_PRODUCTION_RECORDS);
  showToast("Berhasil");
} catch {
  showToast("Gagal", "error");
}
```

## References

- [`references/use-create.ts`](references/use-create.ts) — create mutation returning an entity.
- [`references/use-delete.ts`](references/use-delete.ts) — delete mutation with `Promise<void>` return.

## Common pitfalls

- **Using `useSWR`** — mutation hooks use `useSWRMutationClerk`. `useSWR` is for reads.
- **Revalidating inside the hook** — do it at the caller (provider or dialog) where you know which lists to refresh.
- **Forgetting to unwrap `DataFailed`** — the fetcher must throw the underlying `ServerError`, not return it, so `useSWRMutationClerk` surfaces the error to the caller.
- **Hardcoding revalidation keys with strings** — callers must import from `{FEATURE}_SWR_KEYS` constant.
- **Reusing mutation key across hooks** — each mutation hook has its own unique key string.

## After creating

The mutation is normally consumed from a provider (see `create-provider`) that composes submit + revalidation + toast + navigation. Dialogs and form cards read from the provider, not the hook directly.
