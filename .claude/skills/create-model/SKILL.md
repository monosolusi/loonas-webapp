---
name: create-model
description: Create a data-layer Model class with fromJson and toEntity under `src/features/{feature}/data/models/`. Use when wrapping an API JSON response so it can be parsed and then converted to a domain Entity. Triggers include "create model", "data model", "fromJson", "parse API response", "buat model".
---

# Create Model

Models are data-layer classes that parse raw API JSON (`fromJson`) and convert to their matching domain Entity (`toEntity`). Entities are exposed to the rest of the app; Models are internal to `data/`.

## When to use

- The feature's API returns JSON for a resource that also has a matching Entity.
- Adding a nested child model that a parent model references (e.g. `ProductionRecordItemModel` inside `ProductionRecordModel`).

If the Entity does not exist yet, create it first with `create-entity`.

## File location & naming

| Item | Rule |
| --- | --- |
| Path | `src/features/{feature}/data/models/{noun}.ts` |
| Filename | kebab-case, singular noun (e.g. `production-record-item.ts`) — mirrors the entity filename |
| Class name | `{Noun}Model` (PascalCase + `Model` suffix) |
| Constructor arg type | `{Noun}ModelConstructor` |

## Rules

1. Class must `implement AbstractModel` from `@/core/resources/model`.
2. **All properties are `public readonly`** (same as entities).
3. Expose two required methods:
   - `public static fromJson(data: Record<string, any>): {Noun}Model` — parse snake_case API keys.
   - `public toEntity(): {Noun}Entity` — produce the matching domain entity.
4. For nested objects from the API, reference the **actual Model class** (e.g. `VariantModel`, `RawMaterialModel`) — never plain objects or ad-hoc shapes. Parse them with their own `fromJson`, then call `toEntity()` in `toEntity()`.
5. Arrays: guard with `Array.isArray(...)` in `fromJson`, then `.map(ChildModel.fromJson)`. In `toEntity()`: `.map((item) => item.toEntity())`.
6. Dates: API returns ISO strings → parse with `DateTime.fromISO(data["field"] ?? "")`. Store as `DateTime`. Never store as `string`.
7. Nullable fields from API: `data["field"] ?? null` (for `T | null`), or `data["field"] ?? 0` / `?? ""` for numeric/string defaults.
8. snake_case → camelCase happens **only** in `fromJson`. The model's TS fields are camelCase.
9. Use `@/` path alias. No relative imports.

## Template

```ts
import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
// import nested models & entity target:
// import { ChildModel } from "@/features/{feature}/data/models/child";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";

type {Noun}ModelConstructor = {
  id: string;
  // ... camelCase fields matching entity shape
  createdAt: DateTime;
  updatedAt: DateTime;
};

export class {Noun}Model implements AbstractModel {
  public readonly id: string;
  // ... fields
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;

  constructor(args: {Noun}ModelConstructor) {
    this.id = args.id;
    // ... assignments
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): {Noun}Model {
    // For arrays, guard first:
    // const items = Array.isArray(data["items"]) ? data["items"].map(ChildModel.fromJson) : [];
    return new {Noun}Model({
      id: data["id"],
      // ... parse snake_case → camelCase
      createdAt: DateTime.fromISO(data["created_at"] ?? ""),
      updatedAt: DateTime.fromISO(data["updated_at"] ?? ""),
    });
  }

  public toEntity(): {Noun}Entity {
    return new {Noun}Entity({
      id: this.id,
      // ... pass fields through; for nested, call .toEntity()
      // variant: this.variant.toEntity(),
      // items: this.items.map((i) => i.toEntity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
```

## References

- [`references/simple-model.ts`](references/simple-model.ts) — model with flat fields and one nested model.
- [`references/model-with-nested.ts`](references/model-with-nested.ts) — model with child model array + `Array.isArray` guard.

## Common pitfalls

- **Plain object for nested fields** — always use the real Model class, never inline `{ id, name }` shapes. The matching Entity must receive real entities via `toEntity()`.
- **Missing array guard** — if `data["items"]` is unexpectedly not an array, `.map()` throws. Use the `Array.isArray` pattern.
- **Forgetting `toEntity()` for nested** — in the top-level `toEntity()`, remember to call `.toEntity()` on each nested model (and `.map((i) => i.toEntity())` for arrays).
- **Passing snake_case through to the Entity** — fields on the Entity are camelCase. Do the rename once, in `fromJson`.
- **`new Date(...)` or `Date.parse`** — use Luxon's `DateTime.fromISO`.

## After creating

Usually the next step is wiring this model into the repository/service layer (invoke `create-repository`) so the feature can actually fetch it.
