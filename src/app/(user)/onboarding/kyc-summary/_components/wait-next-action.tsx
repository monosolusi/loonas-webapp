"use client";

import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { UseOtherAccountAction } from "@/app/(user)/onboarding/kyc-summary/_components/use-other-account-action";

type WaitNextActionProps = {
  account: { id: string };
};

export function WaitNextAction(props: WaitNextActionProps) {
  const { verificationWork } = useGetAccountVerificationWork({ accountId: props.account.id });

  if (verificationWork?.latestStatus === VerificationStatus.COMPLETED) return null;
  return (
    <div className="flex flex-col gap-y-2 text-center">
      <div className="w-full text-sm leading-5 font-normal text-neutral-200">Mohon tunggu verifikasi selesai.</div>
      <UseOtherAccountAction />
    </div>
  );
}
