"use client";

import { FilledButton } from "@/core/presentations/components/filled-button";
import { useRouter } from "next/navigation";

export function PayButton() {
  const router = useRouter();

  function handleClick() {
    router.push("./select-payment-method");
  }

  return <FilledButton onClick={handleClick}>Bayar Faktur</FilledButton>;
}
