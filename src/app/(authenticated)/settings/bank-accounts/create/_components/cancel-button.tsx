"use client";

import { useRouter } from "next/navigation";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import React from "react";

export function CancelButton() {
  const router = useRouter();

  const handleCancelClick = () => {
    router.back();
  };

  return (
    <OutlinedButton
      onClick={handleCancelClick}
    >
      Tidak Jadi
    </OutlinedButton>
  );
}
