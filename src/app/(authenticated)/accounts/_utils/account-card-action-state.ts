export type AccountCardActionState = "current" | "enter-dashboard" | "view-verification";

export type ResolveAccountCardActionParams = {
  /** Whether this card represents the Clerk org the session is currently active on. */
  isCurrent: boolean;
  /** From the account entity's `isApproved` getter — never re-derive `latestStatus`/`verificationOutcome` here. */
  isApproved: boolean;
};

/**
 * Resolves which action a card's button should offer, and therefore whether it is disabled.
 *
 * The button must never be the only thing standing between the user and a blocked account: a
 * pending or rejected account still gets a clickable action ("view-verification") that reactivates
 * its Clerk org and routes to the status page — it is the only affordance in the app that can do
 * so once the org has been deactivated. Only the account already active gets a disabled state, and
 * that disablement is a status label ("Sedang Digunakan"), not a block.
 */
export function resolveAccountCardAction(params: ResolveAccountCardActionParams): AccountCardActionState {
  if (params.isCurrent) return "current";
  return params.isApproved ? "enter-dashboard" : "view-verification";
}
