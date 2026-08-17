"use client";

import React from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { usePersonalAccountState } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";

type PersonalAccountContextValue = ReturnType<typeof usePersonalAccountState>;

type PersonalAccountProviderProps = {
  children: React.ReactNode;
};

const PersonalAccountContext = React.createContext<PersonalAccountContextValue | null>(null);

/**
 * Mounts a SINGLE instance of the personal-account submit state (via `usePersonalAccountState`)
 * and shares it through context, so every consumer — form wrapper, submit button, error/incomplete
 * banners, and the three step pages — reads and writes the same `submitStatus` / `submitError` /
 * `createdAccountId`, instead of each call site getting its own permanently-initial `useState`.
 * Must be mounted OUTSIDE the form wrapper, and only once the account type is confirmed to be
 * "personal" (the underlying hook throws otherwise).
 */
export function PersonalAccountProvider(props: PersonalAccountProviderProps) {
  const value = usePersonalAccountState();

  return <PersonalAccountContext.Provider value={value}>{props.children}</PersonalAccountContext.Provider>;
}

export function usePersonalAccountData() {
  const context = React.useContext(PersonalAccountContext);
  if (!context) throw new ServerError(ErrorCodes.INVALID_PERSONAL_ACCOUNT_HOOK_CALL);
  return context;
}
