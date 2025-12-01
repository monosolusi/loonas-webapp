import Image from "next/image";
import { SecondaryButton } from "@/core/presentations/components/secondary-button";

export function PreviousButton() {
  return (
    <SecondaryButton
      label="Kembali"
      leftIcon={
        <Image src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg" alt="Left Icon" width={16} height={16} />
      }
      outlined
    />
  );
}
