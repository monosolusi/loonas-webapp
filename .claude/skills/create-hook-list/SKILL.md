---
name: create-hook-list
description: Create a paginated SWR list hook that wraps a List use case and returns a discriminated-union state (initial/loaded/error). Use when a page or component needs to fetch a paginated collection of entities with filters like search, date range, or page number. Triggers include "list hook", "paginated hook", "SWR list", "fetch list", "useList...". DO NOT use this for fetching a single entity (use create-hook-get) or for mutations (use create-hook-mutation).
paths: src/features/**/presentations/hooks/**
---

# Create List Hook (SWR, paginated)

A list hook wraps a **list use case** via SWR and exposes a discriminated-union return type. It is the only layer where SWR keys are invoked for list reads. Every list hook pairs with:
- A `*.types.ts` sibling file declaring params + return type
- An entry in `PRODUCTION_SWR_KEYS` (or the feature's equivalent `FEATURE_SWR_KEYS`) constant

## When to use

- A page renders a list that is paginated, searchable, or filterable.
- You need the list to re-fetch after a mutation via `revalidateSWRKey(...)`.

**Do not use for**: single-entity reads (→ `create-hook-get`), create/update/delete actions (→ `create-hook-mutation`), in-memory filter/sort only (no hook needed).

## File location & naming

| File | Path |
| --- | --- |
| Hook | `src/features/{feature}/presentations/hooks/use-list-{nouns}.ts` |
| Types | `src/features/{feature}/presentations/hooks/use-list-{nouns}.types.ts` |
| SWR key | Add entry to `src/features/{feature}/presentations/constants/swr-keys.ts` |

Naming convention:
- Hook file: **`use-list-{noun}.ts`** (singular noun — e.g. `use-list-stock-item.ts`, `use-list-production-records.ts`).
- Fetcher function: **`List{Noun}Fetcher`** (singular — e.g. `ListStockItemFetcher`).

Be aware: existing code mixes singular and plural in filenames. Match the feature's own precedent. For brand-new features, prefer singular.

## Rules

1. Top of file: `"use client";` directive.
2. Use SWR (`useSWR`), never `useSWRMutation` — mutations have their own skill.
3. **SWR key** is a `[KEY_CONSTANT, fetcherParams]` tuple. Params must include `clerk` from `useClerk()` so the fetcher can build a session. Never hardcode the string key — use `FEATURE_SWR_KEYS.LIST_XXX` constants.
4. **Fetcher is a standalone function** outside the hook. It assembles the dependency chain (`SessionRepository` + feature repository + service) and invokes the use case. On `DataFailed`, throw the error. On missing `data`, throw `INVALID_INSTANCE`.
5. **Return type is a discriminated union**: `InitialState | LoadedState | ErrorState`. Never include both real data and `loading: true` — use the union to guarantee exclusivity.
6. The hook params object is optional (`params: UseListXxxParams = {}`). Pass only fields needed by the use case.
7. **SWR key constant** must be added to `{feature}/presentations/constants/swr-keys.ts`. Mutations in the same feature call `revalidateSWRKey(PRODUCTION_SWR_KEYS.LIST_PRODUCTION_RECORDS)` to refresh this hook.

## Template

`use-list-{nouns}.ts`:

```ts
"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { {Noun}RepositoryImpl } from "@/features/{feature}/data/repositories/{noun}";
import { {Noun}ServiceImpl } from "@/features/{feature}/data/sources/{noun}";
import {
  List{Nouns}UseCase,
  List{Nouns}UseCaseParams,
} from "@/features/{feature}/domain/usecases/list-{nouns}.usecases";
import { {FEATURE}_SWR_KEYS } from "@/features/{feature}/presentations/constants/swr-keys";
import {
  List{Noun}FetcherParams,
  UseList{Nouns}Params,
  UseList{Nouns}ReturnType,
} from "@/features/{feature}/presentations/hooks/use-list-{nouns}.types";

const INITIAL_STATE: UseList{Nouns}ReturnType = {
  {nouns}: null,
  meta: null,
  loading: true,
  error: null,
};

async function List{Noun}Fetcher([_, params]: [string, List{Noun}FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repository = new {Noun}RepositoryImpl(new {Noun}ServiceImpl(new HttpRequest()));
  const useCase = new List{Nouns}UseCase(repository, sessionRepository);
  const result = await useCase.execute(
    new List{Nouns}UseCaseParams({
      /* pass whatever params the use case expects */
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useList{Nouns}(params: UseList{Nouns}Params = {}): UseList{Nouns}ReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [{FEATURE}_SWR_KEYS.LIST_{NOUNS}, { ...params, clerk }],
    List{Noun}Fetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      {nouns}: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }
  if (!data) return INITIAL_STATE;

  return { {nouns}: data.data, meta: data.meta, loading: false, error: null };
}
```

`use-list-{nouns}.types.ts`:

```ts
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";

export type UseList{Nouns}Params = {
  search?: string;
  page?: number;
  limit?: number;
  // ...domain-specific filters
};

export type List{Noun}FetcherParams = UseList{Nouns}Params & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = { {nouns}: null; meta: null; loading: true; error: null };
type LoadedState = { {nouns}: {Noun}Entity[]; meta: PaginationMeta; loading: false; error: null };
type ErrorState = { {nouns}: null; meta: null; loading: false; error: ServerError };

export type UseList{Nouns}ReturnType = InitialState | LoadedState | ErrorState;
```

`swr-keys.ts` (add entry):

```ts
export const {FEATURE}_SWR_KEYS = {
  LIST_{NOUNS}: "list-{nouns-kebab}",
  // ... other keys
} as const;
```

## References

- [`references/use-list.ts`](references/use-list.ts) — full hook implementation.
- [`references/use-list.types.ts`](references/use-list.types.ts) — sibling types file with discriminated union.
- [`references/swr-keys.ts`](references/swr-keys.ts) — SWR keys constant pattern.

## Common pitfalls

- **Hardcoded SWR key string** — always use the `FEATURE_SWR_KEYS` constant. Mutations revalidate by key name; a mismatch breaks cache invalidation.
- **Calling the repository directly** — always go through the use case. The use case resolves the session.
- **Missing `"use client"`** — SWR hooks must be client components.
- **Return type is a plain object instead of a union** — callers rely on the union to distinguish states without null checks.
- **Fetcher inside the hook** — keep it at module scope so SWR can deduplicate across components.
- **Including `clerk` in the typed `UseListXxxParams`** — `clerk` is a fetcher-internal concern. Keep it out of the public param type; add it via `FetcherParams = UseListXxxParams & { clerk }`.
