---
name: lns-kyc-verification-predicate-tightening
description: account-verification-work.ts getters deliberately tighten 4 approved/rejected checks that previously ignored latestStatus
metadata:
  type: project
---

`AccountVerificationWorkEntity.isApproved`/`isRejected` (and the mirrored `PersonalAccountEntity.isApproved`/
`BusinessAccountEntity.isApproved`) require BOTH `latestStatus === COMPLETED` AND the matching
`verificationOutcome`. Four kyc-summary call sites (`approved-action.tsx`, `approved-timeline-item.tsx`,
`rejected-action.tsx`, `rejected-timeline-item.tsx`) previously tested `verificationOutcome` alone — a
deliberate tightening when routed through the getter, not a regression, matching what
`use-list-approved-accounts.ts` / `account-status-badge.tsx` / `selected-account.tsx` routeMap already did.

**Why:** part of `fix/kyc-pending-reentry` phase 1 — eliminating the LNS-570 drift shape (a predicate
re-derived at N call sites in inconsistent idioms) for the KYC verification-approved/rejected check.

**How to apply:** if a future ticket touches KYC/verification display logic and a check seems to have
"changed behavior" against `verificationOutcome` alone, check whether it's this tightening before assuming
a bug — `latestStatus` gating out non-terminal states is intentional.
