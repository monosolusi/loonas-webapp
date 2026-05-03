import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";
import { PaymentMethodRepository } from "@/features/pos/domain/repositories/payment-method";

export class ListPaymentMethodsUseCaseParams {
  constructor(public readonly isEnabled?: boolean) {}
}

export class ListPaymentMethodsUseCase
  implements UseCase<DataState<PaymentMethodEntity[]>, ListPaymentMethodsUseCaseParams>
{
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListPaymentMethodsUseCaseParams): Promise<DataState<PaymentMethodEntity[]>> {
    try {
      const session = await this.resolveSession();
      const methods = await this.listMethods(params, session);
      return new DataSuccess(methods);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async listMethods(
    params: ListPaymentMethodsUseCaseParams,
    session: SessionEntity,
  ): Promise<PaymentMethodEntity[]> {
    const result = await this.paymentMethodRepository.list({ isEnabled: params.isEnabled }, session);
    if (result instanceof DataFailed) throw result.error;
    return result.data?.paymentMethods ?? [];
  }
}
