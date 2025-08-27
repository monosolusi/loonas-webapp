import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { CreditCardFullRedirectPayInDetailEntity } from "@/features/payment/domain/entities/cc-full-redirect-pay-in-detail";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CreditCardFullRedirectPayInRepository } from "@/features/payment/data/repositories/cc-full-redirect-pay-in";
import { PayInDetailRepository } from "@/features/payment/domain/repositories/pay-in-detail";

export class RetrieveCreditCardFullRedirectPayInDetailUseCaseParams {
  public requestId: string;

  constructor(args: { requestId: string }) {
    this.requestId = args.requestId;
  }
}

export class RetrieveCreditCardFullRedirectPayInDetailUseCase
  implements
    UseCase<DataState<CreditCardFullRedirectPayInDetailEntity>, RetrieveCreditCardFullRedirectPayInDetailUseCaseParams>
{
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly payInRepository: PayInDetailRepository,
  ) {}

  public async execute(
    params: RetrieveCreditCardFullRedirectPayInDetailUseCaseParams,
  ): Promise<DataState<CreditCardFullRedirectPayInDetailEntity>> {
    try {
      if (!(this.payInRepository instanceof CreditCardFullRedirectPayInRepository))
        throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.payInRepository.getDetail({ requestId: params.requestId }, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
