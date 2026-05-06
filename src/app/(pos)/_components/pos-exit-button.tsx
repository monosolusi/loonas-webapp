"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

export function PosExitButton() {
  const router = useRouter();
  return (
    <SecondaryButton
      outlined
      label="Keluar POS"
      leftIcon={
        <Image src="/assets/images/sign-out-icon-neutral-500-w16-h16.svg" alt="" width={16} height={16} aria-hidden />
      }
      className="w-auto px-4 text-sm"
      onClick={() => router.push("/home")}
    />
  );
}
