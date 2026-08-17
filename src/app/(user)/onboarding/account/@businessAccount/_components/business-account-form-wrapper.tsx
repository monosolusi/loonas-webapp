"use client";

import React from "react";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";

type BusinessAccountFormWrapperProps = {
  children: React.ReactNode;
};

export function BusinessAccountFormWrapper(props: BusinessAccountFormWrapperProps) {
  const { submit, isCreating } = useBusinessAccountData();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // `submit()` owns the incomplete case itself — it reveals the offending steps' errors and
    // navigates to the first one. Nothing here may throw: React does not await onSubmit, so a
    // throw would surface to the user as silence.
    await submit();
  };

  return (
    <form onSubmit={onSubmit} aria-busy={isCreating}>
      {props.children}
    </form>
  );
}
