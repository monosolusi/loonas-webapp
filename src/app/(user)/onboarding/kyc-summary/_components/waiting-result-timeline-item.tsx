"use client";

import { TimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/timeline-item";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";

type WaitingResultTimelineItemProps = {
  account: { id: string };
};

export function WaitingResultTimelineItem(props: WaitingResultTimelineItemProps) {
  const { verificationWork } = useGetAccountVerificationWork({ enabled: props.account.id });

  if (verificationWork?.isCompleted) return null;
  return (
    <TimelineItem
      backgroundColor="bg-neutral-200"
      title="Menunggu Hasil"
      description="Anda akan menerima notifikasi ketika kami menyelesaikan verifikasi."
      isLast
    />
  );
}
