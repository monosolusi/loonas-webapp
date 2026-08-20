"use client";

import React from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useBusinessAccountState } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";

type BusinessAccountContextValue = ReturnType<typeof useBusinessAccountState>;

type BusinessAccountProviderProps = {
  children: React.ReactNode;
};

const BusinessAccountContext = React.createContext<BusinessAccountContextValue | null>(null);

/**
 * Mounts a SINGLE instance of the business-account submit state (via `useBusinessAccountState`)
 * and shares it through context, so every consumer — form wrapper, submit button, error/incomplete
 * banners, and the three step pages — reads and writes the same `submitStatus` / `submitError` /
 * `createdAccountId`, instead of each call site getting its own permanently-initial `useState`.
 * Must be mounted OUTSIDE the form wrapper, and only once the account type is confirmed to be
 * "business" (the underlying hook throws otherwise).
 */
export function BusinessAccountProvider(props: BusinessAccountProviderProps) {
  const value = useBusinessAccountState();

  return <BusinessAccountContext.Provider value={value}>{props.children}</BusinessAccountContext.Provider>;
}

export function useBusinessAccountData() {
  const context = React.useContext(BusinessAccountContext);
  if (!context) throw new ServerError(ErrorCodes.INVALID_BUSINESS_ACCOUNT_HOOK_CALL);
  return context;
}
