"use client";

import Image from "next/image";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useRouter } from "next/navigation";

export function RegisterButton() {
  const router = useRouter();

  const onClick = () => {
    router.push("/onboarding/user");
  };

  return (
    <PrimaryButton
      label="Daftar Sekarang"
      type="button"
      rightIcon={<Image src="/assets/images/arrow-right-icon-w16-h16.svg" alt="Arrow Right" width={16} height={16} />}
      className="w-full"
      onClick={onClick}
      inverse
    />
  );
}
