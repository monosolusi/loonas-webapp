import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { KycReviewRepository } from "@/features/kyc-review/domain/repositories/kyc-review";
import { VerificationWorkSummaryEntity } from "@/features/kyc-review/domain/entities/verification-work-summary";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";

export class ListVerificationWorksUseCaseParams {
  constructor(public readonly status?: VerificationWorkStatus) {}
}

export class ListVerificationWorksUseCase
  implements UseCase<DataState<VerificationWorkSummaryEntity[]>, ListVerificationWorksUseCaseParams>
{
  constructor(
    private readonly kycReviewRepository: KycReviewRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(
    params: ListVerificationWorksUseCaseParams,
  ): Promise<DataState<VerificationWorkSummaryEntity[]>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const result = await this.kycReviewRepository.listWorks({ status: params.status }, session.data);
      if (result instanceof DataFailed) throw result.error;

      return result;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
