"use client";

import React from "react";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";

type PersonalAccountFormWrapperProps = {
  children: React.ReactNode;
};

export function PersonalAccountFormWrapper(props: PersonalAccountFormWrapperProps) {
  const { submit, isCreating } = usePersonalAccountData();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // `submit()` owns the incomplete case itself — it reveals the offending steps' errors and
    // navigates to the first one. Nothing here needs to pre-check, and nothing may throw: React
    // does not await onSubmit, so a throw would surface to the user as silence.
    await submit();
  };

  return (
    <form onSubmit={onSubmit} aria-busy={isCreating}>
      {props.children}
    </form>
  );
}
