"use client";

import React, { useMemo } from "react";
import { PrimaryButton } from "@/core/presentations/components/primary-button";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";
import { useAuth } from "@clerk/nextjs";

export function CreateUserButton() {
  const { isClean, isCreating } = useCreateUser();
  const { isLoaded, isSignedIn } = useAuth();

  const disabled = useMemo(() => {
    return !isClean || !isLoaded || isSignedIn;
  }, [isClean, isLoaded, isSignedIn]);

  return <PrimaryButton type="submit" label="Buat User" disabled={disabled} loading={isCreating} />;
}
