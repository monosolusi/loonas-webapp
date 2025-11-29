import { PrimaryButton } from "@/core/presentations/components/primary-button";
import Image from "next/image";
import React from "react";

export function NextButton() {
  return (
    <PrimaryButton
      type="button"
      label="Selanjutnya"
      rightIcon={
        <Image src="/assets/images/arrow-right-icon-white-w16-h16.svg" alt="Arrow Right" width={16} height={16} />
      }
    />
  );
}
