import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { KycReviewRepository } from "@/features/kyc-review/domain/repositories/kyc-review";
import { KycReviewService } from "@/features/kyc-review/domain/sources/kyc-review";
import { VerificationWorkSummaryEntity } from "@/features/kyc-review/domain/entities/verification-work-summary";
import { VerificationWorkDetailEntity } from "@/features/kyc-review/domain/entities/verification-work-detail";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { ReviewAction } from "@/features/kyc-review/domain/enums/review-action";

export class KycReviewRepositoryImpl implements KycReviewRepository {
  constructor(private readonly kycReviewService: KycReviewService) {}

  public async listWorks(
    params: { status?: VerificationWorkStatus; page?: number; limit?: number },
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<VerificationWorkSummaryEntity>>> {
    try {
      const { data, meta } = await this.kycReviewService.listWorks(params, session);
      return new DataSuccess({ data: data.map((work) => work.toEntity()), meta: meta.toMeta() });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getWork(id: string, session: SessionEntity): Promise<DataState<VerificationWorkDetailEntity>> {
    try {
      const work = await this.kycReviewService.getWork(id, session);
      return new DataSuccess(work.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async claimWork(id: string, session: SessionEntity): Promise<DataState<{ id: string }>> {
    try {
      const work = await this.kycReviewService.claimWork(id, session);
      return new DataSuccess(work);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async reviewWork(
    id: string,
    action: ReviewAction,
    notes: string | undefined,
    session: SessionEntity,
  ): Promise<DataState<void>> {
    try {
      await this.kycReviewService.reviewWork(id, action, notes, session);
      return new DataSuccess();
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
