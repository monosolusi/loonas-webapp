"use client";

import React from "react";
import { PrimaryButton } from "@/core/presentations/components/primary-button";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";

export function CreateUserButton() {
  const { isClean, isCreating } = useCreateUser();

  return <PrimaryButton type="submit" label="Buat User" disabled={!isClean} loading={isCreating} />;
}
