---
name: project_kyc_rejected_escape_hatch
description: LNS-387 — KYC rejected state escape hatch design decisions: placement, a11y upgrade, blast radius
metadata:
  type: project
---

## Decision: RejectedNextAction component pattern

For the REJECTED KYC state, a new `RejectedNextAction` component is added as a sibling to `WaitNextAction` and `ApprovedAction` inside `NextActionSection`. It wraps `UseOtherAccountAction` with the same `flex flex-col gap-y-2 text-center` shell.

**Why:** `WaitNextAction` gates on `latestStatus !== COMPLETED` so it returns null when REJECTED. A new sibling avoids touching the pending path while surfacing the escape hatch.

**How to apply:** Always create status-specific action wrappers as siblings in `next-action-section.tsx`, not by modifying existing wrappers.

## Decision: No copy added to RejectedNextAction

The component renders only `<UseOtherAccountAction />` — no additional label, no "atau" separator. The `StatusBox` and the page-level Support Card already carry the "hubungi support" guidance.

**Why:** Adding copy would be a third instance of the support message; the design system tone is calm and non-repetitive.

## Decision: UseOtherAccountAction semantic upgrade (<div> → <button>)

The `<div onClick>` must be upgraded to `<button type="button">` with Tailwind resets (`appearance-none bg-transparent border-0 p-0`) and a focus ring (`focus-visible:ring-2 focus-visible:ring-primary-300/20 rounded`).

**Why:** In the REJECTED state this is the sole escape action for an eligible user — making it keyboard-unreachable is a WCAG failure at a critical moment.

**Blast radius:** `UseOtherAccountAction` is also used in `WaitNextAction` (pending state). The upgrade is additive there too — no behavioral regression. EL must apply Tailwind button resets to avoid browser-default button styles bleeding in.

## Decision: Text-link weight preserved, not upgraded to button variant

"Pakai Akun Lainnya" stays at `text-primary-300 text-sm hover:underline` — secondary/link weight. It must NOT become a `PrimaryButton` or outline button in the rejected state, because the primary directive is support contact, not account switch.

**How to apply:** Whenever surfacing a secondary escape in an error/terminal state, use text-link weight (text-sm, text-primary-300, hover:underline), not a button component. Reserve `PrimaryButton` for the single highest-intent action on the screen.
