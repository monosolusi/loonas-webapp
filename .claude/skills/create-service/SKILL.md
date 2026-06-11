---
name: create-service
description: Create the service (data source) layer for a feature — the service interface (`domain/sources/`) and its HTTP implementation (`data/sources/`). The service handles the transport layer: URL paths, search params, JSON body, and parsing responses via `Model.fromJson`. Use when adding a new backend resource that a Repository will wrap. Triggers include "create service", "create source", "add HTTP service", "data source", "service interface", "buat service", "buat source". DO NOT use this skill for business-level Repository work — use create-repository for that.
paths: src/features/**/domain/sources/**, src/features/**/data/sources/**
---

# Create Service (data source)

The service (a.k.a. source) layer is **two files** that handle HTTP communication:

| File | Role |
| --- | --- |
| `domain/sources/{noun}.ts` | Service interface. Returns raw Models. Also defines service result types (e.g. `ListXxxServiceResult`). |
| `data/sources/{noun}.ts` | HTTP implementation. Uses `HttpRequest`, builds URL paths + search params, parses JSON via `Model.fromJson`. |

Services speak the **transport language** (Models, HTTP paths, throws). They are invoked by Repositories, which translate Models → Entities and throws → `DataFailed`. See `create-repository` for that layer.

Naming note: the folder is `sources/` (data source), but the class suffix is `Service` — `{Noun}Service` and `{Noun}ServiceImpl`. This is intentional: "service" describes the role, "sources" describes where transport-adjacent code lives.

## When to use

- Pairs with a new Repository. Services don't exist standalone — every service has a repository that consumes it.
- Wiring a new backend endpoint into an existing feature.

## File locations & naming

| Path | Name |
| --- | --- |
| `src/features/{feature}/domain/sources/{noun}.ts` | `{Noun}Service` (interface) + service-result types |
| `src/features/{feature}/data/sources/{noun}.ts` | `{Noun}ServiceImpl` |

Kebab-case filenames, singular noun, matching the entity/repository filename.

## Rules

### Signatures

1. **Session is always the last parameter**, methods take at most 2 params: `(params, session)`. Same rule as repositories.
2. Service methods return `Promise<Model>` (or `Promise<ListXxxServiceResult>` for lists, `Promise<void>` for delete). They **throw** `ServerError` on failure. They do **not** wrap in `DataState` — that's the repository's job.

### Types

3. **Paginated lists**: define a `List{Nouns}ServiceResult = { data: {Noun}Model[]; meta: PaginationMeta }` in the domain/sources file. The service returns this shape; the repository converts it to `DataState<PaginatedData<Entity>>`.
4. Parameter types are re-used from the matching repository file (`domain/repositories/{noun}.ts`). Import them — don't redeclare.

### HTTP

5. Use `HttpRequest` from `@/core/helpers/http-request`. Authentication is automatic (Clerk JWT injected via `Authorization: Bearer ...`) — **do not add** `Authorization` or `X-Account-Id` headers manually.
6. Pass `session` to every `this.http.request({ ..., session })` call.
7. Search params go under `searchParams` (for GET), request body under `body` (for POST/PATCH/PUT). **Convert camelCase → snake_case** for API keys here (this is the transport seam).
8. Conditionally add params — don't send empty values:
   ```ts
   const searchParams: Record<string, any> = {};
   if (params.search) searchParams["search"] = params.search;
   if (params.page) searchParams["page"] = String(params.page);
   ```
9. Array response guard: `if (!Array.isArray(result?.data)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);` before `.map(...)`.
10. Pagination meta: build with safe defaults —
    ```ts
    meta: {
      page: result.meta?.page ?? 1,
      limit: result.meta?.limit ?? 10,
      total: result.meta?.total ?? 0,
      totalPages: result.meta?.total_pages ?? 1,
    }
    ```
11. Parse each response through the Model: `{Noun}Model.fromJson(result)` or `items.map({Noun}Model.fromJson)`.

### Error handling

12. Wrap every try/catch this way — rethrow `ServerError`, otherwise wrap:
    ```ts
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
    ```

## Template

```ts
// src/features/{feature}/domain/sources/{noun}.ts
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { {Noun}Model } from "@/features/{feature}/data/models/{noun}";
import {
  List{Nouns}Params,
  Create{Noun}Params,
  Delete{Noun}Params,
} from "@/features/{feature}/domain/repositories/{noun}";

export type List{Nouns}ServiceResult = {
  data: {Noun}Model[];
  meta: PaginationMeta;
};

export interface {Noun}Service {
  list(params: List{Nouns}Params, session: SessionEntity): Promise<List{Nouns}ServiceResult>;
  get(id: string, session: SessionEntity): Promise<{Noun}Model>;
  create(params: Create{Noun}Params, session: SessionEntity): Promise<{Noun}Model>;
  delete(params: Delete{Noun}Params, session: SessionEntity): Promise<void>;
}
```

```ts
// src/features/{feature}/data/sources/{noun}.ts
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { {Noun}Model } from "@/features/{feature}/data/models/{noun}";
import { {Noun}Service, List{Nouns}ServiceResult } from "@/features/{feature}/domain/sources/{noun}";
import {
  List{Nouns}Params,
  Create{Noun}Params,
  Delete{Noun}Params,
} from "@/features/{feature}/domain/repositories/{noun}";

export class {Noun}ServiceImpl implements {Noun}Service {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: List{Nouns}Params, session: SessionEntity): Promise<List{Nouns}ServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.search) searchParams["search"] = params.search;
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/{nouns-kebab}",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map({Noun}Model.fromJson),
        meta: {
          page: result.meta?.page ?? 1,
          limit: result.meta?.limit ?? 10,
          total: result.meta?.total ?? 0,
          totalPages: result.meta?.total_pages ?? 1,
        },
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
  // ... get, create, delete follow the same try/catch + HttpRequest pattern
}
```

## References

- [`references/domain-service.ts`](references/domain-service.ts) — service interface + `List{Nouns}ServiceResult`.
- [`references/data-service.ts`](references/data-service.ts) — HTTP impl with URL building, `fromJson`, error rethrow.

## Common pitfalls

- **Returning `DataState` from the service** — services throw. Wrapping belongs to the repository.
- **Adding business logic to a service** — services only translate params → HTTP + parse response → Model. No domain rules, no computations.
- **Manual `fetch` instead of `HttpRequest`** — avoid unless you have a specific reason. `HttpRequest` handles auth, base URL, error mapping. If you must bypass it, still set `Authorization: Bearer ...`.
- **Adding `X-Account-Id`** — removed. Account is resolved server-side from the Clerk JWT `orgId`.
- **Forgetting the `Array.isArray` guard** — if the API returns unexpected shape, `.map()` throws opaquely. Guard first.
- **Passing camelCase keys to the API** — snake_case conversion happens here. Repository and domain use camelCase.
- **Duplicating param types** — import `List/Create/Delete{Noun}Params` from `domain/repositories/{noun}.ts` rather than redefining.

## After creating

The repository is now wire-able. Instantiate it in presentation hooks:
```ts
const service = new {Noun}ServiceImpl(new HttpRequest());
const repository = new {Noun}RepositoryImpl(service);
```

If the use case or hook isn't written yet, invoke `create-usecase` or the matching `create-hook-*` skill.
