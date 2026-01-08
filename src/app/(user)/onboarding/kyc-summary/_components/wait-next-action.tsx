"use client";

import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";

type WaitNextActionProps = {
  account: { id: string };
};

export function WaitNextAction(props: WaitNextActionProps) {
  const { verificationWork } = useGetAccountVerificationWork({ accountId: props.account.id });

  if (verificationWork?.latestStatus === VerificationStatus.COMPLETED) return null;
  return (
    <div className="flex flex-row text-center">
      <div className="w-full text-sm leading-5 font-normal text-neutral-200">Mohon tunggu verifikasi selesai.</div>
    </div>
  );
}
