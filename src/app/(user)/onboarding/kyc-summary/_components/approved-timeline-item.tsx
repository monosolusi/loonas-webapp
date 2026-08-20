"use client";

import { TimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/timeline-item";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";

type ApprovedTimelineItemProps = {
  account: { id: string };
};

export function ApprovedTimelineItem(props: ApprovedTimelineItemProps) {
  const { verificationWork } = useGetAccountVerificationWork({ enabled: props.account.id });

  if (!verificationWork?.isApproved) return null;
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
