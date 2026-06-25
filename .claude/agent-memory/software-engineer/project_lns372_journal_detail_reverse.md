---
name: lns372-journal-detail-reverse
description: LNS-372 journal detail view + reverse action — shipped, PR #98 open
metadata:
  type: project
---

LNS-372 shipped on 2026-06-25. PR #98 open against `dev`. 4 commits on `feat/lns-372-journal-detail-reverse-action`.

Key decisions made:
- Idempotency key: `crypto.randomUUID()` in `useRef`, rotated only on terminal error (catch block), same key reused for warn→ack resubmit
- Warn→ack: single `LoonasDialog` with `isAckMode` body switch; `pendingCategoryRef`/`pendingDetailRef` capture form values for resubmit
- Provider renders `JournalDetailError` directly (page-level orchestrator Rule 7 exception)
- `ErrorState.refresh` wired to `mutate` (not `null`) for retry capability
- `JournalWarningItem` promoted to `features/accounting/presentations/components/` (feature-shared)
- Dynamic segment header: `if` block in `useMemo` before ROUTE_MAP, not bracket key
- Table row: outer div grid, `<button col-span-4>` for expand, `ActionMenu` sibling in col 5

**Why:** Full journal detail page with reverse action, idempotency for safe retries, and warn→ack flow for BE-returned warnings on reverse.

**How to apply:** Reference this for any future detail page with an action dialog that has a warning-acknowledgement flow.
