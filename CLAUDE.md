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

- **DataState pattern**: Use cases return `DataSuccess<T>` or `DataFailed` instead of throwing
- **Hook return types**: Discriminated unions (`InitialState | LoadedState | ErrorState`)
- **ServerError + ErrorCodes**: Centralized error registry with Indonesian messages
- **Factory pattern**: `PayInDetailFactory` etc. for polymorphic creation
- **Impl components**: `*-impl.tsx` files are smart components that fetch data and pass to presentational siblings
- **Type guards**: `domain/guards/` contains `instanceof` checks for discriminating entity types
- **SectionCard**: Standard card component (`rounded-lg`, `border-neutral-200`, icon header) for detail pages
- **Skeleton loading**: Loading states use `animate-pulse` placeholder divs inside `SectionCard`

### HTTP Requests

Custom `HttpRequest` class injects Clerk session headers:
- `Authorization: Bearer {token}`
- `X-Account-Id: {accountId}`
- Base URL from `NEXT_PUBLIC_BASE_API_URL`

### Deprecated — Do Not Use

| Deprecated | Replacement |
|------------|-------------|
| `Card` (shadow-based, `text-gray-*`) | `SectionCard` |
| `FilledButton` | `PrimaryButton` / `SecondaryButton` / `DangerButton` from `core/presentations/components/buttons/` |
| `LocalStorageSessionService` | `ClerkSessionService` (will throw "No valid session") |
| Lottie animations (`@lottiefiles/react-lottie-player`) | Skeleton loading (`animate-pulse`) |

## Conventions

### Imports

Always use `@/` path alias (maps to `src/`). No relative imports.

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Use cases | `{verb}-{noun}.usecases.ts` | `get-invoice.usecases.ts` |
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
- Domain layer must not import from data or presentation layers

### Git

- Branch naming: `features/{description}` for new features
- Always create branches from `dev`
- Commit style: Conventional Commits — `feat(scope):`, `fix(scope):`, `refactor(scope):`, `chore(scope):`
