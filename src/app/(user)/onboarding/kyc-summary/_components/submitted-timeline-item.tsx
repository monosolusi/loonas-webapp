"use client";

import { useMemo } from "react";
import { TimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/timeline-item";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";

type SubmittedTimelineItemProps = {
  account: { id: string };
};

export function SubmittedTimelineItem(props: SubmittedTimelineItemProps) {
  const { verificationWork, loading } = useGetAccountVerificationWork({ enabled: props.account.id });

  const backgroundColor = useMemo(() => {
    if (loading || !verificationWork) return "bg-neutral-200";

    const backgroundMap: Record<string, string> = {
      [`${VerificationStatus.NEW}.${VerificationOutcome.PENDING}`]: "bg-primary-300",
      [`${VerificationStatus.PROCESSING}.${VerificationOutcome.PENDING}`]: "bg-primary-300",
      [`${VerificationStatus.COMPLETED}.${VerificationOutcome.APPROVED}`]: "bg-success-300",
      [`${VerificationStatus.COMPLETED}.${VerificationOutcome.REJECTED}`]: "bg-error-300",
    };

    const key = `${verificationWork.latestStatus}.${verificationWork.verificationOutcome}`;
    const backgroundColor = backgroundMap[key];
    return backgroundColor ?? "bg-neutral-200";
  }, [verificationWork, loading]);

  return (
    <TimelineItem
      backgroundColor={backgroundColor}
      icon="/assets/images/check-icon-white-w20-h20.svg"
      title="Dokumen Diterima"
      description="Data dan dokumen Anda telah kami terima"
    />
  );
}
