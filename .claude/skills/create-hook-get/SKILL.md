---
name: create-hook-get
description: Create an SWR single-entity read hook (use-get-xxx) that wraps a Get use case and returns a discriminated-union state. Use when a page or component needs to fetch one entity by id. Triggers include "get hook", "detail hook", "fetch single", "useGet...", "fetch by id". DO NOT use this for paginated lists (use create-hook-list) or for mutations (use create-hook-mutation).
---

# Create Get Hook (SWR, single entity)

A get hook fetches a single entity by id (or a similar unique key) and returns a discriminated-union state. It is the foundation for detail pages and any place that reads one record at a time.

## When to use

- A detail page needs to load one entity given an id.
- A component needs to lazily load a sub-resource tied to a selection (use the `id` nullability pattern).

**Do not use for**: paginated/filtered lists (→ `create-hook-list`), mutations (→ `create-hook-mutation`).

## File location & naming

| File | Path |
| --- | --- |
| Hook | `src/features/{feature}/presentations/hooks/use-get-{noun}.ts` |
| Types | `src/features/{feature}/presentations/hooks/use-get-{noun}.types.ts` |
| SWR key | Entry `GET_{NOUN}` in `src/features/{feature}/presentations/constants/swr-keys.ts` |

Naming convention:
- Hook file: **`use-get-{noun}.ts`** (singular noun).
- Fetcher: **`Get{Noun}Fetcher`**.

## Rules

1. Top of file: `"use client";` directive.
2. Use `useSWR` (not `useSWRMutation`).
3. **SWR key pattern**: pass `null` when the id is missing → SWR skips fetching.
   ```ts
   useSWR(id ? [SWR_KEY, { clerk, id }] : null, Fetcher);
   ```
4. Fetcher signature: `async function Get{Noun}Fetcher([_, params]: [string, { clerk; id }])`.
5. Return type is a discriminated union: `InitialState | LoadedState | ErrorState` with a single field (e.g. `record`, not an array).
6. In the hook: treat `!id` the same as loading — return `INITIAL_STATE`.
7. Add `GET_{NOUN}` entry to the feature's `swr-keys.ts` constant file.

## Template

`use-get-{noun}.ts`:

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
  Get{Noun}UseCase,
  Get{Noun}UseCaseParams,
} from "@/features/{feature}/domain/usecases/get-{noun}.usecases";
import { {FEATURE}_SWR_KEYS } from "@/features/{feature}/presentations/constants/swr-keys";
import { UseGet{Noun}ReturnType } from "@/features/{feature}/presentations/hooks/use-get-{noun}.types";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  id: string;
};

const INITIAL_STATE: UseGet{Noun}ReturnType = {
  {noun}: null,
  loading: true,
  error: null,
};

async function Get{Noun}Fetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repository = new {Noun}RepositoryImpl(new {Noun}ServiceImpl(new HttpRequest()));
  const useCase = new Get{Noun}UseCase(repository, sessionRepository);
  const result = await useCase.execute(new Get{Noun}UseCaseParams(params.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGet{Noun}(id: string | null): UseGet{Noun}ReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    id ? [{FEATURE}_SWR_KEYS.GET_{NOUN}, { clerk, id }] : null,
    Get{Noun}Fetcher,
  );

  if (isLoading || !id) return INITIAL_STATE;
  if (error) {
    return {
      {noun}: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }
  if (!data) return INITIAL_STATE;

  return { {noun}: data, loading: false, error: null };
}
```

`use-get-{noun}.types.ts`:

```ts
import { ServerError } from "@/core/resources/server-error";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";

type InitialState = { {noun}: null; loading: true; error: null };
type LoadedState = { {noun}: {Noun}Entity; loading: false; error: null };
type ErrorState = { {noun}: null; loading: false; error: ServerError };

export type UseGet{Noun}ReturnType = InitialState | LoadedState | ErrorState;
```

## References

- [`references/use-get.ts`](references/use-get.ts) — full hook implementation with id nullability.
- [`references/use-get.types.ts`](references/use-get.types.ts) — sibling types file with discriminated union.

## Common pitfalls

- **Fetching when id is missing** — pass `null` as the SWR key, not a placeholder id. Otherwise SWR caches an invalid request.
- **Naming the field generically** (`data: ...`) — use a domain-specific name like `record`, `invoice`, `product`. It reads better at call sites.
- **Forgetting the `|| !id` guard** — the hook may briefly be called with `null` id during transitions. Treat that as `loading`.
- **Re-using a list SWR key for get** — list and get keys must be separate so mutations can revalidate them independently.
- **Passing whole objects through SWR key** — the key tuple should be serializable enough for SWR's deep-compare. `clerk` is an exception because SWR does reference-compare for functions; the rest should be primitives.

## After creating

This hook is usually consumed inside a **page-level provider with the guarantee pattern** (see `create-provider`), which renders a `loading` placeholder until `record` is non-null, then passes `record` to children via context so they don't need null checks.
