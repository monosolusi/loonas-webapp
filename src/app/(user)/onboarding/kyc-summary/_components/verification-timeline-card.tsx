import { SubmittedTimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/submitted-timeline-item";
import { ReviewingTimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/reviewing-timeline-item";
import { RejectedTimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/rejected-timeline-item";
import { WaitingResultTimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/waiting-result-timeline-item";
import { ApprovedTimelineItem } from "@/app/(user)/onboarding/kyc-summary/_components/approved-timeline-item";

type VerificationTimelineCardProps = {
  account: { id: string };
};

export function VerificationTimelineCard(props: VerificationTimelineCardProps) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-5">
      <div className="flex w-full flex-col gap-y-6">
        <div className="text-base leading-6 font-semibold">Proses Verifikasi</div>
        {/*  Timeline */}
        <div className="flex flex-col gap-y-5">
          <SubmittedTimelineItem account={props.account} />

          <ReviewingTimelineItem account={props.account} />

          <WaitingResultTimelineItem account={props.account} />
          <ApprovedTimelineItem account={props.account} />
          <RejectedTimelineItem account={props.account} />
        </div>
      </div>
    </div>
  );
}
