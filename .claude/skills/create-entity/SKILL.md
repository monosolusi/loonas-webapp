---
name: create-entity
description: Create a new domain entity class in the Clean Architecture domain layer. Use when adding a new business object, value object, or domain model under `src/features/{feature}/domain/entities/`. Triggers include "new entity", "create entity", "add a domain entity", "buat entity baru".
---

# Create Entity

Entities represent domain business objects. They are pure TypeScript classes with no framework or transport concerns. The data layer produces entities; the presentation layer consumes them.

## When to use

- Adding a new first-class domain concept (e.g. `InvoiceEntity`, `ProductionRecordEntity`).
- Adding a value object or nested child entity referenced by a parent entity.

Do **not** use this skill for: API response DTOs (those are Models — use `create-model`), or UI-only types (those live with the component).

## File location & naming

| Item | Rule |
| --- | --- |
| Path | `src/features/{feature}/domain/entities/{noun}.ts` |
| Filename | kebab-case, singular noun (e.g. `production-record-item.ts`) |
| Class name | `{Noun}Entity` (PascalCase + `Entity` suffix) |
| Constructor arg type | `{Noun}EntityConstructor` (a `type`, not a class) |

## Rules

1. Class must `implement AbstractEntity` from `@/core/resources/entity`.
2. **All properties must be `public readonly`** — entities are immutable. No setters, no mutation methods.
3. Constructor accepts a single `args: {Noun}EntityConstructor` object. Do not use positional parameters.
4. For nested domain objects, reference the **actual entity class** (e.g. `VariantEntity`), not a plain shape. Arrays of children: `ItemEntity[]`.
5. Dates: use `DateTime` from `luxon`, not `string` or `Date`. The model layer parses ISO strings into `DateTime` during `toEntity()`.
6. Nullable fields: use `T | null` (prefer `null` over `undefined` for absent values from API).
7. Optional getter methods are allowed for derived/computed fields (e.g. `get productName(): string`). Keep them pure — no I/O, no side effects.
8. Never import from `@/features/{feature}/data/**` or from presentation layers — domain must not depend on outer layers.
9. Use the `@/` path alias. No relative imports.

## Template

```ts
import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
// import nested entities if any:
// import { ChildEntity } from "@/features/{feature}/domain/entities/child";

type {Noun}EntityConstructor = {
  id: string;
  // ... fields (camelCase)
  createdAt: DateTime;
  updatedAt: DateTime;
};

export class {Noun}Entity implements AbstractEntity {
  public readonly id: string;
  // ... fields mirrored as public readonly
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;

  constructor(args: {Noun}EntityConstructor) {
    this.id = args.id;
    // ... assignments
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  // Optional derived getters:
  // get someComputed(): string { return ...; }
}
```

## References

- [`references/simple-entity.ts`](references/simple-entity.ts) — minimal entity (flat fields, one nested entity).
- [`references/entity-with-nested.ts`](references/entity-with-nested.ts) — entity with array of child entities and a derived getter.

## Common pitfalls

- **Plain object nested refs** — do not use `{ id: string; name: string }` for a nested concept that has its own Model/Entity elsewhere. Reference the real entity class.
- **Mutable fields** — no `public` without `readonly`. No `private` mutable state either.
- **snake_case fields** — entity fields are camelCase. Snake-case only appears in the model's `fromJson`.
- **Business logic beyond computed getters** — heavy logic belongs in use cases or factories, not on the entity.

## After creating

Usually the next step is to create the matching Model (invoke `create-model`). If this entity introduces a new data-fetching concern, also create the Repository and Use Cases.
