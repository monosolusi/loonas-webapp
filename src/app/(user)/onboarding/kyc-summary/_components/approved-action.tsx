"use client";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ApprovedActionProps = {
  account: { id: string };
};

export function ApprovedAction(props: ApprovedActionProps) {
  const { verificationWork } = useGetAccountVerificationWork({ accountId: props.account.id });
  const router = useRouter();

  const onClick = () => router.replace("/home");

  if (verificationWork?.verificationOutcome !== VerificationOutcome.APPROVED) return null;
  return (
    <PrimaryButton
      label="Mulai Gunakan Loonas"
      onClick={onClick}
      rightIcon={
        <Image src="/assets/images/arrow-right-icon-white-w16-h16.svg" alt="right arrow" width={16} height={16} />
      }
    />
  );
}
