---
name: create-component
description: Create a React component in either a page route (`app/**/_components/`) or a feature presentation layer (`features/*/presentations/components/`). Use when adding any UI element — a row, card, dialog, form section, table, etc. Covers general rules for file layout, naming, styling, state, and context consumption. Triggers include "create component", "add a component", "new React component", "buat component".
---

# Create Component

Components live in two places depending on who owns them:

| Where it lives | Who owns it |
| --- | --- |
| `src/app/{route-group}/**/_components/*.tsx` | A single page route. Scope-local UI like `production-list-row.tsx`, `production-detail-info-card.tsx`. |
| `src/features/{feature}/presentations/components/*.tsx` | Shared across pages (presentational or smart). `production-record-card.tsx` used from both list and detail. |

Put it in the route's `_components/` unless it needs to be re-used from another route.

## When to use

Any new visible UI — rows, cards, form sections, dialogs, toolbars, headers, chips, etc.

Do NOT use this skill for:
- Providers (→ `create-provider`)
- Hooks (→ `create-hook-*`)
- Page `page.tsx` files (those are just composition — provider wrapping + rendering `_components`)

## File location & naming

- **One component per file.** Multiple components per file are only allowed when the secondary is a trivial internal helper (rare — prefer splitting).
- Filename: kebab-case, ends in `.tsx`. The filename describes the component, not the route:
  - `production-list-row.tsx` (scoped to list page)
  - `production-detail-info-card.tsx` (scoped to detail page)
  - `production-create-form-card.tsx` (scoped to create page)
- Exported component name: PascalCase that matches the filename (e.g. `ProductionListRow`).

## Rules

### Client/server

1. Client components start with `"use client";` at the top. Anything using state, hooks, context, event handlers, or `useEffect` is a client component.
2. Prefer server components when possible — but in practice, most authenticated pages end up client because they use providers/hooks.

### One concern per file

3. **One component per file**, named after the file. Don't inline a second component in the return of another (e.g. `function Row(...)` inside `Table.tsx` — break into its own file).
4. **No multi-state conditional rendering in return.** If a component would render differently for loading / empty / error / loaded, split into separate components (`ProductionListEmpty`, `ProductionListTable`, `ProductionListLoading`) and pick one in the parent.

### State & derived data

5. **Use `useMemo` for derived/computed data.** Recomputing inline every render is a bug waiting to happen.
6. Lift fetch state into a **provider** (see `create-provider`). Components consume context, not hooks for data. This keeps components focused on rendering.
7. **Provider data locality** — only share data via context that two or more components need. If a component is the only consumer of a piece of data, keep that fetch local to the component.

### Styling

8. **Tailwind CSS 4** with `prettier-plugin-tailwindcss` sorting. Don't reorder classes manually — let the formatter do it.
9. **Compose classNames with `clsx`**, not template literals. `` `${base} ${cond && active}` `` → `clsx(base, cond && active)`.
10. Color palette: use `text-neutral-*`, `bg-neutral-*`. **Never `text-gray-*`** — that's the deprecated palette.
11. Interactive element height: **`h-11`** (44px) for all buttons, inputs, selects, custom controls. Icon-only action buttons in tables are the single exception — `size-8` (32px).

### Reuse first — check before building

Before writing new UI primitives, check existing core components:

| Component | Location | Use when |
| --- | --- | --- |
| `SectionCard` | `core/presentations/components/section-card.tsx` | Any detail card on a detail/create/edit page. Has icon header. |
| `ActionMenu` | `core/presentations/components/action-menu.tsx` | 3-dot action menu in tables, cards. Replaces inline edit/delete icon buttons. |
| `NumberDisplay` | `core/presentations/components/number-display.tsx` | Thousand-separated number display (optional suffix). |
| `CurrencyDisplay` | `core/presentations/components/currency-display.tsx` | Rupiah formatting. |
| `StatusChip` | `core/presentations/components/status-chip.tsx` | Success/warning/error/primary/neutral badges. |
| `MiniToggle` | `core/presentations/components/mini-toggle.tsx` | Small toggle-switch display. |
| `Dropzone` | `core/presentations/components/dropzone.tsx` | Drag-and-drop upload area. |
| Buttons | `core/presentations/components/buttons/` | `PrimaryButton`, `SecondaryButton` (supports `outlined`), `DangerButton`. Never use deprecated `FilledButton` / `OutlinedButton`. |
| Table | `core/presentations/components/table/` | `TableToolbar`, `TableSearch`, `TableHeader`, `TableContainer`. Never use deprecated `InvoiceTableShell`. |
| Inputs | `core/presentations/components/text-inputs/` | `TextInput`, `NumberInput`, `DatePickerInput`. |

### Skeleton loading, not Lottie

12. Loading UI: `animate-pulse` placeholder divs inside `SectionCard`. Do NOT use Lottie animations — that's deprecated.

### Imports

13. `@/` path alias everywhere. No relative imports across directories.
14. Import the domain entity from `@/features/{feature}/domain/entities/...`, never the data-layer model.

### Deprecated — never reach for these in new code

- `Card` (shadow-based) → use `SectionCard`
- `FilledButton`, `OutlinedButton` → use the new button family
- Lottie loading → skeleton via `animate-pulse`
- Template-literal `className` → `clsx`
- `text-gray-*` → `text-neutral-*`
- Inline edit/delete icon buttons in tables → `ActionMenu`
- `*-impl.tsx` monolith pattern → provider + split components
- `InvoiceTableShell` → the new `Table*` primitives

## Template — row consuming a provider

```tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { {Noun}Entity } from "@/features/{feature}/domain/entities/{noun}";
import { use{Feature}List } from "@/app/(authenticated)/{route}/_providers/{feature}-list-provider";

type {Noun}ListRowProps = {
  record: {Noun}Entity;
};

export function {Noun}ListRow({ record }: {Noun}ListRowProps) {
  const { setDeletingItem } = use{Feature}List();

  const menuOptions = useMemo<ActionMenuOption[]>(
    () => [{ label: "Hapus", onClick: () => setDeletingItem(record), variant: "danger" }],
    [record, setDeletingItem],
  );

  return (
    <Link
      href={`/{route}/${record.id}`}
      className={clsx(
        "grid grid-cols-[1fr_1fr_48px] items-center gap-x-4",
        "border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0",
        "hover:border-l-primary-300 hover:bg-primary-50",
      )}
    >
      <span className="text-sm text-neutral-500">{record.someField}</span>
      <span className="text-right text-sm font-semibold text-neutral-500">{record.amount}</span>
      <div className="flex justify-end">
        <ActionMenu options={menuOptions} />
      </div>
    </Link>
  );
}
```

## Common pitfalls

- **Fetching data inside a leaf component** that is rendered many times (e.g. a row) — hoist to the parent provider.
- **Rendering multiple states in one component** via ternaries — split into separate components.
- **Template-literal `className`** — `clsx` is the convention. The linter won't catch this, so it's on the author.
- **Using the Model instead of Entity** — presentation must only ever see entities from the domain layer.
- **Deprecated core components** — always check the "Reuse first" table. Picking the wrong primitive creates cleanup debt.
- **Second component in the same file** — split, even for small helpers.
- **Non-h-11 interactive elements** — consistency across the app matters.

## After creating

Wire the component into the page's `_components` folder (or export from `features/{feature}/presentations/components/` if shared). The page's `page.tsx` composes provider + components — no business logic there.
