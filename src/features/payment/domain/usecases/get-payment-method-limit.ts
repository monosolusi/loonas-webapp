import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { UseCase } from "@/core/resources/use-case";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaymentMethodLimitEntity } from "@/features/payment/domain/entities/payment-method-limit";
import { LimitRepository } from "@/features/transaction-monitoring/domain/repositories/limit";

export class GetPaymentMethodLimitUseCaseParams {
  public id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
  }
}

export class GetPaymentMethodLimitUseCase
  implements UseCase<DataState<PaymentMethodLimitEntity>, GetPaymentMethodLimitUseCaseParams>
{
  constructor(
    private readonly limitRepository: LimitRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetPaymentMethodLimitUseCaseParams): Promise<DataState<PaymentMethodLimitEntity>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    return this.limitRepository.getPaymentMethodLimit({ id: params.id }, session.data);
  }
}
