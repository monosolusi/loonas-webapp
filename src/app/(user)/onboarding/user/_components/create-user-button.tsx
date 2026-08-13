"use client";

import React, { useMemo } from "react";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";

export function CreateUserButton() {
  const { isClean, isCreating, isReady, isSignedIn } = useCreateUser();

  const disabled = useMemo(() => {
    return !isClean || !isReady || isSignedIn;
  }, [isClean, isReady, isSignedIn]);

  return <PrimaryButton type="submit" label="Buat User" disabled={disabled} loading={isCreating} />;
}
