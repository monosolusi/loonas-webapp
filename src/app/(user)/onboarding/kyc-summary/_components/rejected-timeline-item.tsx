"use client";

import { TimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/timeline-item";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";

type RejectedTimelineItemProps = {
  account: { id: string };
};

export function RejectedTimelineItem(props: RejectedTimelineItemProps) {
  const { verificationWork } = useGetAccountVerificationWork({ enabled: props.account.id });

  if (verificationWork?.verificationOutcome !== VerificationOutcome.REJECTED) return null;
  return (
    <TimelineItem
      backgroundColor="bg-error-300"
      icon="/assets/images/cross-circle-icon-white-w20-h20.svg"
      title="Verifikasi Ditolak"
      description="Silakan hubungi customer support"
      isLast
    />
  );
}
