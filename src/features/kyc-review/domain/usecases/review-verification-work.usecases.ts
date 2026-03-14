import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { KycReviewRepository } from "@/features/kyc-review/domain/repositories/kyc-review";
import { ReviewAction } from "@/features/kyc-review/domain/enums/review-action";

export class ReviewVerificationWorkUseCaseParams {
  public readonly id: string;
  public readonly action: ReviewAction;
  public readonly notes?: string;

  constructor(args: { id: string; action: ReviewAction; notes?: string }) {
    this.id = args.id;
    this.action = args.action;
    this.notes = args.notes;
  }
}

export class ReviewVerificationWorkUseCase
  implements UseCase<DataState<void>, ReviewVerificationWorkUseCaseParams>
{
  constructor(
    private readonly kycReviewRepository: KycReviewRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ReviewVerificationWorkUseCaseParams): Promise<DataState<void>> {
    try {
      if (params.action === ReviewAction.REJECT && !params.notes) {
        throw new ServerError(ErrorCodes.INCOMPLETE_FORM);
      }

      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const result = await this.kycReviewRepository.reviewWork(params.id, params.action, params.notes, session.data);
      if (result instanceof DataFailed) throw result.error;

      return result;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
