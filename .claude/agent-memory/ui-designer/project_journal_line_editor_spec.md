---
name: project-journal-line-editor-spec
description: LNS-364 journal-line editor design decisions — grid layout, money-input coerce model, column-lock UX, balance indicator, add/remove affordances, a11y
metadata:
  type: project
---

LNS-364: Shared presentational double-entry journal-line editor + live balance check.

**Why:** Prevents divergent UX across manual journal entry and opening-balance wizard. One spec, consumed by both downstream tickets.

**Key design decisions:**
- Grid layout: CSS Grid with 4 columns — [auto_Akun : 1fr] [Debit : 180px] [Kredit : 180px] [remove : 40px]. Below 640px collapses to card-per-line stacked layout (Akun full-width, Debit + Kredit side-by-side).
- Money input: Reuses `CurrencyInput` (wraps `TextInput` + `IDRFormatter`). Coerce model — strips non-numeric on change via existing `IDRFormatter.toNumber()`. No keystroke blocking.
- Column-lock: Typing in one column empties the opposite and keeps it focusable. Typing into the locked column flips the value (PM-recommended "fast correction" model). Locked column shown at 50% opacity, not disabled — `aria-label` unchanged so screen readers know what it accepts.
- Balance indicator: Placed in a sticky totals row BELOW the line list, before the Add Line button. Not per-line — lives as a persistent footer inside the editor component. Host `error` block renders directly ABOVE the totals row.
- Unbalanced copy (LOCKED): "Belum seimbang — total Debit harus sama dengan total Kredit"
- Balanced copy: "Seimbang"
- Column headers: "Akun", "Debit", "Kredit"
- Remove affordance: TrashIcon `size-8` button. Visible but visually disabled (opacity-50, cursor-not-allowed, aria-disabled) at exactly 2 lines. Never hidden.
- Add line: OutlineButton (SecondaryButton outlined) with PlusIcon, full-width below totals row.
- A11y: Each input gets aria-label "Debit baris N" / "Kredit baris N". Balance status uses role="status" live region. Tab order: account combobox → debit → credit → (next line). Remove buttons come after credit in each line's tab order.
- Focus ring: solid `ring-primary-300` (Lunas Blue #007BFF) — NOT `/20` alpha. Computed contrast #007BFF on white = ~3.98:1, passes WCAG 2.1 AA 3:1 non-text bar. The `focus-within:ring-primary-300/20` in TextInput is the ring-halo; the solid `focus-within:border-primary-300` is the border. Both are already in TextInput — no new a11y risk.
- Existing component reuse: `LedgerAccountCombobox` (noLabel=true, required=true), `CurrencyInput` (no label, custom aria-label via id+aria-labelledby), `TextInput` (base), `SectionCard` (optional wrapper when host wants a card chrome).

**How to apply:** When working on manual journal entry (downstream) or opening-balance wizard, consume this component as described. Do not re-implement line/balance logic.
