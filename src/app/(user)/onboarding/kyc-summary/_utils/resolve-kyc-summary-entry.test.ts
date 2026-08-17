import { describe, expect, it } from "vitest";
import { resolveKycSummaryEntry } from "@/app/(user)/onboarding/kyc-summary/_utils/resolve-kyc-summary-entry";

const AUTH_LOADED = [true, false];
const IS_SIGNED_IN = [true, false, undefined];
const ORG_LOADED = [true, false];
const ORGANIZATION_ID = ["org_1", null, undefined];
const ACCOUNTS_LOADING = [true, false];
const ACCOUNT_COUNT = [0, 3];

describe("resolveKycSummaryEntry — the never-blank invariant", () => {
  it("never yields a state that renders nothing and redirects nowhere, for any input", () => {
    // This is the whole point of the module. `kyc-summary/page.tsx` was
    // `if (!isLoaded || !organization) return null;` — a signed-out visitor, or anyone with no
    // active Clerk org (there is no auth guard on this route at all), got a permanently blank
    // page. Exhaustively walk the input space: every combination must resolve to a well-formed
    // `loading` | `redirect` (truthy target) | `ready` (truthy organizationId) outcome.
    for (const authLoaded of AUTH_LOADED) {
      for (const isSignedIn of IS_SIGNED_IN) {
        for (const orgLoaded of ORG_LOADED) {
          for (const organizationId of ORGANIZATION_ID) {
            for (const accountsLoading of ACCOUNTS_LOADING) {
              for (const accountCount of ACCOUNT_COUNT) {
                const entry = resolveKycSummaryEntry({
                  authLoaded,
                  isSignedIn,
                  orgLoaded,
                  organizationId,
                  accountsLoading,
                  accountCount,
                });

                expect(["loading", "redirect", "ready"]).toContain(entry.kind);
                if (entry.kind === "redirect") expect(entry.to).toBeTruthy();
                if (entry.kind === "ready") expect(entry.organizationId).toBeTruthy();
              }
            }
          }
        }
      }
    }
  });
});

describe("resolveKycSummaryEntry — per-state behavior", () => {
  const BASE = {
    authLoaded: true,
    isSignedIn: true,
    orgLoaded: true,
    organizationId: "org_1",
    accountsLoading: false,
    accountCount: 3,
  };

  it("stays loading until Clerk auth itself has loaded", () => {
    expect(resolveKycSummaryEntry({ ...BASE, authLoaded: false })).toEqual({ kind: "loading" });
  });

  it("redirects a signed-out visitor to sign-in, regardless of org/account state", () => {
    expect(resolveKycSummaryEntry({ ...BASE, isSignedIn: false })).toEqual({ kind: "redirect", to: "/sign-in" });
    expect(resolveKycSummaryEntry({ ...BASE, isSignedIn: undefined })).toEqual({
      kind: "redirect",
      to: "/sign-in",
    });
  });

  it("stays loading while the organization membership itself has not loaded yet", () => {
    expect(resolveKycSummaryEntry({ ...BASE, orgLoaded: false })).toEqual({ kind: "loading" });
  });

  it("is ready once an active organization is present, without waiting on the accounts list", () => {
    expect(resolveKycSummaryEntry({ ...BASE, accountsLoading: true })).toEqual({
      kind: "ready",
      organizationId: "org_1",
    });
  });

  it("waits for the accounts list before deciding where a no-org user goes", () => {
    expect(
      resolveKycSummaryEntry({ ...BASE, organizationId: null, accountsLoading: true }),
    ).toEqual({ kind: "loading" });
  });

  it("sends a user with zero accounts into onboarding, not the accounts switcher", () => {
    expect(
      resolveKycSummaryEntry({ ...BASE, organizationId: null, accountsLoading: false, accountCount: 0 }),
    ).toEqual({ kind: "redirect", to: "/onboarding/account" });
  });

  it("sends a user with existing accounts but no active org to the accounts switcher", () => {
    expect(
      resolveKycSummaryEntry({ ...BASE, organizationId: null, accountsLoading: false, accountCount: 3 }),
    ).toEqual({ kind: "redirect", to: "/accounts" });
  });

  it("treats an undefined organizationId the same as null", () => {
    expect(
      resolveKycSummaryEntry({ ...BASE, organizationId: undefined, accountsLoading: false, accountCount: 0 }),
    ).toEqual({ kind: "redirect", to: "/onboarding/account" });
  });
});
