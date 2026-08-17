export type AccountRedirectVerificationInput = {
  /** From `AccountVerificationWorkEntity.isAwaitingVerification` — never re-derive `latestStatus`. */
  isAwaitingVerification: boolean;
  /** From `AccountVerificationWorkEntity.isRejected` — never re-derive `verificationOutcome`. */
  isRejected: boolean;
};

export type ResolveAccountRedirectParams = {
  pathname: string;
  /** False while the account list is still loading or errored — no redirect decision can be made yet. */
  accountsReady: boolean;
  accountCount: number;
  isCurrentAccountNotFound: boolean;
  /** Null when no verification work is loaded (not yet fetched, or not applicable). */
  verification: AccountRedirectVerificationInput | null;
};

/**
 * Resolves the single redirect an authenticated user's account state requires, or `null` if none
 * applies. Rules are evaluated in order and the first match wins:
 *
 * 1. Not ready yet — no decision.
 * 2. No accounts at all — send to account creation.
 * 3. The session's current account no longer exists — send to the accounts list.
 * 4. The account's verification is awaiting or rejected — send to the KYC summary, UNLESS the
 *    user is already on `/accounts` or anywhere under `/onboarding`. That exemption is load
 *    bearing: without it, a pending user can never reach `/accounts` to reactivate their own
 *    deactivated Clerk org (see `account-card-action-state.ts`), because this redirect would
 *    bounce them straight back out.
 *
 * Never returns `pathname` itself — a redirect equal to the current location is self-redirect
 * churn, not a navigation.
 */
export function resolveAccountRedirect(params: ResolveAccountRedirectParams): string | null {
  if (!params.accountsReady) return null;
  if (params.accountCount === 0) return toDestination("/onboarding/account", params.pathname);
  if (params.isCurrentAccountNotFound) return toDestination("/accounts", params.pathname);

  if (params.verification && (params.verification.isAwaitingVerification || params.verification.isRejected)) {
    const isExempt = params.pathname === "/accounts" || params.pathname.startsWith("/onboarding");
    if (!isExempt) return toDestination("/onboarding/kyc-summary", params.pathname);
  }

  return null;
}

function toDestination(target: string, pathname: string): string | null {
  return target === pathname ? null : target;
}
