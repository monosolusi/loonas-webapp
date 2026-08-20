export type KycSummaryRedirectTarget = "/sign-in" | "/accounts" | "/onboarding/account";

export type KycSummaryEntry =
  | { kind: "loading" }
  | { kind: "redirect"; to: KycSummaryRedirectTarget }
  | { kind: "ready"; organizationId: string };

export type ResolveKycSummaryEntryInput = {
  authLoaded: boolean;
  isSignedIn: boolean | undefined;
  orgLoaded: boolean;
  organizationId: string | null | undefined;
  accountsLoading: boolean;
  accountCount: number;
};

/**
 * Pure entry resolver for `/onboarding/kyc-summary`. The page previously did
 * `if (!isLoaded || !organization) return null;` — a route with NO auth guard at all (only
 * `account/layout.tsx` checks `isSignedIn`), so a signed-out visitor or anyone with no active
 * Clerk org got a permanently blank page.
 *
 * The invariant, regression-tested exhaustively over the input space: **no input yields a state
 * that renders nothing and redirects nowhere.** Every input maps to exactly one of three outcomes —
 * `loading` (render a skeleton), `redirect` (navigate to a concrete, truthy target), or `ready`
 * (render the page with a guaranteed non-null organization id). There is no fourth "do nothing"
 * branch to fall into.
 */
export function resolveKycSummaryEntry(input: ResolveKycSummaryEntryInput): KycSummaryEntry {
  const { authLoaded, isSignedIn, orgLoaded, organizationId, accountsLoading, accountCount } = input;

  if (!authLoaded) return { kind: "loading" };
  if (!isSignedIn) return { kind: "redirect", to: "/sign-in" };
  if (!orgLoaded) return { kind: "loading" };
  if (organizationId) return { kind: "ready", organizationId };

  // Signed in, but no active org — decide where to send them based on whether they have any
  // account at all. GET /accounts is USER-scoped (Bearer token only), so it resolves without an
  // active org.
  if (accountsLoading) return { kind: "loading" };
  return { kind: "redirect", to: accountCount === 0 ? "/onboarding/account" : "/accounts" };
}
