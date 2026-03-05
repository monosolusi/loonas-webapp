"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useRouter } from "next/navigation";

export function PayButton() {
  const router = useRouter();

  function handleClick() {
    router.push("./select-payment-method");
  }

  return <PrimaryButton onClick={handleClick} label="Bayar Faktur" />;
}
