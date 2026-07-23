---
name: project-lns372-journal-detail-reverse
description: Journal detail page + reverse action design spec — layout, actor panel, reverse dialog, warn-ack inline pattern, OQ-U1/U2 decisions
metadata:
  type: project
---

Journal detail page at `/finance/journals/[id]` — three SectionCards: page heading row (date + memo + CTA), lines table with balanced footer, audit card (createdAt, referenceType/Id, postedBy badge). Provider-guarantee pattern via `journal-detail-provider.tsx`.

**Key decisions:**

**OQ-U1 (list entry point):** ActionMenu "Lihat detail" — not whole-row-navigate. JournalRow is a toggle-expand button; ActionMenu (already used on PeriodRow) coexists cleanly. Blast radius: JournalRow has 1 call site (JournalListImpl, confirmed by grep).

**OQ-U2 (reverse-disabled treatment):**
- `isReversedCurrently` → disabled button + helper text "Jurnal ini sudah dibalik." (explains why — prevents support tickets)
- `isReversal` → **hide CTA entirely** (reversing a reversing entry is semantically incoherent; chip + link to original is sufficient)

**Warn-acknowledge:** inline, not dialog-over-dialog. Reverse dialog transitions — reason fields replaced with JournalWarningItem list. One focus trap, one Esc. Reuses existing `JournalWarningItem` component directly.

**Reverse dialog CTA:** `SecondaryButton` (charcoal, not PrimaryButton blue) — page's primary function is reading, not reversing; blue is reserved for creates/primary commits.

**Informational callout in dialog:** always shown — "Jurnal asli tidak akan dihapus. Semua perubahan dicatat sebagai jejak audit." Do NOT optimize away; it directly reduces SME confusion and support tickets.

**Closed-period 422:** inline error in dialog (not toast). Dialog stays open. Precedent: close-period-dialog (LNS-377).

**Status chips:**
- `isReversedCurrently`: StatusChip warning + link to reversing entry
- `isReversal`: StatusChip primary + link to original

**ROUTE_MAP:** must add `"/finance/journals/[id]": { title: "Detail Jurnal" }` or chrome falls back to "Dashboard" silently.

**Open questions at spec time:**
- OQ-BE1: change_reason_category = enum (Select) or free string (TextInput)? Layout works either way.
- OQ-BE4: ErrorCode for closed-period reverse — EL payload-inspection, not BE relay.
- OQ-EL2: postingDate picker in reverse dialog — not in PRD, defer to v1.1.

**Why:** [[project-accounting-surfaces-ia]] [[project-lns371-manual-journal-entry]] [[project-periods-page]]
