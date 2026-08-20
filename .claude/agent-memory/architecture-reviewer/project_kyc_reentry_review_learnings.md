---
name: project_kyc_reentry_review_learnings
description: Review learnings from fix/kyc-pending-reentry (7 commits, Aug 2026) — new derived-invariant-getter miss, verify-mount-points technique
metadata:
  type: project
---

Review of `fix/kyc-pending-reentry` (commits `9426cc3f`..`fc81011b`, a signed-in pending-KYC
user trapped with no exit + a deactivated Clerk org nothing could reactivate).

**New instance of the derived-invariant-getter drift, on the entity that supposedly fixed it.**
The PR added `AccountVerificationWorkEntity.isCompleted`/`isApproved`/`isRejected` specifically to
give the verification predicate "a single owner on the entity" (commit title, literally). But the
SAME PR then added `PersonalAccountEntity.isApproved` / `BusinessAccountEntity.isApproved` as a
fresh, independent inline two-clause re-spell (`latestStatus === COMPLETED && verificationOutcome
=== APPROVED`) instead of first adding `isCompleted` on those two entities and deriving from it —
recreating the exact drift class the PR was fixing elsewhere, in new code, in the same diff. Lesson:
when a PR introduces a derived-owner getter on one entity, grep sibling entities with the SAME raw
fields (here: `latestStatus`/`verificationOutcome` duplicated across 3 entity classes with no shared
base) for a matching NEW getter that didn't get the same treatment — don't just check that old call
sites were migrated (they were, thoroughly — 6/6). The miss was in the entities themselves, not the
consumers. See [[feedback_centralize_predicate_with_message_helper]] and
[[feedback_usecase_private_method_datastate]] for the sibling family of "sweep was thorough at the
call sites, missed at the source" findings.

**Verify "load bearing" comment claims by tracing actual provider mount points, not just the pure
function's logic.** `resolveAccountRedirect`'s docstring claimed a `pathname.startsWith("/onboarding")`
exemption was "load bearing." Grepping for where `SelectedAccountProvider` (the consumer) actually
mounts (`ProtectedPage` → `(authenticated)/layout.tsx` + `(pos)/layout.tsx` only) showed the
`/onboarding` half of the exemption is currently unreachable — no onboarding route is ever wrapped by
that provider. Two other "SelectedAccountProvider" hits under `onboarding/` were dead comments, not
mounts — read the actual line context before trusting a grep hit as a real reference. Technique:
when a docstring claims a branch is necessary, grep the CONSUMING side's mount points before
accepting the claim; a branch can be well-tested and harmless while still being dead-in-practice,
which is a Minor documentation-accuracy finding, not a functional bug.

**Domain/helpers/ vs app-utils/ vs presentation/helpers/ placement: 3-for-3 correct in this PR,
reinforcing the "primary input type" test.** All three new pure modules
(`resolve-kyc-summary-entry.ts`, `account-card-action-state.ts`, `resolve-account-redirect.ts`) took
a routing/presentation-typed input (pathname, redirect targets, Clerk loading flags) as their primary
input, correctly disqualifying them from `domain/helpers/` per [[project_lns570_review_learnings]]'s
"second disqualifier: input type" rule — even though all three are conceptually close to "domain
state" (verification status, account approval). Good confirming example for future reviews: a
function that CONSUMES domain entity fields but whose primary parameter shape is a page/routing
concern still belongs in presentation, not domain.

**`_components/` cross-route promotion, verified correctly this time.** `use-other-account-action.tsx`
was renamed 100%-identical from `kyc-summary/_components/` to the parent `onboarding/_components/`.
Grepped actual consumers before accepting the move was warranted: it genuinely serves two sibling
routes (`kyc-summary/_components/{rejected,wait-next}-action.tsx` and
`account/@accountType/_components/go-to-sign-in.tsx`), confirming the promote-to-common-ancestor fix
shape from [[feedback_components_cross_route_locality_violation]] was applied correctly, not
speculatively.
