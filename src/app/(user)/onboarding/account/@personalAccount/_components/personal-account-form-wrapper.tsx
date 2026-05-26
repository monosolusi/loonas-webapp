"use client";

import React from "react";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";

type PersonalAccountFormWrapperProps = {
  children: React.ReactNode;
};

export function PersonalAccountFormWrapper(props: PersonalAccountFormWrapperProps) {
  const { submit, isCreating, clearSubmitError, markSubmitAttempted } = usePersonalAccountData();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    markSubmitAttempted?.();
    clearSubmitError();
    await submit();
  };

  return (
    <form onSubmit={onSubmit} aria-busy={isCreating}>
      {props.children}
    </form>
  );
}
