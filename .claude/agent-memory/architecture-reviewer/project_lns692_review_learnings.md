---
name: lns692-review-learnings
description: LNS-692 close-period blocking-account remedy — dual-parser drift (real), and a gate Blocker I raised that was rejected as unfounded
metadata:
  type: project
---

Branch `feat/close-period-blocking-account-remedy` off `origin/release/fix-hpp` (two commits:
`a8fce985` BE-chain-first, `b4eb4183` UI-wiring — an acceptable split, not a finding on its own).

One confirmed finding, and one raised-then-REJECTED:

1. **REJECTED — not a defect.** I raised a Blocker claiming the retry-remedy button was gated on a
   wrong/unrelated `MANAGERIAL_COSTING_FEATURE` copy-pasted from a sibling, inferring "no BE gate"
   from the endpoint's documented error list omitting `FEATURE_NOT_AVAILABLE`. That inference was
   invalid and the finding was wrong: the ticket specifies the gate verbatim ("Feature gate:
   `MANAGERIAL_COSTING` — the same gate as the overhead-account selection endpoints"), independent
   BE verification confirmed `AccountFeature.MANAGERIAL_COSTING` on the route, and an acceptance
   criterion *requires* that an account without it is not offered the action. Acting on it would
   have broken that AC. **Lesson: absence of an error code in a docs list is not evidence a gate
   does not exist — read the route's declared gate before calling one spurious, and where a ticket
   states a gate explicitly, that is the contract.** A general "feature-flag copy-paste" note built
   on this was written and then deleted as unfounded.
2. **Minor (real, fixed in `e2b491f4`)**: `presentations/helpers/close-period-error.ts`'s hand-rolled `parseCoaAccountRef`
   (returns `null` on any malformed field) vs `data/models/blocking-posting.ts`'s
   `CoaAccountRefModel.fromJson` (defaults missing fields to `""`, never returns null for a
   non-nullish object) — two parsers for the same wire shape, forced apart by the
   presentations-must-not-import-data/models layering rule, diverge on malformed input. Confirmed
   via each file's own test suite (`blocking-posting.test.ts:10-13` for the model's `??` fallback
   vs `close-period-error.test.ts` for the strict-or-null presentation parser).

Also confirms as CORRECT/precedented, worth not re-flagging on future accounting-feature reviews:
- Plain `type` (not class) entities with implicitly-immutable fields are established in this
  feature's `domain/entities/` (`CloseWarning`, `PphFinalWarningDetails`, and now
  `BlockingPosting`/`RetryFailedPostingsResult`) — do not demand a class-with-`public readonly`
  rewrite for these.
- `toValue()` (vs `toEntity()`) is the established method name on data models for a nested
  non-entity value type in this feature (`managerial-cost-projection.ts`, `journal.ts` precedent).
- The LNS-676 guarded-revalidate-on-success-path rule (CLAUDE.md) was correctly applied in BOTH
  `periods-provider.tsx` and `fixed-cost-entries-provider.tsx`'s `handleClosePeriod` — success
  state committed synchronously first, `revalidateSWRKey` wrapped in its own try/catch after.
- Deliberately omitting `revalidateSWRKey` after a successful `retry-failed-postings` call is
  correct here: verified no SWR-cached field (`AccountingPeriodEntity.canClose`, period list) is
  derived from failed-postings/outbox state — only actually closing a period changes that, and
  that path already revalidates.
