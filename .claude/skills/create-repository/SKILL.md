---
name: create-repository
description: Create the repository layer for a feature — the domain interface (`domain/repositories/`) and its data implementation (`data/repositories/`). The repository exposes business-shaped operations (returning Entities wrapped in `DataState`) and delegates HTTP work to a Service. Use when adding a new resource that needs to be fetched, created, updated, or deleted from the backend. Triggers include "create repository", "repository interface", "repository impl", "add business operations", "buat repository". DO NOT use this skill for the HTTP service layer under `sources/` — use create-service for that.
paths: src/features/**/domain/repositories/**, src/features/**/data/repositories/**
---

# Create Repository

The repository layer is **two files** working together:

| File | Role |
| --- | --- |
| `domain/repositories/{noun}.ts` | Interface the rest of the app depends on. Accepts/returns Entities. Wraps results in `DataState`. Also defines `*Params` types. |
| `data/repositories/{noun}.ts` | Implementation of the interface. Calls the Service, converts Models → Entities, wraps errors in `DataState`. |

Repositories speak the **business language** (Entities, `DataState`). They are the seam between the domain and the transport layer. The Service (see `create-service` skill) handles actual HTTP calls.

## When to use

- Adding a new resource that needs list / get / create / update / delete.
- Adding a sub-resource to a feature (e.g. master + entries). Each sub-resource gets its own repository pair.

## File locations & naming

| Path | Name |
| --- | --- |
| `src/features/{feature}/domain/repositories/{noun}.ts` | `{Noun}Repository` (interface) + `*Params` types |
| `src/features/{feature}/data/repositories/{noun}.ts` | `{Noun}RepositoryImpl` |

Kebab-case filenames, singular noun, matching the entity filename.

## Rules

### Signatures

1. **Session is always the last parameter**, and methods have **at most 2 parameters**: `(params, session)`. Group all business params into a single object.
   ```ts
   list({ search, page, limit }: ListFooParams, session: SessionEntity)
   update({ id, name }: UpdateFooParams, session: SessionEntity)
   ```
2. Repository methods return `Promise<DataState<T>>`. For void operations use `DataState<void>`.

### Types

3. **Param types live in this file** (e.g. `ListFooParams`, `CreateFooParams`). Re-export from the service file if the service needs them. Use cases define their own param shape separately (they don't import repo params).
4. **Paginated lists**: repository returns `DataState<PaginatedData<Entity>>`. The matching service-result type is defined in the Service interface (see `create-service`).

### Error handling

5. **Impl**: wrap every try/catch this way:
   - Rethrow a `ServerError` as `new DataFailed(err)`.
   - Any other error becomes `new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }))`.
6. **Impl's job is pure translation**: Model → Entity, thrown error → `DataFailed`. No HTTP, no JSON handling — that's the Service's job.

### Interface Segregation

7. When a feature has distinct sub-resources (master + entries, parent + children), **split into separate repository interfaces, impls, and files**. One file per concern.

## Template

```ts
// src/features/{feature}/domain/repositories/{noun}.ts
import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";

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

```ts
// src/features/{feature}/data/repositories/{noun}.ts
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";
import {
  {Noun}Repository,
  List{Nouns}Params,
  Create{Noun}Params,
  Delete{Noun}Params,
} from "@/features/{feature}/domain/repositories/{noun}";
import { {Noun}Service } from "@/features/{feature}/domain/sources/{noun}";

export class {Noun}RepositoryImpl implements {Noun}Repository {
  constructor(private readonly service: {Noun}Service) {}

  public async list(params: List{Nouns}Params, session: SessionEntity): Promise<DataState<PaginatedData<{Noun}Entity>>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({ data: result.data.map((m) => m.toEntity()), meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
  // ... get, create, delete follow the same pattern
}
```

## References

- [`references/domain-repository.ts`](references/domain-repository.ts) — interface + param types.
- [`references/data-repository.ts`](references/data-repository.ts) — impl mapping Model → Entity and wrapping errors.

## Common pitfalls

- **Mixing in HTTP concerns** — if you see `HttpRequest`, `fetch`, or URL paths in a repository impl, that belongs in the Service. Move it.
- **Session in the middle of the params list** — it must be last.
- **More than 2 params** — bundle business args into one object.
- **Forgetting `.map((m) => m.toEntity())`** — outside `data/`, callers only see entities. The impl is the only place this conversion happens.
- **Importing repo params into the use case file** — use cases define their own input type (see `create-usecase`).
- **Not splitting sub-resources** — a master + entries feature needs two repositories, not one bloated one.

## After creating

Next step is to create the matching **Service** — invoke the `create-service` skill. Service handles the HTTP side (URL paths, search params, JSON parsing). A Repository without its Service cannot be instantiated.

After that, the feature is ready to expose to the presentation layer via a use case (`create-usecase`).
