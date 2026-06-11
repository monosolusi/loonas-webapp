import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { VerificationWorkSummaryModel } from "@/features/kyc-review/data/models/verification-work-summary";
import { VerificationWorkDetailModel } from "@/features/kyc-review/data/models/verification-work-detail";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { ReviewAction } from "@/features/kyc-review/domain/enums/review-action";


export interface KycReviewService {
  listWorks(
    params: { status?: VerificationWorkStatus },
    session: SessionEntity,
  ): Promise<VerificationWorkSummaryModel[]>;

  getWork(id: string, session: SessionEntity): Promise<VerificationWorkDetailModel>;

  claimWork(id: string, session: SessionEntity): Promise<{ id: string }>;

  reviewWork(
    id: string,
    action: ReviewAction,
    notes: string | undefined,
    session: SessionEntity,
  ): Promise<void>;
}
