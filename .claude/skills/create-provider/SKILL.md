---
name: create-provider
description: Create a React context provider — either a page-level provider (`app/**/_providers/`) for state, mutations, and shared data on a single page, or a feature-level provider (`features/{feature}/presentations/providers/`) reused across pages. Covers the detail "guarantee" pattern, list filter-state pattern, and create/form pattern. Use when a page has state or data that multiple child components consume. Triggers include "create provider", "page provider", "feature provider", "context provider", "buat provider".
paths: src/app/**/_providers/**, src/features/**/presentations/providers/**
---

# Create Provider

Providers centralize state, fetched data, and action functions so child components can consume them via a `use{Name}()` hook instead of re-fetching or drilling props. There are three common patterns — pick the one that matches the page.

## Pattern A — Page-level detail "guarantee" provider

**Used when**: the page loads one entity by id (detail pages).

**Guarantee**: the provider accepts a `loading` React node prop. While fetching, it renders the `loading` indicator. Once the entity is loaded, it provides the entity as **non-nullable** context value so children never need null checks.

### File

`src/app/(authenticated)/{route}/[id]/_providers/{feature}-detail-provider.tsx`

### Template

```tsx
"use client";

import { createContext, useContext } from "react";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";
import { useGet{Noun} } from "@/features/{feature}/presentations/hooks/use-get-{noun}";

type {Feature}DetailContextValue = {
  record: {Noun}Entity;   // NON-nullable after the loading gate.
};

const {Feature}DetailContext = createContext<{Feature}DetailContextValue | null>(null);

export function use{Feature}Detail() {
  const context = useContext({Feature}DetailContext);
  if (!context) throw new Error("use{Feature}Detail must be used within {Feature}DetailProvider");
  return context;
}

type {Feature}DetailProviderProps = {
  id: string;
  loading: React.ReactNode;
  children: React.ReactNode;
};

export function {Feature}DetailProvider({ id, loading: loadingIndicator, children }: {Feature}DetailProviderProps) {
  const { record, loading } = useGet{Noun}(id);
  if (loading || !record) return <>{loadingIndicator}</>;

  return (
    <{Feature}DetailContext.Provider value={{ record }}>
      {children}
    </{Feature}DetailContext.Provider>
  );
}
```

### Why this pattern
Children see `record: {Noun}Entity`, not `record: {Noun}Entity | null`. No null checks, no conditional renders in every child.

## Pattern B — Page-level list filter/pagination provider

**Used when**: a list page needs shared filter state (search, date range, page) + fetch results + dialog state (e.g. `deletingItem`).

### File

`src/app/(authenticated)/{route}/_providers/{feature}-list-provider.tsx`

### Key decisions
- **Filter state** owned by provider: `search`, `dateFrom`, `dateTo`, `page`.
- Debounce search with `useDebounce` from `@/core/presentations/hooks/use-debounce`.
- Only activate search when `debouncedSearch.length >= 2` (avoid noisy API calls).
- Expose setters so toolbars can update filters.
- **Dialog state** (e.g. `deletingItem`) lives here if multiple components open/close the dialog. If only one does, keep it local.

### Template

```tsx
"use client";

import { createContext, useContext, useState } from "react";
import { DateTime } from "luxon";
import { PaginationMeta } from "@/core/resources/paginated";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";
import { useList{Nouns} } from "@/features/{feature}/presentations/hooks/use-list-{nouns}";

type {Feature}ListContextValue = {
  records: {Noun}Entity[];
  meta: PaginationMeta | null;
  loading: boolean;
  page: number;
  search: string;
  dateFrom: DateTime | undefined;
  dateTo: DateTime | undefined;
  deletingItem: {Noun}Entity | null;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setDateFrom: (value: DateTime | undefined) => void;
  setDateTo: (value: DateTime | undefined) => void;
  setDeletingItem: (item: {Noun}Entity | null) => void;
};

const {Feature}ListContext = createContext<{Feature}ListContextValue | null>(null);

export function use{Feature}List() {
  const context = useContext({Feature}ListContext);
  if (!context) throw new Error("use{Feature}List must be used within {Feature}ListProvider");
  return context;
}

export function {Feature}ListProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<DateTime | undefined>(undefined);
  const [dateTo, setDateTo] = useState<DateTime | undefined>(undefined);
  const [deletingItem, setDeletingItem] = useState<{Noun}Entity | null>(null);

  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const result = useList{Nouns}({
    search: searchQuery,
    dateFrom: dateFrom?.toISODate() ?? undefined,
    dateTo: dateTo?.toISODate() ?? undefined,
    page,
    limit: 10,
  });

  const records = result.records ?? [];
  const meta = result.meta ?? null;

  return (
    <{Feature}ListContext.Provider
      value={{
        records,
        meta,
        loading: result.loading,
        page,
        search,
        dateFrom,
        dateTo,
        deletingItem,
        setPage,
        setSearch,
        setDateFrom,
        setDateTo,
        setDeletingItem,
      }}
    >
      {children}
    </{Feature}ListContext.Provider>
  );
}
```

## Pattern C — Page-level create/form provider

**Used when**: a create page manages form fields, preview data, submit action, and cache revalidation.

### Key decisions
- Form fields owned by provider via `useState`.
- Expose `handleSubmit` action that awaits the mutation, calls `revalidateSWRKey(...)`, and shows a toast.
- Optionally preview data via another hook + debounce.

### Sketch

```tsx
"use client";

import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { useCreate{Noun} } from "@/features/{feature}/presentations/hooks/use-create-{noun}";
import { {FEATURE}_SWR_KEYS } from "@/features/{feature}/presentations/constants/swr-keys";

// ... state, debounce, preview hook ...

const handleSubmit = async () => {
  try {
    const result = await create{Noun}({ /* ...params */ });
    await revalidateSWRKey({FEATURE}_SWR_KEYS.LIST_{NOUNS});
    showToast("Berhasil");
    return result;
  } catch {
    showToast("Gagal", "error");
    return null;
  }
};
```

## Pattern D — Feature-level provider (cross-page)

**Used when**: state or data is shared by multiple unrelated pages (rare). File lives at `src/features/{feature}/presentations/providers/{noun}-provider.tsx`. Structure is the same as page-level — just a wider scope.

If you find yourself creating a feature-level provider "just in case", don't. Start page-local and extract only when a second page actually needs it.

## Rules

1. **Always** start the file with `"use client";`.
2. **`use{Name}()` hook throws** if called outside its provider — never return a fallback value from null. This catches misuse early.
3. Context default value is `null`. The hook unwraps it.
4. **Provider data locality**: only host data that two or more components need. If only one component uses it, fetch locally in that component.
5. **Guarantee pattern for detail providers**: accept `loading: React.ReactNode`, return `<>{loadingIndicator}</>` until data is ready, then provide a **non-null** context value.
6. **No business logic in `page.tsx`**. Page composes `Provider` + `_components/` only.
7. Providers live alongside their consumers:
   - Page-level: `app/(authenticated)/{route}/[_providers/](_providers/...)` next to `_components/`
   - Feature-level: `features/{feature}/presentations/providers/`

## File location matrix

| Scope | Path | When |
| --- | --- | --- |
| Page detail | `app/.../[id]/_providers/{feature}-detail-provider.tsx` | Detail pages, Pattern A |
| Page list | `app/.../{route}/_providers/{feature}-list-provider.tsx` | List pages, Pattern B |
| Page create | `app/.../{route}/create/_providers/{feature}-create-provider.tsx` | Create/edit pages, Pattern C |
| Feature-level | `features/{feature}/presentations/providers/{noun}-provider.tsx` | Cross-page, Pattern D |

## References

- [`references/page-detail-guarantee-provider.tsx`](references/page-detail-guarantee-provider.tsx) — Pattern A, `ProductionDetailProvider`.
- [`references/page-list-filter-provider.tsx`](references/page-list-filter-provider.tsx) — Pattern B, `ProductionListProvider`.
- [`references/page-create-provider.tsx`](references/page-create-provider.tsx) — Pattern C, `ProductionCreateProvider` with submit + revalidate.

## Common pitfalls

- **Detail provider passing `record: Entity | null`** — that defeats the guarantee. Gate on `loading || !record` first, then context value is non-null.
- **`page.tsx` with business logic** — page composes only. If logic creeps in, move it to the provider.
- **Overusing feature-level providers** — premature abstraction. Start page-local.
- **Provider hosting data only one child uses** — keep the fetch local to that child. Context is for shared data.
- **Missing `"use client"`** — providers use hooks, always client.
- **Provider returning a `null`-tolerant default instead of throwing** — the `use{Name}()` hook must throw when used outside the provider; silent fallbacks hide bugs.
- **Components fetching their own data when provider has it** — consume context. Avoid duplicate fetches.

## After creating

Wire the provider at the top of `page.tsx`:

```tsx
export default function Page({ params }: { params: { id: string } }) {
  return (
    <{Feature}DetailProvider id={params.id} loading={<{Feature}DetailLoading />}>
      <{Feature}DetailHeader />
      <{Feature}DetailInfoCard />
      {/* ... other _components that consume context ... */}
    </{Feature}DetailProvider>
  );
}
```
