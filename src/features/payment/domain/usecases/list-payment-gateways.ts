import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { UseCase } from "@/core/resources/use-case";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentGatewayRepository } from "@/features/payment/domain/repositories/payment-gateway";

export class ListPaymentGatewaysUseCase implements UseCase<DataState<PaymentGatewayEntity[]>, void> {
  constructor(
    public readonly paymentGatewayRepository: PaymentGatewayRepository,
    public readonly sessionRepository: SessionRepository
  ) {}

  public async execute(): Promise<DataState<PaymentGatewayEntity[]>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    return this.paymentGatewayRepository.listPaymentGateways(session.data);
  }
}