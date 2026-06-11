"use client";

import { useUser } from "@clerk/nextjs";
import { useKycReviewActions } from "@/features/kyc-review/presentations/hooks/use-kyc-review-actions";
import { ReviewActionPanel } from "@/features/kyc-review/presentations/components/review-action-panel";
import { ReviewAction } from "@/features/kyc-review/domain/enums/review-action";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { SectionCard } from "@/core/presentations/components/section-card";

interface ReviewActionPanelImplProps {
  workId: string;
  workStatus: VerificationWorkStatus;
  executorEmail?: string | null;
  workNotes?: string | null;
  onClaimed?: () => void;
}

export function ReviewActionPanelImpl({ workId, workStatus, executorEmail, workNotes, onClaimed }: ReviewActionPanelImplProps) {
  const { user } = useUser();
  const actions = useKycReviewActions({ workId, workStatus, onClaimed });

  // If PROCESSING but claimed by someone else, show read-only state
  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
  const isClaimedByOther =
    workStatus === VerificationWorkStatus.PROCESSING && executorEmail && currentUserEmail !== executorEmail;

  if (isClaimedByOther) {
    return (
      <SectionCard title="Tinjauan" iconSrc="/assets/images/check-circle-icon-neutral-400-w16-h16.svg">
        <div className="rounded-lg bg-warning-50 px-4 py-3">
          <span className="text-sm font-medium text-warning-500">
            Sedang ditinjau oleh {executorEmail}
          </span>
        </div>
      </SectionCard>
    );
  }

  return (
    <ReviewActionPanel
      phase={actions.phase}
      workStatus={actions.workStatus}
      workNotes={workNotes}
      reviewOutcome={actions.reviewOutcome}
      onStartReview={() => actions.startReview()}
      onRetryReview={() => actions.retryReview()}
      onSubmitApprove={() => actions.submitReview({ action: ReviewAction.APPROVE })}
      onSubmitReject={(notes) => actions.submitReview({ action: ReviewAction.REJECT, notes })}
      claimError={actions.claimError}
      reviewError={actions.reviewError}
    />
  );
}
