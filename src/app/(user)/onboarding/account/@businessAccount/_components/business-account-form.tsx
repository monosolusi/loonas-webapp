"use client";

import React from "react";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";

type BusinessAccountFormWrapperProps = {
  children: React.ReactNode;
};

export function BusinessAccountFormWrapper(props: BusinessAccountFormWrapperProps) {
  const { submit, isCreating, clearSubmitError, markSubmitAttempted } = useBusinessAccountData();

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
