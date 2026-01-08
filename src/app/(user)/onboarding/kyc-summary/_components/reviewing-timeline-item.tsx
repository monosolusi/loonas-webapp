"use client";

import { useMemo } from "react";
import { TimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/timeline-item";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";

type ReviewingTimelineItemProps = {
  account: { id: string };
};

export function ReviewingTimelineItem(props: ReviewingTimelineItemProps) {
  const { loading, verificationWork } = useGetAccountVerificationWork({ accountId: props.account.id });

  const backgroundColor = useMemo(() => {
    if (loading || !verificationWork) return "bg-neutral-200";
    const backgroundMap: Record<string, string> = {
      [`${VerificationStatus.NEW}.${VerificationOutcome.PENDING}`]: "bg-neutral-200",
      [`${VerificationStatus.PROCESSING}.${VerificationOutcome.PENDING}`]: "bg-primary-300",
      [`${VerificationStatus.COMPLETED}.${VerificationOutcome.APPROVED}`]: "bg-success-300",
      [`${VerificationStatus.COMPLETED}.${VerificationOutcome.REJECTED}`]: "bg-error-300",
    };

    const key = `${verificationWork.latestStatus}.${verificationWork.verificationOutcome}`;
    const backgroundColor = backgroundMap[key];
    return backgroundColor ?? "bg-neutral-200";
  }, [loading, verificationWork]);

  return (
    <TimelineItem
      backgroundColor={backgroundColor}
      icon={backgroundColor === "bg-neutral-200" ? "" : "/assets/images/time-icon-white-w20-h20.svg"}
      title="Peninjauan"
      description="Tim kami sedang melakukan verifikasi."
    />
  );
}
