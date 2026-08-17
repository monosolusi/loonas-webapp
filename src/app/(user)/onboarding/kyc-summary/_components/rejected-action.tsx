"use client";

import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { UseOtherAccountAction } from "@/app/(user)/onboarding/kyc-summary/_components/use-other-account-action";

type RejectedActionProps = {
  account: { id: string };
};

export function RejectedAction(props: RejectedActionProps) {
  const { verificationWork } = useGetAccountVerificationWork({ enabled: props.account.id });

  if (!verificationWork?.isRejected) return null;
  return <UseOtherAccountAction />;
}
