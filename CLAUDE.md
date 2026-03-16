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

- **Presentation layer naming**: Older features use `presentation/` (singular), newer ones use `presentations/` (plural). Match the existing directory name when adding to a feature.
- **DataState pattern**: Use cases return `DataSuccess<T>` or `DataFailed` instead of throwing
- **Hook return types**: Discriminated unions (`InitialState | LoadedState | ErrorState`)
- **ServerError + ErrorCodes**: Centralized error registry with Indonesian messages
- **Factory pattern**: `PayInDetailFactory` etc. for polymorphic creation
- **Impl components**: `*-impl.tsx` files are smart components that fetch data and pass to presentational siblings
- **Type guards**: `domain/guards/` contains `instanceof` checks for discriminating entity types
- **SectionCard**: Standard card component (`rounded-lg`, `border-neutral-200`, icon header) for detail pages
- **Skeleton loading**: Loading states use `animate-pulse` placeholder divs inside `SectionCard`
- **Account resolution**: Backend resolves account from Clerk JWT `orgId` (set via `setActive({ organization })`). Frontend never sends account ID in headers or params — only `Authorization: Bearer {token}`
- **Session parameter order**: In repository and service method signatures, `session: SessionEntity` must always be the **last** parameter. Business params come first: `list(search, session)`, `invite(email, session)`, `update(id, params, session)`.

### HTTP Requests

Custom `HttpRequest` class injects Clerk session headers:
- `Authorization: Bearer {token}` (account resolved from Clerk JWT `orgId` on the backend)
- Base URL from `NEXT_PUBLIC_BASE_API_URL`
- `FetchConfig` supports `requireAuth` (default `true`), `contentType`, and `headers` — no account-level config
- Services that bypass `HttpRequest` (manual `fetch`) must still set `Authorization` header manually

### Deprecated — Do Not Use

| Deprecated | Replacement |
|------------|-------------|
| `Card` (shadow-based, `text-gray-*`) | `SectionCard` |
| `FilledButton` | `PrimaryButton` / `SecondaryButton` / `DangerButton` from `core/presentations/components/buttons/` |
| `LocalStorageSessionService` | `ClerkSessionService` (will throw "No valid session") |
| Lottie animations (`@lottiefiles/react-lottie-player`) | Skeleton loading (`animate-pulse`) |
| `OutlinedButton` | `SecondaryButton` with `outlined` prop |
| Template literal classNames (`` `${a} ${b}` ``) | `clsx(a, b)` |
| `text-gray-*` color classes | `text-neutral-*` equivalents |
| `X-Account-Id` header | Backend resolves account from Clerk JWT `orgId` — do not add account headers |
| `selectedAccount` on `SessionEntity`/`SessionModel` | Account resolved server-side from JWT; no client-side account on session |
| `requireAccount` in `HttpRequest` config | Removed — account resolution is implicit via JWT |
| `SelectedAccountProvider` context value | Deprecated — provider only handles redirects; use `useGetCurrentAccount()` for account data |

### Environment

Required env vars (see `.env.local`):
- `NEXT_PUBLIC_BASE_API_URL` — Backend API base URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key

## Conventions

### Imports

Always use `@/` path alias (maps to `src/`). No relative imports.

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Use cases | `{verb}-{noun}.usecases.ts` (new) or `{verb}-{noun}.ts` (legacy) | `get-invoice.usecases.ts` |
| Hooks | `use-{verb}-{noun}.ts` | `use-get-invoice.ts` |
| Hook types | `use-{verb}-{noun}.types.ts` | `use-get-invoice.types.ts` |
| Entities | `{noun}.ts` | `invoice.ts` |
| Guards | `domain/guards/{noun}-guards.ts` | `invoice-guards.ts` |
| Repo interfaces | `domain/repositories/{noun}.ts` | `invoice.ts` |
| Repo impls | `data/repositories/{noun}.ts` | `invoice.ts` |
| Services | `data/sources/{noun}.ts` | `invoice.ts` |
| Factories | `{noun}-factory.ts` | `pay-in-detail-factory.ts` |

Directories use kebab-case. Components use kebab-case filenames.

### Code Style

- Prettier: 2-space indent, 120 char width
- `@typescript-eslint/no-explicit-any` is disabled
- Domain layer must not import from presentation layers. Domain source interfaces (`domain/sources/`) may import data models since they define the service contract that data layer implements.

### Git

- Branch naming: `features/{description}` for new features
- Always create branches from `dev`
- Commit style: Conventional Commits — `feat(scope):`, `fix(scope):`, `refactor(scope):`, `chore(scope):`
