# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js + Turbopack)
npm run build        # Production build
npm run lint         # ESLint
```

No test framework is configured.

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
│   └── (external-app)/              # Public external routes
├── features/{feature}/               # Feature modules
│   ├── domain/                       # Entities, guards, types, enums, repository interfaces, use cases, factories
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
- **Impl components**: `*-impl.tsx` files are smart components that fetch data and pass to presentational siblings
- **Type guards**: `domain/guards/` contains `instanceof` checks for discriminating entity types
- **SectionCard**: Standard card component (`rounded-lg`, `border-neutral-200`, icon header) for detail pages
- **Skeleton loading**: Loading states use `animate-pulse` placeholder divs inside `SectionCard`
- **Interactive element height**: All interactive elements (buttons, inputs, selects, custom controls) use `h-11` (44px)
  for consistent vertical rhythm. Exception: icon-only action buttons (edit, delete) in tables use `size-8` (32px).
- **Account resolution**: Backend resolves account from Clerk JWT `orgId` (set via `setActive({ organization })`).
  Frontend never sends account ID in headers or params — only `Authorization: Bearer {token}`
- **Session parameter order**: In repository and service method signatures, `session: SessionEntity` must always be the
  **last** parameter. Methods have **maximum 2 parameters**: `(params, session)`. All business parameters grouped into a
  single object: `list({ search, page }, session)`, `update({ id, name, status }, session)`.
- **SWR key management**: SWR keys defined as constants in `presentations/constants/swr-keys.ts`. Use
  `revalidateSWRKey()` to invalidate cache after mutations. Hooks use these constants, never hardcoded strings.
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
| `InvoiceTableShell` (new code)                         | `TableToolbar`, `TableSearch`, `TableHeader`, `TableContainer` from `core/presentations/components/table/`. Existing pages will be migrated gradually. |
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

### Pagination

Newer features use `PaginatedData<T>` from `core/resources/paginated` in repository interfaces. Source interfaces use
custom `ListXxxServiceResult` types (returning Models, not Entities).

### Fetcher Naming

SWR fetcher functions use singular noun: `ListStockItemFetcher` (not `ListStockItemsFetcher`).

### Code Style

- Prettier: 2-space indent, 120 char width
- `@typescript-eslint/no-explicit-any` is disabled
- Domain layer must not import from presentation layers. Domain source interfaces (`domain/sources/`) may import data
  models since they define the service contract that data layer implements.

### Git

- Branch naming: `features/{description}` for new features
- Always create branches from `dev`
- Commit style: Conventional Commits — `feat(scope):`, `fix(scope):`, `refactor(scope):`, `chore(scope):`
