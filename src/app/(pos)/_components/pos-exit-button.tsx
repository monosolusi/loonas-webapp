"use client";

import { useRouter } from "next/navigation";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

export function PosExitButton() {
  const router = useRouter();
  return (
    <SecondaryButton
      outlined
      label="Keluar POS"
      className="w-auto px-4 text-sm"
      onClick={() => router.push("/home")}
    />
  );
}
