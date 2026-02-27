"use client";

import { useRouter } from "next/navigation";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import React from "react";

export function CancelButton() {
  const router = useRouter();

  const handleCancelClick = () => {
    router.back();
  };

  return (
    <SecondaryButton outlined label="Tidak Jadi" onClick={handleCancelClick} />
  );
}
