# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js + Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # Type-check (tsc --noEmit) — use to verify after edits
npm run test         # Vitest (node environment, pure units only)
```

Verify changes with `npm run typecheck`, `npm run lint` and `npm run test`.

Tests are **pure units only** — parsers, domain calculations, payload construction. There is
no DOM, Clerk or network harness, so anything needing a rendered tree or a live session is
verified by manual smoke instead. Suites are `src/**/*.test.ts` next to the code they cover.

**CI gate** (`.github/workflows/ci.yml`): runs `lint → typecheck → test → build` on PRs to
`dev`/`main`/`release/**`. Node version pinned via `.nvmrc` (currently 20.20.2, engines `>=20.19.4`).

## Tech Stack

- **Next.js 15** (App Router) / **React 19** / **TypeScript 5** (strict)
- **Tailwind CSS 4** with `prettier-plugin-tailwindcss` for class sorting
- **clsx** for className composition (preferred over template literals)
- **Headless UI** (`@headlessui/react`) + **Heroicons** (`@heroicons/react`) for UI primitives
- **Clerk** for authentication (middleware + session management)
- **SWR** for client-side data fetching
- **Luxon** for dates, **Joi** for validation

## Architecture

Clean Architecture with feature-based modules. Three layers per feature:

```
src/
├── app/                              # Next.js pages & layouts
│   ├── (authenticated)/              # Protected routes (Clerk)
│   │   └── {route}/
│   │       ├── page.tsx              # Composition only — wraps provider + components
│   │       ├── _providers/           # Page-level context providers
│   │       └── _components/          # Components that consume context
│   ├── (authentication)/             # Sign-in, reset-password
│   ├── (user)/                       # Onboarding
│   ├── (pos)/                        # Cashier POS shell + payment-method plugins (see _payment-methods/PLUGIN_PATTERN.md)
│   └── (external-app)/              # Public external routes
├── features/{feature}/               # Feature modules
│   ├── domain/                       # Entities, guards, types, enums, repository interfaces, use cases, factories, helpers
│   ├── data/                         # Repository impls, services (sources), models, types
│   └── presentations/                # hooks/, components/, providers/
└── core/                             # Shared utilities, base classes, global components
```

### Data Flow

**Use case → Repository (interface) → Repository impl → Service (HTTP) → API**

Hooks wrap use cases with SWR:

```
useGetInvoice → SWR fetcher → GetInvoiceUseCase → InvoiceRepositoryImpl → InvoiceServiceImpl → HTTP
```

### Key Patterns

- **Presentation layer naming**: Older features use `presentation/` (singular), newer ones use `presentations/` (
  plural). Match the existing directory name when adding to a feature.
- **Entity immutability**: All entity properties must be `public readonly`. Models are also `public readonly`.
- **Model nested references**: When a model has nested objects from API, use actual Model classes (e.g.,
  `RawMaterialModel`, `VariantModel`) with their `fromJson()`, not plain objects. `toEntity()` maps to domain types.
- **DataState pattern**: Use cases return `DataSuccess<T>` or `DataFailed` instead of throwing
- **Hook return types**: Discriminated unions (`InitialState | LoadedState | ErrorState`)
- **ServerError + ErrorCodes**: Centralized error registry with Indonesian messages
- **Factory pattern**: `PayInDetailFactory` etc. for polymorphic creation
- **`domain/helpers/`**: pure, stateless calculations over domain entities — no DI, no
  repository, no `DataState`, no imports from `data/` or `presentations/`. Use when logic is
  domain knowledge but belongs to no single entity (see
  `features/product/domain/helpers/price-tier-preview.ts`). Anything that needs a repository
  is a use case instead.
- **Impl components**: `*-impl.tsx` files are smart components that fetch data and pass to presentational siblings
- **Type guards**: `domain/guards/` contains `instanceof` checks for discriminating entity types
- **SectionCard**: Standard card component (`rounded-lg`, `border-neutral-200`, icon header) for detail pages
- **Skeleton loading**: Loading states use `animate-pulse` placeholder divs inside `SectionCard`
- **Fetch-error state inside a card**: when a `SectionCard`-scoped fetch fails, render a sibling error component
  (`{noun}-error.tsx`) rather than collapsing to `null` — a hidden card is indistinguishable from an empty one.
  Canonical shape (see `accounting/profitability/[productId]/[variantId]/_components/cogs-block-error.tsx`):
  `flex flex-col items-center gap-y-3 py-4` inside the card, `ExclamationCircleIcon` from `@heroicons/react/20/solid`
  at `size-5 text-error-300`, and a `SecondaryButton outlined className="h-11" label="Coba Lagi"` wired to the hook's
  `refresh`. Do **not** copy the full-page error pattern (`receipt-error.tsx`) for an in-card error — that one is
  page-scoped and carries a navigation action. Omit the retry button when the error is terminal (a `NOT_FOUND` will
  never succeed on retry). `SectionCard` already applies `p-6` to its body, so the inner block only needs `py-4`.
- **Interactive element height**: All interactive elements (buttons, inputs, selects, custom controls) use `h-11` (44px)
  for consistent vertical rhythm. Exception: icon-only action buttons (edit, delete) in tables use `size-8` (32px).
- **Account resolution**: Backend resolves account from Clerk JWT `orgId` (set via `setActive({ organization })`).
  Frontend never sends account ID in headers or params — only `Authorization: Bearer {token}`
- **Session parameter order**: In repository and service method signatures, `session: SessionEntity` must always be the
  **last** parameter. Methods have **maximum 2 parameters**: `(params, session)`. All business parameters grouped into a
  single object: `list({ search, page }, session)`, `update({ id, name, status }, session)`.
- **SWR key management**: SWR keys defined as constants in `presentations/constants/swr-keys.ts`. Use
  `revalidateSWRKey()` to invalidate cache after mutations. Hooks use these constants, never hardcoded strings.
- **`revalidateSWRKey()` can reject — never `await` it unguarded inside a `catch`**: it wraps SWR's global
  `mutate(filter)`, which triggers a **refetch**, not a cache write, and `internalMutate` defaults to
  `throwOnError: true`. If the refetch fails (e.g. recovering from a 404 — the entity is still gone), the `await`
  throws and everything after it is skipped. In an error-recovery path, show the toast and set state **first**
  (synchronous, cannot fail), then attempt the revalidation inside its own `try {} catch {}`. On the success path
  it is fine unguarded, since the surrounding `catch` already handles it.
- **UseCase params independence**: Use case param types are defined in the use case file itself. Use cases MUST NOT
  import param types from repositories or sources. The use case defines its own params, then maps to repo params
  internally.
- **UseCase workflow**: `execute()` should read like a clean workflow — delegate to private methods. Common pattern:
  `resolveSession()` as private method that throws on failure, then private action methods that call repository.
- **Provider pattern (feature-level)**: When a feature needs shared state across components, extract to a provider in
  `features/{feature}/presentations/providers/`. Provider exports a `use{Name}()` hook via `createContext`/`useContext`.
- **Provider pattern (page-level)**: Complex pages use `_providers/` folder next to `_components/`. Provider manages
  state, hooks, and actions. Components in `_components/` consume context individually. Page (`page.tsx`) only composes
  provider + components — no business logic.
- **Provider guarantee pattern**: Detail page providers accept a `loading: React.ReactNode` prop. Provider renders
  loading indicator until data is ready, then renders children with guaranteed non-nullable context data. Children never
  need null checks.
- **Provider data locality**: Provider only hosts data shared across multiple components. If data is used by only one
  component, that component fetches it locally.
- **Component context rule**: When a component needs context data, it consumes context itself inside `_components/`.
  Page does not wrap children in a single content component — each component is self-contained.
- **Component architecture**: One component per file. Use `useMemo` for computed/derived data. No conditional rendering
  of multiple states in return — split into separate components instead (e.g., loading, empty, list components).
- **Interface Segregation (repositories)**: When a feature has distinct sub-resources (e.g., master + entries), split
  into separate repository/source interfaces, implementations, and files. Each concern gets its own file:
  `fixed-cost.ts` (master) + `fixed-cost-entry.ts` (entries).
- **Display vs Implementation pattern**: When a dialog/form is used across different contexts (e.g., list page vs detail
  page), extract a display component (props-based, no context) and create separate implementation components that
  consume their respective providers. Display component naming: `{noun}-form-dialog.tsx`. Implementation naming:
  `{noun}-edit-dialog.tsx`.
- **POS payment methods**: plugin pattern — see `src/app/(pos)/pos/_payment-methods/PLUGIN_PATTERN.md` before adding or
  modifying a payment method. The wizard chrome (header, step layout, transitions) is method-agnostic; each method is a
  self-contained handler in `_payment-methods/{type}/`.
- **Chrome page title**: when adding a new route under `(authenticated)/`, also add an entry to `ROUTE_MAP` in
  `src/app/(authenticated)/_components/header-title.tsx` — otherwise the chrome header silently falls back to
  "Dashboard". `ROUTE_MAP` is keyed by **literal pathnames only** — it does NOT match `[param]` bracket keys
  (`usePathname()` returns real ids, e.g. `/finance/journals/abc-123`, so a `"/finance/journals/[id]"` key never
  matches and the title falls back). For a dynamic route, add a `segments[]`-based `if` block in the `useMemo`
  (mirror `/accounts/:id`), not a bracket key.
- **List-page header/toolbar standard**: every list/index page uses one layout. Heuristic: **action top-right,
  filters bottom-left, search bottom-right.**
  - **Row 1 — header**: `ListPageHeader` (`core/presentations/components/list-page-header.tsx`) for top-level pages,
    or `DetailPageHeader` for `/settings/*` sub-pages. The primary create/add button ALWAYS goes in the header's
    `action` slot (right) — **never in the toolbar**. It is a `PrimaryButton` with `className="w-full sm:w-auto"` and
    the plus icon `<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />` (never a
    Heroicons `PlusIcon`, never icon-less). Wrap in `<Link>` when it navigates; keep the `onClick` (no `Link`) when it
    opens a dialog — and colocate the dialog + its open-state in the header component.
  - **Row 2 — toolbar**: the shared `TableToolbar` (`core/presentations/components/table/table-toolbar.tsx`). Filters
    (`DateRangePicker`, `FilterDropdown`, `TabFilter`, toggles) go in a LEFT group
    (`<div className="flex flex-row flex-wrap items-center gap-3">…</div>`); search goes on the RIGHT and is ALWAYS the
    shared `TableSearch` (`core/presentations/components/table/table-search.tsx`, `sm:w-[280px]`, right-pinned via
    `sm:ml-auto`) — never an inline `TextInput` search copy, never a bespoke search box.
  - **Row 3 (optional)**: active-filter `FilterPill` row below the toolbar.

### HTTP Requests

Custom `HttpRequest` class injects Clerk session headers:

- `Authorization: Bearer {token}` (account resolved from Clerk JWT `orgId` on the backend)
- Base URL from `NEXT_PUBLIC_BASE_API_URL`
- `FetchConfig` supports `requireAuth` (default `true`), `contentType`, and `headers` — no account-level config
- Services that bypass `HttpRequest` (manual `fetch`) must still set `Authorization` header manually

### Deprecated — Do Not Use

| Deprecated                                             | Replacement                                                                                                                                            |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Card` (shadow-based, `text-gray-*`)                   | `SectionCard`                                                                                                                                          |
| `FilledButton`                                         | `PrimaryButton` / `SecondaryButton` / `DangerButton` from `core/presentations/components/buttons/`                                                     |
| `LocalStorageSessionService`                           | `ClerkSessionService` (will throw "No valid session")                                                                                                  |
| Lottie animations (`@lottiefiles/react-lottie-player`) | Skeleton loading (`animate-pulse`)                                                                                                                     |
| `OutlinedButton`                                       | `SecondaryButton` with `outlined` prop                                                                                                                 |
| Template literal classNames (`` `${a} ${b}` ``)        | `clsx(a, b)`                                                                                                                                           |
| `text-gray-*` color classes                            | `text-neutral-*` equivalents                                                                                                                           |
| `X-Account-Id` header                                  | Backend resolves account from Clerk JWT `orgId` — do not add account headers                                                                           |
| `selectedAccount` on `SessionEntity`/`SessionModel`    | Account resolved server-side from JWT; no client-side account on session                                                                               |
| `requireAccount` in `HttpRequest` config               | Removed — account resolution is implicit via JWT                                                                                                       |
| `SelectedAccountProvider` context value                | Deprecated — provider only handles redirects; use `useGetCurrentAccount()` for account data                                                            |
| `*-impl.tsx` monolith pattern (new code)               | Provider + split components pattern. Page composes provider + components, each component consumes context. Existing pages will be migrated gradually.  |
| `InvoiceTableShell` (removed)                          | `TableContainer` + `TableHeader` + `TablePagination` from `core/presentations/components/table/`. Toolbar is a sibling above the container; header is the first child; pagination is the last child, gated `meta && meta.totalPages > 1`. |
| Inline edit/delete icon buttons in tables (new code)   | `ActionMenu` from `core/presentations/components/action-menu.tsx` — consistent 3-dot action menu                                                       |
| `ProductPhotoCard` standalone                          | Split into `ProductPhotoGrid` + `ProductPhotoDropzone` + `ProductPhotoUploadArea`                                                                      |

### Environment

Required env vars (see `.env.local`):

- `NEXT_PUBLIC_BASE_API_URL` — Backend API base URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key

## Conventions

### Imports

Always use `@/` path alias (maps to `src/`). No relative imports.

### File Naming

| Type                   | Pattern                                                          | Example                             |
|------------------------|------------------------------------------------------------------|-------------------------------------|
| Use cases              | `{verb}-{noun}.usecases.ts` (new) or `{verb}-{noun}.ts` (legacy) | `get-invoice.usecases.ts`           |
| Hooks                  | `use-{verb}-{noun}.ts`                                           | `use-get-invoice.ts`                |
| Hook types             | `use-{verb}-{noun}.types.ts`                                     | `use-get-invoice.types.ts`          |
| Entities               | `{noun}.ts`                                                      | `invoice.ts`                        |
| Guards                 | `domain/guards/{noun}-guards.ts`                                 | `invoice-guards.ts`                 |
| Repo interfaces        | `domain/repositories/{noun}.ts`                                  | `invoice.ts`                        |
| Repo impls             | `data/repositories/{noun}.ts`                                    | `invoice.ts`                        |
| Services               | `data/sources/{noun}.ts`                                         | `invoice.ts`                        |
| Factories              | `{noun}-factory.ts`                                              | `pay-in-detail-factory.ts`          |
| Providers (page-level) | `_providers/{noun}-provider.tsx`                                 | `fixed-cost-entries-provider.tsx`   |
| Display components     | `{noun}-form-dialog.tsx`                                         | `raw-material-edit-form-dialog.tsx` |

Directories use kebab-case. Components use kebab-case filenames.

### Core Components

| Component       | Location                                           | Usage                                                 |
|-----------------|----------------------------------------------------|-------------------------------------------------------|
| `ActionMenu`    | `core/presentations/components/action-menu.tsx`    | 3-dot action menus in tables and cards                |
| `NumberDisplay` | `core/presentations/components/number-display.tsx` | Thousand separator formatting with optional suffix    |
| `Dropzone`      | `core/presentations/components/dropzone.tsx`       | Drag & drop file upload area                          |
| `MiniToggle`    | `core/presentations/components/mini-toggle.tsx`    | Small toggle switch display                           |
| `StatusChip`    | `core/presentations/components/status-chip.tsx`    | Status badges (success/warning/error/primary/neutral) |
| `TablePagination` | `core/presentations/components/table/table-pagination.tsx` | Pagination controls; pairs with `TableContainer` + `TableHeader` |
| `TableToolbar`  | `core/presentations/components/table/table-toolbar.tsx` | List-page toolbar row: filters left, search right (see List-page header/toolbar standard) |
| `TableSearch`   | `core/presentations/components/table/table-search.tsx` | Standard list search input (`sm:w-[280px]`, right-pinned); use instead of inline `TextInput` search |

### Pagination

Newer features use `PaginatedData<T>` from `core/resources/paginated` in repository interfaces. Source interfaces use
custom `ListXxxServiceResult` types (returning Models, not Entities).

### Fetcher Naming

SWR fetcher functions use singular noun: `ListStockItemFetcher` (not `ListStockItemsFetcher`).

### Code Style

- Prettier: 2-space indent, 120 char width
- `@typescript-eslint/no-explicit-any` is disabled
- Domain layer must not import from presentation layers. Domain source interfaces (`domain/sources/`) may import data
  models since they define the service contract that data layer implements. Conversely, **presentation**
  (`presentations/`) and **domain** (`domain/entities/`, `domain/usecases/`) layers must **not** import from
  `data/models/` — that exemption is `domain/sources/`-only; cross the seam via the Model's `toEntity()` into a domain
  entity/type.
- **Neutral palette diverges from Tailwind defaults**: `neutral-50` is `#FFFFFF` (pure white), not off-white. For
  visible-on-white chips/badges/borders, use `neutral-100` (`#D9DADA`) or darker. Check `src/app/globals.css` `@theme`
  for the canonical palette.

### Git

- Branch naming: prefix with `feat/`, `fix/`, `refactor/`, or `hotfix/` + `{description}` (e.g. `fix/exclude-pos-from-outgoing-invoices`). Do NOT use the legacy `features/` prefix.
- Always create branches from `dev`
- Commit style: Conventional Commits — `feat(scope):`, `fix(scope):`, `refactor(scope):`, `chore(scope):`

## Design Context

Design intent lives in two root files (source of truth for any UI/UX work; read before designing new screens):

- **`PRODUCT.md`** — strategic: register (`product`), users (Indonesian SME owners + staff), the all-in-one merchant
  OS purpose, brand personality (**trustworthy, precise, calm**), references (Mekari, Xero), anti-references, the 5
  design principles, and the WCAG 2.1 AA bar.
- **`DESIGN.md`** — visual: the "Calm Ledger" system. Lunas Blue (`#007BFF`) as the single accent, flat
  border-not-shadow elevation, Manrope on a fixed rem scale, and the canonical component vocabulary. Machine-readable
  tokens live in its YAML frontmatter; `.impeccable/design.json` is the live-mode sidecar.

These are maintained via the `impeccable` skill (`/impeccable document` regenerates DESIGN.md; `/impeccable critique`
/ `audit` / `polish` evaluate surfaces against this intent).
