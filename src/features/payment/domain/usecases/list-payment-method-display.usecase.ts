import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PaymentMethodCategoryEntity } from "@/features/payment/domain/entities/payment-method-category.entity";
import { PaymentMethodRepository } from "@/features/payment/domain/repositories/payment-method.repository";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export class ListPaymentMethodDisplayUseCase implements UseCase<DataState<PaymentMethodCategoryEntity[]>, void> {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: void): Promise<DataState<PaymentMethodCategoryEntity[]>> {
    try {
      const session = await this.getSession();
      return this.paymentMethodRepository.listDisplay(session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async getSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
