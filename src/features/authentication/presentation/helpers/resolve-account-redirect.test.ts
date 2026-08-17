import { describe, expect, it } from "vitest";
import { resolveAccountRedirect } from "@/features/authentication/presentation/helpers/resolve-account-redirect";

const APPROVED = { isAwaitingVerification: false, isRejected: false };
const AWAITING = { isAwaitingVerification: true, isRejected: false };
const REJECTED = { isAwaitingVerification: false, isRejected: true };

describe("resolveAccountRedirect", () => {
  it("returns null while not ready, regardless of any other input", () => {
    const result = resolveAccountRedirect({
      pathname: "/home",
      accountsReady: false,
      accountCount: 0,
      isCurrentAccountNotFound: true,
      verification: REJECTED,
    });

    expect(result).toBeNull();
  });

  it("sends a user with no accounts to account creation", () => {
    const result = resolveAccountRedirect({
      pathname: "/home",
      accountsReady: true,
      accountCount: 0,
      isCurrentAccountNotFound: false,
      verification: null,
    });

    expect(result).toBe("/onboarding/account");
  });

  it("does not redirect a user with no accounts who is already on the account creation page", () => {
    const result = resolveAccountRedirect({
      pathname: "/onboarding/account",
      accountsReady: true,
      accountCount: 0,
      isCurrentAccountNotFound: false,
      verification: null,
    });

    expect(result).toBeNull();
  });

  it("sends a user whose current account no longer exists to the accounts list", () => {
    const result = resolveAccountRedirect({
      pathname: "/home",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: true,
      verification: null,
    });

    expect(result).toBe("/accounts");
  });

  it("does not self-redirect a not-found current account already on /accounts", () => {
    const result = resolveAccountRedirect({
      pathname: "/accounts",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: true,
      verification: null,
    });

    expect(result).toBeNull();
  });

  it("sends a user with an awaiting verification to the KYC summary", () => {
    const result = resolveAccountRedirect({
      pathname: "/home",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: false,
      verification: AWAITING,
    });

    expect(result).toBe("/onboarding/kyc-summary");
  });

  it("sends a user with a rejected verification to the KYC summary", () => {
    const result = resolveAccountRedirect({
      pathname: "/home",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: false,
      verification: REJECTED,
    });

    expect(result).toBe("/onboarding/kyc-summary");
  });

  it("does not redirect a user with an approved verification", () => {
    const result = resolveAccountRedirect({
      pathname: "/home",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: false,
      verification: APPROVED,
    });

    expect(result).toBeNull();
  });

  it("does not redirect when there is no verification work loaded", () => {
    const result = resolveAccountRedirect({
      pathname: "/home",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: false,
      verification: null,
    });

    expect(result).toBeNull();
  });

  it("regression: a pending user is exempt on /accounts, so they can reach the re-entry card", () => {
    const result = resolveAccountRedirect({
      pathname: "/accounts",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: false,
      verification: AWAITING,
    });

    expect(result).toBeNull();
  });

  it("exempts a rejected user anywhere under /onboarding, including nested paths", () => {
    const result = resolveAccountRedirect({
      pathname: "/onboarding/kyc-summary",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: false,
      verification: REJECTED,
    });

    expect(result).toBeNull();
  });

  it("never returns the current pathname even outside the /accounts and /onboarding exemptions", () => {
    // pathname already equals the verification redirect target itself
    const result = resolveAccountRedirect({
      pathname: "/onboarding/kyc-summary",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: false,
      verification: AWAITING,
    });

    expect(result).toBeNull();
  });

  it("prioritizes the no-accounts rule over a not-found current account", () => {
    const result = resolveAccountRedirect({
      pathname: "/home",
      accountsReady: true,
      accountCount: 0,
      isCurrentAccountNotFound: true,
      verification: REJECTED,
    });

    expect(result).toBe("/onboarding/account");
  });

  it("prioritizes the not-found current account rule over verification status", () => {
    const result = resolveAccountRedirect({
      pathname: "/home",
      accountsReady: true,
      accountCount: 1,
      isCurrentAccountNotFound: true,
      verification: REJECTED,
    });

    expect(result).toBe("/accounts");
  });
});
