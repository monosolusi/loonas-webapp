"use client";

import React from "react";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_providers/personal-account-provider";

type PersonalAccountFormWrapperProps = {
  children: React.ReactNode;
};

export function PersonalAccountFormWrapper(props: PersonalAccountFormWrapperProps) {
  const { submit, isCreating } = usePersonalAccountData();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Re-entry guard: a disabled submit button does not stop Enter-key submission from a text
    // input, so a second submit can still fire while the first is in flight. Without this, a fast
    // double-Enter could send two create-account mutations before `submitStatus` re-renders to
    // "submitting" and disables the button.
    if (isCreating) return;

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
