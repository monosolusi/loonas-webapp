"use client";

import { PrimaryButton } from "@/core/presentations/components/primary-button";
import React from "react";
import { useRouter } from "next/navigation";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";

export function CreateUserButton() {
  const router = useRouter();
  const { createUser, isClean } = useCreateUser();

  const onClick = () => {
    // if (isClean) router.push("/onboarding/account");
  };

  return <PrimaryButton type="button" label="Buat User" onClick={onClick} disabled={!isClean} />;
}
