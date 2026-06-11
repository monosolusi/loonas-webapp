import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { VerificationWorkSummaryEntity } from "@/features/kyc-review/domain/entities/verification-work-summary";
import { VerificationWorkDetailEntity } from "@/features/kyc-review/domain/entities/verification-work-detail";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { ReviewAction } from "@/features/kyc-review/domain/enums/review-action";

export interface KycReviewRepository {
  listWorks(
    params: { status?: VerificationWorkStatus },
    session: SessionEntity,
  ): Promise<DataState<VerificationWorkSummaryEntity[]>>;

  getWork(id: string, session: SessionEntity): Promise<DataState<VerificationWorkDetailEntity>>;

  claimWork(id: string, session: SessionEntity): Promise<DataState<{ id: string }>>;

  reviewWork(
    id: string,
    action: ReviewAction,
    notes: string | undefined,
    session: SessionEntity,
  ): Promise<DataState<void>>;
}
