---
name: create-repository
description: Create the repository layer for a feature — domain interface, data implementation, service interface, and service implementation that talks to the backend HTTP API. Use when the feature needs to fetch, create, update, or delete a resource from the backend. Triggers include "create repository", "add API endpoints", "wire up service", "data source", "buat repository".
---

# Create Repository

The repository layer is four files working together to expose backend operations to the rest of the app. Split responsibilities:

| File | Role |
| --- | --- |
| `domain/repositories/{noun}.ts` | **Interface** the rest of the app depends on. Accepts/returns Entities, wraps results in `DataState`. |
| `data/repositories/{noun}.ts` | **Implementation** of the domain interface. Calls the service, converts Models → Entities, wraps errors in `DataState`. |
| `domain/sources/{noun}.ts` | Service **interface**. Returns raw Models. Also defines service result types (e.g. `ListXxxServiceResult`). |
| `data/sources/{noun}.ts` | Service **implementation**. Uses `HttpRequest`, handles HTTP paths and search params, parses response JSON via `Model.fromJson`. |

## When to use

- A new feature needs any of: list, get, create, update, or delete operations against the backend.
- Adding a new sub-resource to an existing feature (e.g. a feature master + separate entries). Each sub-resource gets its own pair of files — see Interface Segregation below.

## File locations & naming

| Path | Name |
| --- | --- |
| `src/features/{feature}/domain/repositories/{noun}.ts` | `{Noun}Repository` (interface) + `*Params` types |
| `src/features/{feature}/data/repositories/{noun}.ts` | `{Noun}RepositoryImpl` |
| `src/features/{feature}/domain/sources/{noun}.ts` | `{Noun}Service` (interface) + service-result types |
| `src/features/{feature}/data/sources/{noun}.ts` | `{Noun}ServiceImpl` |

All files use kebab-case, singular noun, matching the entity filename.

## Rules

### Signatures

1. **Session is always the last parameter**, and methods have **at most 2 parameters**: `(params, session)`. Group all business params into a single object.
   ```ts
   list({ search, page, limit }: ListFooParams, session: SessionEntity)
   update({ id, name }: UpdateFooParams, session: SessionEntity)
   ```
2. Repository methods return `Promise<DataState<T>>`. For void operations use `DataState<void>`.
3. Service methods return `Promise<T>` (Model or result-shape). They throw `ServerError` on failure.

### Types

4. **Param types live in the domain repository file** (e.g. `ListFooParams`, `CreateFooParams`). Re-export them from sources if needed. Use cases define their own param shape separately (do NOT import repo params from use cases).
5. **Paginated lists**: repository returns `DataState<PaginatedData<Entity>>`. Service returns a custom `List{Noun}ServiceResult = { data: Model[]; meta: PaginationMeta }`.
6. **Pagination meta**: build from API response with safe defaults: `{ page: result.meta?.page ?? 1, limit: result.meta?.limit ?? 10, total: result.meta?.total ?? 0, totalPages: result.meta?.total_pages ?? 1 }`.

### Error handling

7. **Data repository**: wrap every try/catch like this — rethrow `ServerError` as `new DataFailed(err)`; other errors become `new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }))`.
8. **Data service**: same shape but uses `throw` instead of returning `DataFailed`.

### HTTP

9. Use `HttpRequest` from `@/core/helpers/http-request`. Authentication is automatic — do not add `Authorization` or `X-Account-Id` headers.
10. Pass `session` to every `this.http.request(...)` call.
11. Search params go under `searchParams`, request body under `body`. Convert camelCase to snake_case for API keys here.
12. Array response guard: `if (!Array.isArray(result?.data)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);`

### Interface Segregation

13. When a feature has distinct sub-resources (master + entries, parent + children), **split into separate repository/source interfaces, impls, and files**. One file per concern — do not bundle.

## Template summary

See reference files for full shape. Minimum surface for a list + get + create + delete resource:

```ts
// domain/repositories/{noun}.ts
export type List{Nouns}Params = { search?: string; page?: number; limit?: number };
export type Create{Noun}Params = { /* ... */ };
export type Delete{Noun}Params = { id: string };

export interface {Noun}Repository {
  list(params: List{Nouns}Params, session: SessionEntity): Promise<DataState<PaginatedData<{Noun}Entity>>>;
  get(id: string, session: SessionEntity): Promise<DataState<{Noun}Entity>>;
  create(params: Create{Noun}Params, session: SessionEntity): Promise<DataState<{Noun}Entity>>;
  delete(params: Delete{Noun}Params, session: SessionEntity): Promise<DataState<void>>;
}
```

## References

Study all four files as a set — they are a contract:

- [`references/domain-repository.ts`](references/domain-repository.ts) — interface + param types.
- [`references/data-repository.ts`](references/data-repository.ts) — impl (Model → Entity mapping, `DataState` wrapping).
- [`references/domain-source.ts`](references/domain-source.ts) — service interface + result types.
- [`references/data-service.ts`](references/data-service.ts) — service impl (`HttpRequest`, URL building, `fromJson`).

## Common pitfalls

- **Session in the middle of the params list** — it must be last.
- **More than 2 params** — bundle business args into one object.
- **Repo impl forgetting `.map((m) => m.toEntity())`** — outside `data/`, callers only see entities.
- **Service impl leaking `DataState`** — service throws, repo wraps. Keep concerns separated.
- **Importing repo params into the use case file** — use cases define their own input type and pass it through (see `create-usecase`).
- **Adding `X-Account-Id` header** — removed. Account is resolved server-side from the Clerk JWT `orgId`.
- **Relative imports** — always use `@/` path alias.

## After creating

Next step is usually a use case (invoke `create-usecase`) that composes this repository with `SessionRepository`. The presentation layer (hooks) consumes the use case, not the repository directly.
