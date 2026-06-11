import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { KycReviewRepository } from "@/features/kyc-review/domain/repositories/kyc-review";

export class ClaimVerificationWorkUseCaseParams {
  constructor(public readonly id: string) {}
}

export class ClaimVerificationWorkUseCase
  implements UseCase<DataState<{ id: string }>, ClaimVerificationWorkUseCaseParams>
{
  constructor(
    private readonly kycReviewRepository: KycReviewRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ClaimVerificationWorkUseCaseParams): Promise<DataState<{ id: string }>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const result = await this.kycReviewRepository.claimWork(params.id, session.data);
      if (result instanceof DataFailed) throw result.error;

      return result;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
