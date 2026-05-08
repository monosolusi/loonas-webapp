---
name: architecture-review
description: |
  Review recently written or modified code against Clean Architecture and
  this project's conventions. Produces a structured violation report —
  REVIEW ONLY, never implements fixes.

  Triggers: "review architecture", "architecture review", "check
  architecture", "audit code", "compliance review", "review compliance",
  "review the changes", "review changed files", "review my changes",
  "tinjau arsitektur", "audit kode", "review kode", "cek arsitektur",
  "cek compliance".

  Use proactively after any feature implementation, refactoring, or code
  changes — without being asked. Run before opening a PR.

  DO NOT use this for:
  - Fixing violations — this skill is review-only. Fix work is a separate
    task triggered by the user after the review is read.
  - Reviewing the entire codebase — only review files recently created or
    modified (check `git status` / `git diff`).
  - Style preferences — only flag actual rule violations.
  - Security review — use the `security-review` skill instead.
  - PR review — use the `review` skill instead.
---

# Architecture Review

Single-purpose skill: review recently changed code against this project's
Clean Architecture rules and codebase conventions, and emit a structured
violation report. **REVIEW ONLY — DO NOT IMPLEMENT, EDIT, OR PROPOSE
PATCHES.** The user reads the report and decides what to act on.

## Hard rules (read before doing anything)

1. **Do not write or edit code.** No `Edit`, `Write`, `Bash` mutations of
   source files. The only writes allowed are reading via `Read`, scanning
   via `Bash` (read-only commands like `git diff`, `grep`, `cat`), and
   producing the final markdown report as your text output.
2. **Do not run `npm install`, `git commit`, `git push`, or any state-
   changing command.** This is purely an analysis pass.
3. **Do not propose code patches.** The Fix column describes what should
   change in human language only ("rename file to X", "extract to
   provider", "split into 3 components") — never paste replacement code.
4. **Do not review the whole codebase.** Only review files that show up
   in `git status` / `git diff` against the merge-base with `dev`. If the
   user asks "review file X" explicitly, scope to that file only.
5. **Do not flag stylistic preferences.** Only flag actual violations of
   the rules in this file. If a pattern is ambiguous, omit it.
6. **Indonesian (Bahasa Indonesia) text in comments and UI strings is
   expected** — never flag as a violation.
7. **Do not modify this skill or related skills as part of the review.**
   If you discover a discrepancy between this skill's rules and a
   scaffolding skill (e.g. `create-entity`), note it under "Skill/rule
   discrepancies" in the Summary — do not edit either file.
8. **Output is the markdown report only.** No preamble like "Let me
   review…", no chatter after the report. The report IS the response.

## Authoritative scaffolding skills

The rules below are the enforcement contract. The **authoritative "how
to build this correctly" documentation** lives in the project's skill
directory and is where an author should be directed when they violate a
rule. Each skill contains rationale, template, canonical references, and
pitfalls for one layer.

| Concern / violation pattern | Skill file |
| --- | --- |
| Domain entity shape, readonly fields, nested entity refs, Luxon dates | `.claude/skills/create-entity/SKILL.md` |
| Data model with `fromJson` / `toEntity`, nested model parsing, array guards | `.claude/skills/create-model/SKILL.md` |
| Domain repository interface + data impl, session-last 2-param signatures, `DataState` wrapping, Model → Entity mapping | `.claude/skills/create-repository/SKILL.md` |
| Service interface (`domain/sources/`) + HTTP impl (`data/sources/`), `HttpRequest` usage, snake_case API keys, `Model.fromJson`, `ListXxxServiceResult` shape | `.claude/skills/create-service/SKILL.md` |
| Use case structure (`resolveSession`, own params, never-throw, `DataState<T>`) | `.claude/skills/create-usecase/SKILL.md` |
| Paginated SWR list hook + types + SWR key constants | `.claude/skills/create-hook-list/SKILL.md` |
| Single-entity SWR get hook with id-nullable key | `.claude/skills/create-hook-get/SKILL.md` |
| Mutation hook via `useSWRMutationClerk` (create / update / delete) | `.claude/skills/create-hook-mutation/SKILL.md` |
| Component rules: one-per-file, `useMemo`, `clsx`, `h-11`, `SectionCard`, `ActionMenu`, no deprecated primitives | `.claude/skills/create-component/SKILL.md` |
| Provider patterns: page-detail guarantee, list filter state, create/form submit + revalidation | `.claude/skills/create-provider/SKILL.md` |

**When you flag a violation, cite the matching skill file in the `Skill`
column of the output table.** That is where the author must look to
learn the correct shape. Do not paste skill contents into the report —
just reference the path. If a violation does not map to any of the 10
skills (e.g. an SVG color token issue under Rule 12), use `—` in the
Skill column.

If a rule below and a skill disagree, the **skill is the source of
truth** (skills were updated more recently). Note the discrepancy in the
Summary so this file can be reconciled later.

---

## Section 1: Clean Architecture Rules

### Layer Structure

Each feature in `src/features/` MUST follow this three-layer pattern:

```
src/features/{feature}/
├── domain/           # Entities, guards, types, enums, repository interfaces, source interfaces, use cases, factories
├── data/             # Repository impls, source impls (services), models, types
└── presentations/    # hooks/, components/, providers/
```

#### `domain/` layer
- Entities are plain TypeScript classes/types representing business objects
- Use cases implement a single responsibility and return `DataSuccess<T>` or `DataFailed` (never throw)
- Repository interfaces define contracts that `data/` layer implements
- Source interfaces (`domain/sources/`) define service contracts — these MAY import `data/models` since they define the data contract
- Type guards in `domain/guards/` use `instanceof` checks for discriminating entity types
- **Domain layer MUST NOT import from presentation layer**

#### `data/` layer
- Repository implementations fulfill domain repository interfaces
- Sources (services) handle HTTP communication via `HttpRequest`
- Models represent API response shapes with mapping to/from entities
- Sources return models, repositories convert models to entities

#### `presentations/` layer
- **Providers** hold business logic: state, data fetching, mutations, computed values, handlers
- **Impl components** (`*-impl.tsx`) are thin layout wrappers that consume providers and pass props to children
- **Hooks** wrap use cases with SWR for data fetching (`use-{verb}-{noun}.ts`)
- **Components** are presentational — they receive props, render UI, no business logic
- Hook return types use discriminated unions (`InitialState | LoadedState | ErrorState`)

**Note**: Older features use `presentation/` (singular), newer ones use `presentations/` (plural). Match the existing directory name when adding to a feature. Do NOT flag existing code that follows the singular form — only flag if NEW code creates a mismatched directory.

### Data Flow

```
Hook (SWR) → Use Case → Repository (interface) → Repository impl → Source (HTTP) → API
```

For UI state management:
```
Provider (context) → Impl component (layout) → Child components (display)
```

### SOLID Principles

1. **Single Responsibility (SRP)**: Each class/module has one reason to change. Impl components should NOT hold business logic — that belongs in providers.
2. **Open/Closed (OCP)**: Code is open for extension, closed for modification. Use factories for polymorphic creation.
3. **Liskov Substitution (LSP)**: Repository implementations must be substitutable for their interfaces.
4. **Interface Segregation (ISP)**: Interfaces should be focused. Split repository/source interfaces when they serve different concerns (e.g., `FixedCostRepository` for master CRUD vs `FixedCostEntryRepository` for entry CRUD). Each interface gets its own file, service impl, and repository impl. Hook return types should only expose what consumers need.
5. **Dependency Inversion (DIP)**: Domain layer depends on abstractions (repository/source interfaces), not concrete implementations.
   - **Exception**: Domain source interfaces (`domain/sources/`) MAY import `data/models` — this is intentional in this codebase. Do NOT flag these imports as DIP violations.

---

## Section 2: Codebase Convention Rules

These are project-specific rules that go beyond general architecture.

### Rule 1: Import paths

- ALWAYS use `@/` path alias (maps to `src/`). No relative imports.
- Anti-pattern: `import { Foo } from "../../core/helpers/foo"`
- Correct: `import { Foo } from "@/core/helpers/foo"`

### Rule 2: Deprecated patterns

The following patterns MUST NOT appear in new or modified code:

| Deprecated | Replacement |
|------------|-------------|
| `Card` (shadow-based, `text-gray-*`) | `SectionCard` |
| `FilledButton` | `PrimaryButton` / `SecondaryButton` / `DangerButton` from `core/presentations/components/buttons/` |
| `LocalStorageSessionService` | `ClerkSessionService` |
| Lottie animations (`@lottiefiles/react-lottie-player`) | Skeleton loading (`animate-pulse`) |
| `OutlinedButton` | `SecondaryButton` with `outlined` prop |
| Template literal classNames (`` `${a} ${b}` ``) | `clsx(a, b)` |
| `text-gray-*` color classes | `text-neutral-*` equivalents |
| `X-Account-Id` header | Backend resolves account from Clerk JWT `orgId` — do not add account headers |
| `selectedAccount` on `SessionEntity`/`SessionModel` | Account resolved server-side from JWT |
| `requireAccount` in `HttpRequest` config | Removed — account resolution is implicit via JWT |
| `SelectedAccountProvider` context value | Use `useGetCurrentAccount()` for account data |
| `*-impl.tsx` monolith pattern (**new code only**) | Provider + split components. Page composes provider + components, each consumes context. Do NOT flag existing `*-impl.tsx` files — they will be migrated gradually. Only flag if a NEW page uses this pattern. |
| `InvoiceTableShell` (**new code only**) | `TableToolbar`, `TableSearch`, `TableHeader`, `TableContainer` from `core/presentations/components/table/`. Do NOT flag existing pages using `InvoiceTableShell` — they will be migrated gradually. Only flag if a NEW page imports `InvoiceTableShell`. |

### Rule 3: File naming conventions

| Type | Pattern | Example |
|------|---------|---------|
| Use cases | `{verb}-{noun}.usecases.ts` (new) or `{verb}-{noun}.ts` (legacy) | `get-invoice.usecases.ts` |
| Hooks | `use-{verb}-{noun}.ts` | `use-get-invoice.ts` |
| Hook types | `use-{verb}-{noun}.types.ts` | `use-get-invoice.types.ts` |
| Entities | `{noun}.ts` | `invoice.ts` |
| Guards | `domain/guards/{noun}-guards.ts` | `invoice-guards.ts` |
| Repo interfaces | `domain/repositories/{noun}.ts` | `invoice.ts` |
| Repo impls | `data/repositories/{noun}.ts` | `invoice.ts` |
| Sources | `data/sources/{noun}.ts` | `invoice.ts` |
| Factories | `{noun}-factory.ts` | `pay-in-detail-factory.ts` |
| Providers | `presentations/providers/{noun}.tsx` | `product-detail.tsx` |
| Provider types | `presentations/providers/{noun}.types.ts` | `product-detail.types.ts` |

Directories and component files use kebab-case.

### Rule 4: Repository and source method signatures

Repository and source methods MUST have **maximum 2 parameters**: `(params, session)`.
- `session: SessionEntity` is always the **last** parameter
- All business parameters must be grouped into a single object
- Correct: `update({ id, name, status }, session)`, `list({ search, page }, session)`
- Anti-pattern: `update(id, params, session)` — 3 parameters, `id` should be inside params
- Anti-pattern: `list(session, search)` — session is not last

### Rule 5: HTTP request patterns

- Use `HttpRequest` class — it injects Clerk session headers automatically
- Only `Authorization: Bearer {token}` header — no `X-Account-Id`
- Base URL from `NEXT_PUBLIC_BASE_API_URL`
- Services that bypass `HttpRequest` (manual `fetch`) must still set `Authorization` header
- `FetchConfig` supports `requireAuth` (default `true`), `contentType`, and `headers`

### Rule 6: UI component conventions

- Use `SectionCard` for detail page cards (`rounded-lg`, `border-neutral-200`, icon header)
- Loading states use `animate-pulse` placeholder divs inside `SectionCard`
- Interactive elements (buttons, inputs, selects, custom controls) use `h-11` (44px) for consistent height. Exception: icon-only action buttons (edit, delete) in tables use `size-8` (32px) — do NOT flag these as violations.
- Use `clsx()` for className composition, never template literals

### Rule 7: Provider pattern

Two levels of providers exist:

**Feature-level providers** — in `src/features/{feature}/presentations/providers/`:
- Used when a feature needs shared state across components
- Provider exports a `use{Name}Provider()` hook via `createContext`/`useContext`
- Provider has a companion `.types.ts` file for context and provider prop types
- Impl component wraps children with the provider and consumes context for rendering
- Reference pattern: `src/features/invoice/presentations/providers/create-incoming-invoice.tsx`

**Page-level providers** — in `src/app/(authenticated)/{route}/_providers/`:
- Used when a page needs centralized state management (e.g., form state, dirty tracking, save logic)
- Provider manages hooks, state, computed values, and action functions
- Components in `_components/` consume context individually via the provider's hook
- `page.tsx` wraps children with the provider and composes components — no business logic in page
- Anti-pattern: a single `PageContent` wrapper component that consumes context and passes props to children
- Correct: each child component consumes context itself, page only composes layout
- Reference pattern: `src/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider.tsx`

### Rule 8: SWR key management

- SWR keys are defined as constants in `presentations/constants/swr-keys.ts`
- Use `revalidateSWRKey()` to invalidate cache after mutations
- Hooks use these constants, never hardcoded strings

### Rule 9: DataState pattern

- Use cases return `DataSuccess<T>` or `DataFailed` — they never throw
- `ServerError` + `ErrorCodes` provide centralized error registry with Indonesian messages
- Hooks/providers handle `DataFailed` and show user-facing errors via `useToast`

### Rule 10: Use case params independence

- Use case param types MUST be defined in the use case file itself
- Use cases MUST NOT import param types from repositories or sources
- Anti-pattern: `import { UpdateProductParams } from "@/features/product/domain/repositories/product"` inside a use case
- Correct: the use case defines its own params type that represents what the domain needs, then maps to repo/source params internally

### Rule 11: Use case structure

- `execute()` should read like a clean workflow — delegate complex logic to private methods
- Private methods return plain types (NOT `DataState`) — handle `DataState` internally
- Private methods throw on `DataFailed` instead of returning it
- Private method params follow `(params: { key: value })` pattern
- Anti-pattern: a 50-line `execute()` with inline date computation, query building, and error handling
- Correct: `execute()` calls `this.fetchItems()`, `this.enrichWithRelations()`, `this.buildResult()`, etc.

### Rule 12: Color token consistency

- SVG icon files must use the correct hex color for their filename label
- `primary-300` = `#007BFF`, `primary-400` = `#005ABB`, etc. (as defined in `globals.css` `@theme`)
- Anti-pattern: a file named `*-primary-300-*.svg` containing `#005ABB` (that's primary-400)

---

## Review Process

### 1. Determine scope (read-only)

```bash
git status --short
git diff --name-only
git diff --name-only origin/dev...HEAD 2>/dev/null
```

If the user named a specific path, scope to that path only. Otherwise
include every file from `git status` plus everything in the diff against
`origin/dev`. Do NOT walk the entire `src/` tree.

### 2. Read each file

Use `Read` (or `Bash` with `cat`/`grep` for small reads). Do not edit.
For each file, identify which layer it belongs to (`domain` / `data` /
`presentations` / `app`) and which conventions apply.

### 3. Map findings to rules

For every potential issue, check it against:

1. **Section 1** — Clean Architecture (layer separation, SOLID)
2. **Section 2** — Codebase conventions (Rules 1–12)

Each flagged finding must cite a specific rule number or principle and
the matching scaffolding skill in the `Skill` column.

### 4. Filter out non-violations

Before writing the report, drop any finding that is:
- A stylistic preference rather than a rule violation
- An issue in a file the user did not change
- Related to the `presentation/` (singular) directory in pre-existing code
- Indonesian text in UI / comments
- Icon-only action buttons using `size-8` (allowed exception)
- An `*-impl.tsx` file or `InvoiceTableShell` usage in pre-existing code

### 5. Emit the report

Output is **one markdown block** following the format below — and
nothing else. No "I'll now review…" preface, no closing remark.

## Output Format

```
## Architecture Review Report

### Clean Architecture Violations

| # | File | Principle | Issue | Fix | Skill |
|---|------|-----------|-------|-----|-------|
| 1 | `path/to/file.ts` | SRP | [issue] | [fix description, no code] | `.claude/skills/{name}/SKILL.md` |

### Codebase Convention Violations

| # | File | Rule | Issue | Fix | Skill |
|---|------|------|-------|-----|-------|
| 1 | `path/to/file.ts` | Rule N: [rule name] | [issue] | [fix description, no code] | `.claude/skills/{name}/SKILL.md` |

### Summary
- Total files reviewed: X
- Clean Architecture issues: X
- Convention issues: X
- Overall: ✅ Clean / ⚠️ Minor Issues / ❌ Major Issues
- Skill/rule discrepancies: [list any cases where this skill's rules and a scaffolding skill disagree, or "None"]
```

Rules for the report:

- Be specific — reference exact component names, import paths, and line patterns where possible.
- The Fix column describes the change in human language only. Never paste replacement code.
- If no violations found in a section, write "No violations found." instead of an empty table.
- The `Skill` column must reference one of the 10 skill files from the "Authoritative scaffolding skills" table. Use `—` for violations that don't map to a skill (e.g. SVG color token issues under Rule 12).
- The Summary's "Overall" verdict is an honest call: clean if zero issues, minor if violations are stylistic-but-real, major if a layer boundary is broken.

## After emitting the report

Stop. The user reads the report and decides what to fix. **Do not offer
to apply fixes, do not suggest follow-up edits, do not propose patches.**
If the user wants fixes, they will explicitly ask in a separate turn —
that is a different task, not part of this skill.
