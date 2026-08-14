"use client";

import React from "react";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";
import { resolveCreateUserButtonState } from "@/app/(user)/onboarding/user/_utils/create-user-button-state";

export function CreateUserButton() {
  const { status, isClean, isReady, isSignedIn } = useCreateUser();
  const { disabled, loading, label, loadingLabel } = resolveCreateUserButtonState({
    status,
    isClean,
    isReady,
    isSignedIn,
  });

  return (
    <PrimaryButton type="submit" label={label} loadingLabel={loadingLabel} disabled={disabled} loading={loading} />
  );
}
