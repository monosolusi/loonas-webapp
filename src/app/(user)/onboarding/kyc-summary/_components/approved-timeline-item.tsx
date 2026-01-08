"use client";

import { TimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/timeline-item";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";

type ApprovedTimelineItemProps = {
  account: { id: string };
};

export function ApprovedTimelineItem(props: ApprovedTimelineItemProps) {
  const { verificationWork } = useGetAccountVerificationWork({ accountId: props.account.id });

  if (verificationWork?.verificationOutcome !== VerificationOutcome.APPROVED) return null;
  return (
    <TimelineItem
      backgroundColor="bg-success-300"
      icon="/assets/images/check-icon-white-w20-h20.svg"
      title="Verifikasi Berhasil"
      description="Akun Anda sudah aktif dan siap digunakan"
      isLast
    />
  );
}
