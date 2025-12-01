"use client";

import { PrimaryButton } from "@/core/presentations/components/primary-button";
import React from "react";
import { useRouter } from "next/navigation";

export function CreateUserButton() {
  const router = useRouter();

  const onClick = () => {
    router.push("/onboarding/account");
  };

  return <PrimaryButton type="button" label="Buat User" onClick={onClick} />;
}
